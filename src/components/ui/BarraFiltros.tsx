"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

/**
 * Barra de filtros.
 *
 * Los filtros NO viven en el estado del componente: se escriben en la URL. Eso
 * hace que el servidor vuelva a resolver la pantalla con el filtro aplicado, que
 * el enlace sea compartible y que el botón "atrás" del navegador funcione. Si el
 * filtro viviera en `useState`, cada pantalla tendría que pedir los datos por su
 * cuenta desde el navegador y se pierde todo lo que da el enfoque servidor
 * primero.
 *
 * Es cliente porque el usuario interactúa, pero no pide datos: solo cambia la URL.
 */

export interface OpcionFiltro {
  valor: string;
  etiqueta: string;
}

export interface Filtro {
  /** Nombre del parámetro en la URL (`estado`, `zona`, …). */
  clave: string;
  etiqueta: string;
  /** Valor inicial mostrado cuando el parámetro no está en la URL. */
  valorInicial: string;
  opciones: OpcionFiltro[];
}

interface Props {
  filtros: Filtro[];
  /** Si se pasa, se muestra el buscador con este texto de ayuda. */
  placeholderBusqueda?: string;
  claveBusqueda?: string;
}

export function BarraFiltros({
  filtros,
  placeholderBusqueda,
  claveBusqueda = "q",
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [pendiente, iniciar] = useTransition();

  /** Cambia un parámetro y vuelve a la página 1 (un filtro nuevo invalida el paginado). */
  function aplicar(clave: string, valor: string) {
    const siguientes = new URLSearchParams(params.toString());
    if (valor) {
      siguientes.set(clave, valor);
    } else {
      siguientes.delete(clave);
    }
    siguientes.delete("pagina");

    iniciar(() => router.push(`${pathname}?${siguientes.toString()}`));
  }

  return (
    <div
      className={`flex flex-wrap items-center gap-2 ${pendiente ? "opacity-60" : ""}`}
      aria-busy={pendiente}
    >
      {placeholderBusqueda ? (
        <input
          type="search"
          defaultValue={params.get(claveBusqueda) ?? ""}
          placeholder={placeholderBusqueda}
          onChange={(evento) => aplicar(claveBusqueda, evento.target.value)}
          className="h-9 min-w-56 flex-1 rounded-control border border-borde bg-panel px-3 text-[13px] text-texto outline-none placeholder:text-texto-3 focus:border-acento"
        />
      ) : null}

      {filtros.map((filtro) => (
        <label key={filtro.clave} className="flex items-center gap-2">
          <span className="sr-only">{filtro.etiqueta}</span>
          <select
            value={params.get(filtro.clave) ?? filtro.valorInicial}
            onChange={(evento) => aplicar(filtro.clave, evento.target.value)}
            className="h-9 rounded-control border border-borde bg-panel px-2.5 text-[13px] text-texto outline-none focus:border-acento"
          >
            {filtro.opciones.map((opcion) => (
              <option key={opcion.valor} value={opcion.valor}>
                {opcion.etiqueta}
              </option>
            ))}
          </select>
        </label>
      ))}
    </div>
  );
}
