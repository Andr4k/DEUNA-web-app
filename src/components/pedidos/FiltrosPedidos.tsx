import Link from "next/link";

import { BarraFiltros, type Filtro } from "@/components/ui/BarraFiltros";

/**
 * Filtros de la lista de pedidos sin asignar.
 *
 * Los filtros no viven en estado: `BarraFiltros` los escribe en la URL y el
 * servidor vuelve a resolver la pantalla con ellos aplicados. Por eso "Limpiar
 * filtros" es un enlace a `/pedidos` y no un botón: limpiar filtros es navegar a la
 * URL sin parámetros, funciona sin JavaScript y el botón "atrás" del navegador
 * deshace la limpieza. Un `Boton` con `onClick` sería un botón que necesita
 * hidratación para hacer lo que un enlace ya hace.
 *
 * La ZONA va como texto y no como desplegable porque el portal no tiene el catálogo
 * de zonas: el listado de zonas de `metrics/zonas` es actividad del día (y solo
 * trae las que tuvieron pedidos), no el catálogo de cobertura. Un desplegable con
 * zonas escritas a mano en el portal sería una lista de datos inventados que se
 * desactualiza sola. El backend filtra por texto igual.
 *
 * Prioridad y Tiempo de espera sí son desplegables: los valores de prioridad son
 * los del backend ("Alta" | "Media" | "Baja") y los umbrales de espera son
 * decisiones del operador, no datos.
 */
const FILTROS: Filtro[] = [
  {
    clave: "prioridad",
    etiqueta: "Prioridad",
    valorInicial: "",
    opciones: [
      { valor: "", etiqueta: "Todas las prioridades" },
      { valor: "Alta", etiqueta: "Alta" },
      { valor: "Media", etiqueta: "Media" },
      { valor: "Baja", etiqueta: "Baja" },
    ],
  },
  {
    clave: "esperaMin",
    etiqueta: "Tiempo de espera",
    valorInicial: "",
    opciones: [
      { valor: "", etiqueta: "Cualquier espera" },
      { valor: "15", etiqueta: "Más de 15 min" },
      { valor: "30", etiqueta: "Más de 30 min" },
      { valor: "60", etiqueta: "Más de 1 hora" },
    ],
  },
];

export function FiltrosPedidos() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex min-w-64 flex-1 items-center">
        <BarraFiltros
          filtros={FILTROS}
          placeholderBusqueda="Filtrar por zona…"
          claveBusqueda="zona"
        />
      </div>

      <Link
        href="/pedidos"
        className="inline-flex items-center gap-2 rounded-control border border-borde px-4 py-2.5 text-[13px] font-semibold text-texto transition-colors hover:bg-panel-hover"
      >
        Limpiar filtros
      </Link>
    </div>
  );
}
