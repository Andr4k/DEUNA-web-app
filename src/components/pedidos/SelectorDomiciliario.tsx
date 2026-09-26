"use client";

import { useActionState } from "react";

import { asignarPedido, type ResultadoAsignacion } from "@/app/(portal)/pedidos/actions";
import { Aviso } from "@/components/ui/Aviso";
import { Boton } from "@/components/ui/Boton";
import { EstadoVacio } from "@/components/ui/EstadoVacio";
import { hora } from "@/lib/formato";
import type { CandidatoEntrega, CandidatosDePedido } from "@/lib/tipos/repartidor";

/**
 * Elección del domiciliario que toma el pedido.
 *
 * Es cliente porque el operador elige y confirma, pero NO pide datos: la lista de
 * candidatos llega resuelta desde el servidor (este componente no puede importar
 * `@/services`, y el linter lo sostiene) y la escritura pasa por la Server Action,
 * así el token no toca el navegador.
 *
 * El desplegable llega con el primero preseleccionado: el backend devuelve los
 * candidatos ordenados por distancia, así que el primero es el más cercano. Esa es
 * toda la "sugerencia": no hay asignación por IA ni automática — la decisión, y la
 * responsabilidad de asignar, son del operador.
 */
export function SelectorDomiciliario({ datos }: { datos: CandidatosDePedido }) {
  const [estado, enviar, enviando] = useActionState<ResultadoAsignacion, FormData>(
    asignarPedido,
    {},
  );

  if (datos.candidatos.length === 0) {
    return (
      <EstadoVacio
        icono="moto"
        titulo="Ningún domiciliario dentro del radio"
        descripcion={`El pedido ${datos.codigo} no tiene candidatos en ${datos.radioKm} km. Sin candidatos no hay a quién asignarlo desde acá.`}
      />
    );
  }

  return (
    <form action={enviar} className="flex flex-col gap-3">
      <input type="hidden" name="pedidoId" value={datos.pedidoId} />

      <label className="flex flex-col gap-1.5">
        <span className="text-[13px] font-medium text-texto-2">
          Domiciliario · {datos.total} dentro de {datos.radioKm} km
        </span>
        <select
          name="repartidorId"
          defaultValue={datos.candidatos[0].repartidorId}
          disabled={enviando}
          className="h-10 rounded-control border border-borde bg-fondo px-3 text-sm text-texto outline-none transition-colors focus:border-acento disabled:opacity-60"
        >
          {datos.candidatos.map((candidato) => (
            <option key={candidato.repartidorId} value={candidato.repartidorId}>
              {etiqueta(candidato)}
            </option>
          ))}
        </select>
      </label>

      <p className="m-0 text-[12px] text-texto-3">
        Ordenados por cercanía: el primero es el sugerido. El pedido no se asigna solo.
      </p>

      <Boton type="submit" variante="primario" disabled={enviando}>
        {enviando ? "Asignando…" : "Asignar pedido"}
      </Boton>

      {estado.error ? <Aviso tono="error">{estado.error}</Aviso> : null}
      {estado.exito ? <Aviso tono="exito">{estado.exito}</Aviso> : null}
    </form>
  );
}

/**
 * Texto de cada opción: nombre, distancia y qué está haciendo ahora.
 *
 * Cuando el domiciliario está ocupado se muestra DESDE CUÁNDO lo está
 * (`ocupadoDesde`), que es el dato que el backend devuelve. El diseño pedía
 * "Libera en" y "Tiempo llegada": el backend no calcula ninguno de los dos, y un
 * número puesto acá se leería como un compromiso de tiempo que el portal no puede
 * respaldar. El estado de la entrega en curso sí se muestra, porque existe.
 */
function etiqueta(candidato: CandidatoEntrega): string {
  const distancia = enKilometros(candidato.distanciaMetros);

  if (candidato.disponible) {
    return `${candidato.nombreCompleto} · ${distancia} · Disponible`;
  }

  const desde = candidato.ocupadoDesde ? ` desde las ${hora(candidato.ocupadoDesde)}` : "";
  const servicio = candidato.servicioActualCodigo ? ` en ${candidato.servicioActualCodigo}` : "";

  return `${candidato.nombreCompleto} · ${distancia} · Ocupado${servicio}${desde}`;
}

function enKilometros(metros: number): string {
  return `${(metros / 1000).toFixed(1).replace(".", ",")} km`;
}
