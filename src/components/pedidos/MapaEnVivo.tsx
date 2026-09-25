"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

import { Aviso } from "@/components/ui/Aviso";
import { Esqueleto } from "@/components/ui/Esqueleto";
import { Icono } from "@/components/ui/Icono";
import { hora } from "@/lib/formato";
import { esDatosMapa, type DatosMapa, type ResultadoMapa } from "@/lib/tipos/mapa";

/**
 * Mapa de la operación en vivo.
 *
 * Es la isla de cliente de la sección: pide las tres capas cada 10 s y se las
 * entrega al dibujo. Vive separada de `RecuadroMapa` —que es servidor— por dos
 * motivos: el token está en una cookie `httpOnly` y los servicios son
 * `server-only`, así que el navegador no puede pedirle la flota a la API; y el
 * refresco es lo único de esta pantalla que se mueve solo.
 *
 * Pide contra la ruta del propio portal (`/api/mapa`), que lee la cookie en el
 * servidor y llama al gateway: el token nunca toca el navegador.
 */

/** Cada cuánto se vuelve a pedir el mapa. */
const CADA_MS = 10_000;

/** Alto del mapa. El esqueleto usa el mismo, para que no haya salto al cargar. */
const ALTO = 340;

/**
 * El dibujo se trae con `dynamic` y `ssr: false`: Leaflet toca `window` al
 * evaluarse, así que no puede pasar por el render del servidor. Va acá y no en
 * la página porque tiene que ser un componente de cliente quien lo importe —y
 * porque el mapa recibe los datos que esta isla mantiene en su estado.
 */
const Mapa = dynamic(
  () => import("@/components/pedidos/MapaOperacion").then((modulo) => modulo.MapaOperacion),
  { ssr: false, loading: () => <Esqueleto alto={ALTO} className="rounded-control" /> },
);

interface Estado {
  /**
   * Última respuesta válida. Se conserva cuando un refresco falla: el mapa
   * viejo es más útil que un mapa en blanco, y la hora dice qué tan viejo es.
   */
  datos: DatosMapa | null;
  actualizado: Date | null;
  /** Motivo del último fallo, tal como lo explicó el servidor. */
  motivo: string | null;
}

export function MapaEnVivo() {
  const { datos, actualizado, motivo } = useMapa();

  return (
    <div className="flex flex-col gap-3">
      <LineaEstado actualizado={actualizado} motivo={motivo} />

      {motivo ? <Aviso tono="error">{motivo}</Aviso> : null}

      {datos ? <Dibujo datos={datos} /> : null}
      {!datos && !motivo ? <Esqueleto alto={ALTO} className="rounded-control" /> : null}
    </div>
  );
}

/** El mapa y, cuando corresponde, el aviso de que nadie reporta posición. */
function Dibujo({ datos }: { datos: DatosMapa }) {
  const aviso = avisoSinPosiciones(datos);

  return (
    <>
      {aviso ? <Aviso tono="info">{aviso}</Aviso> : null}
      <Mapa datos={datos} />
    </>
  );
}

/**
 * Pide el mapa al montar y lo vuelve a pedir cada 10 s.
 *
 * El pedido siguiente se agenda cuando termina el anterior, no con un
 * `setInterval`: si el gateway tarda más que el intervalo, un intervalo fijo
 * apila peticiones que ya no sirven y termina pintando una posición vieja como
 * si fuera la última.
 */
function useMapa(): Estado {
  const [estado, setEstado] = useState<Estado>({ datos: null, actualizado: null, motivo: null });

  useEffect(() => {
    let activo = true;
    let siguiente: ReturnType<typeof setTimeout>;

    async function refrescar() {
      const resultado = await pedirMapa();
      if (!activo) return;

      setEstado((previo) =>
        resultado.ok
          ? { datos: resultado.datos, actualizado: new Date(), motivo: null }
          : { ...previo, motivo: resultado.motivo },
      );

      siguiente = setTimeout(refrescar, CADA_MS);
    }

    void refrescar();

    return () => {
      activo = false;
      clearTimeout(siguiente);
    };
  }, []);

  return estado;
}

