import Link from "next/link";

import { BarraFiltros, type Filtro } from "@/components/ui/BarraFiltros";
import { ESTADOS_USUARIO, TIPOS_USUARIO } from "@/lib/tipos/usuarios";

/**
 * Filtros del listado de usuarios.
 *
 * Los filtros viven en la URL, como en el resto del portal: `BarraFiltros` escribe el
 * parámetro y el servidor vuelve a resolver la pantalla con él aplicado, así el enlace es
 * compartible y el botón "atrás" funciona. Por eso "Limpiar filtros" es un enlace a la
 * ruta pelada y no un botón.
 *
 * Este componente NO lleva `use client`: el único control interactivo es `BarraFiltros`,
 * que ya es de cliente, y acá solo se lo compone con el enlace de limpiar. Marcarlo como
 * cliente mandaría al navegador un componente que no hace nada del lado del cliente.
 *
 * Las opciones de los dos selectores salen del catálogo del contrato
 * —`TIPOS_USUARIO` y `ESTADOS_USUARIO`— y no de una lista escrita acá: así, el día que
 * el backend sume un tipo, la opción aparece sola y la validación de la URL ya la
 * acepta. Una lista copiada en este archivo se desactualizaría sin que nadie se entere.
 */
const FILTROS: Filtro[] = [
  {
    clave: "tipo",
    etiqueta: "Tipo de usuario",
    valorInicial: "",
    opciones: [{ valor: "", etiqueta: "Todos los tipos" }, ...opcionesDe(TIPOS_USUARIO)],
  },
  {
    clave: "estado",
    etiqueta: "Estado",
    valorInicial: "",
    opciones: [{ valor: "", etiqueta: "Todos los estados" }, ...opcionesDe(ESTADOS_USUARIO)],
  },
];

/** Cada valor del catálogo se ofrece con su propio nombre, que ya es el del operador. */
function opcionesDe(valores: readonly string[]): Filtro["opciones"] {
  return valores.map((valor) => ({ valor, etiqueta: valor }));
}

export function FiltrosUsuarios() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex min-w-64 flex-1 items-center">
        <BarraFiltros
          filtros={FILTROS}
          placeholderBusqueda="Nombre o email…"
          claveBusqueda="buscar"
        />
      </div>

      <Link
        href="/usuarios"
        className="inline-flex items-center gap-2 rounded-control border border-borde px-4 py-2.5 text-[13px] font-semibold text-texto transition-colors hover:bg-panel-hover"
      >
        Limpiar filtros
      </Link>
    </div>
  );
}