/**
 * Una consulta al endpoint del mapa.
 *
 * Devuelve un resultado en vez de lanzar: un fallo del mapa no puede llevarse
 * puesta la pantalla de pedidos, y el motivo que da el backend es el diagnóstico
 * que el operador necesita, así que se muestra tal cual.
 */
async function pedirMapa(): Promise<ResultadoMapa> {
  try {
    const respuesta = await fetch("/api/mapa", { cache: "no-store" });

    // El middleware manda al login cuando la sesión venció y `fetch` sigue esa
    // redirección: sin mirarla, el cuerpo sería HTML y el problema aparecería
    // recién al dibujar, lejos de su causa.
    if (respuesta.redirected && new URL(respuesta.url).pathname === "/login") {
      return { ok: false, motivo: "Tu sesión venció. Volvé a entrar para ver el mapa." };
    }

    const cuerpo: unknown = await respuesta.json().catch(() => null);

    if (!respuesta.ok) {
      return {
        ok: false,
        motivo: mensajeDe(cuerpo) ?? `El servidor respondió ${respuesta.status} y no explicó por qué.`,
      };
    }

    if (!esDatosMapa(cuerpo)) {
      return { ok: false, motivo: "La respuesta no tiene la forma del mapa de la operación." };
    }

    return { ok: true, datos: cuerpo };
  } catch {
    return { ok: false, motivo: "No se pudo consultar el mapa: la petición no llegó al servidor." };
  }
}

/** El `message` del error del backend, si vino uno. */
function mensajeDe(cuerpo: unknown): string | null {
  if (!cuerpo || typeof cuerpo !== "object") return null;

  const mensaje = (cuerpo as { message?: unknown }).message;
  return typeof mensaje === "string" && mensaje.trim() ? mensaje : null;
}

/**
 * Cuándo se actualizó por última vez.
 *
 * Sin esta línea, un mapa quieto porque nadie se movió y un mapa caído se ven
 * idénticos: la hora es lo único que los distingue.
 */
function LineaEstado({ actualizado, motivo }: { actualizado: Date | null; motivo: string | null }) {
  return (
    <p className="m-0 flex items-center gap-1.5 text-[12px] text-texto-3">
      <Icono nombre="reloj" tamano={13} />
      {textoDeEstado(actualizado, motivo)}
    </p>
  );
}

/**
 * Qué dice la línea de estado.
 *
 * No dice "Consultando" cuando el primer pedido ya falló: el aviso de abajo
 * explica el motivo, y una línea que afirme que sigue esperando lo contradice.
 */
function textoDeEstado(actualizado: Date | null, motivo: string | null): string {
  if (actualizado) return `Última actualización: ${hora(actualizado)}`;
  if (motivo) return "Todavía no hay una lectura válida del mapa.";
  return "Consultando el mapa…";
}

/**
 * Qué decir cuando ningún domiciliario reporta posición.
 *
 * Es el estado que el mapa no puede dibujar y el que más se malinterpreta: una
 * flota sin señal se lee como "no tengo domiciliarios". Por eso el texto
 * distingue los dos casos —sin ninguna posición y con posiciones viejas—, que el
 * mapa dibuja igual pero significan cosas distintas. `null` cuando sí hay
 * telemetría vigente.
 */
function avisoSinPosiciones(datos: DatosMapa): string | null {
  const vigentes = datos.domiciliarios.filter((domiciliario) => domiciliario.vigente).length;
  if (vigentes > 0) return null;

  if (datos.domiciliarios.length === 0) {
    return "Ningún domiciliario reporta posición. No es lo mismo que no haber domiciliarios: la red puede tenerlos y ninguno estar enviando su ubicación en este momento. Los pedidos y los restaurantes con punto de entrega se siguen viendo.";
  }

  return `Ninguno de los ${datos.domiciliarios.length} domiciliarios reporta una posición vigente: lo que se ve son sus últimas posiciones conocidas, marcadas con el círculo punteado, no dónde están ahora.`;
}
