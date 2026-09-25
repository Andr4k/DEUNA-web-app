import { Icono } from "@/components/ui/Icono";
import { Tarjeta } from "@/components/ui/Tarjeta";
import { duracion, moneda, numero } from "@/lib/formato";
import type { NombreIcono } from "@/lib/iconos";
import type { PaginaPedidos } from "@/lib/tipos/pedido";

/**
 * Franja de indicadores de la pantalla de pedidos.
 *
 * Se arma SOLO con lo que devuelve el endpoint: el total sin asignar (global, con
 * los filtros aplicados) y tres agregados de la página que se está viendo. Cada
 * tarjeta dice su alcance —"Con los filtros actuales" o "En esta página"— porque
 * `total` cuenta todo el listado y los otros tres cuentan las filas visibles:
 * mostrarlos juntos sin decirlo haría leer un número de 20 filas como si fuera el
 * de toda la red.
 *
 * **No usa el `Kpi` de `ui/` a propósito.** Ese componente exige una variación y
 * la rotula "vs ayer", y este endpoint no trae ninguna comparación contra el día
 * anterior: un "▲ 18% vs ayer" acá sería un dato inventado, que es justo lo que se
 * quitó del menú y del encabezado. Se compone con `Tarjeta`, que es la primitiva
 * de contenedor, en lugar de fabricar la comparación.
 */
export async function ResumenPedidos({ datos }: { datos: Promise<PaginaPedidos> }) {
  const { items, total } = await datos;

  const prioridadAlta = items.filter((pedido) => pedido.prioridad === "Alta").length;
  const esperaMasLarga = items.reduce((mayor, p) => Math.max(mayor, p.minutosEsperando), 0);
  const domicilios = items.reduce((suma, p) => suma + p.valorDomicilio, 0);

  return (
    <section
      aria-label="Resumen de pedidos sin asignar"
      className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
    >
      <Indicador
        icono="pedidos"
        color="text-morado"
        etiqueta="Sin asignar"
        valor={numero(total)}
        alcance="Con los filtros actuales"
      />
      <Indicador
        icono="alerta"
        color="text-peligro"
        etiqueta="Prioridad alta"
        valor={numero(prioridadAlta)}
        alcance="En esta página"
      />
      <Indicador
        icono="reloj"
        color="text-alerta"
        etiqueta="Espera más larga"
        valor={items.length > 0 ? duracion(esperaMasLarga) : "—"}
        alcance="En esta página"
      />
      <Indicador
        icono="dolar"
        color="text-exito"
        etiqueta="Domicilios por asignar"
        valor={moneda(domicilios)}
        alcance="En esta página"
      />
    </section>
  );
}

interface Props {
  icono: NombreIcono;
  /** Clase de color del icono (`text-peligro`, `text-exito`, …). */
  color: string;
  etiqueta: string;
  valor: string;
  /** De dónde sale el número. Va siempre: sin esto, un agregado de la página se lee como global. */
  alcance: string;
}

/**
 * Tarjeta de un indicador.
 *
 * Es local y no sube a `ui/` porque no tiene la fila de tendencia del `Kpi` ni
 * recibe variación: lo único que comparte con aquel es el orden icono / etiqueta /
 * valor. Subirla sería crear un segundo `Kpi` con menos props, y el próximo que
 * busque "un indicador" no sabría cuál usar.
 */
function Indicador({ icono, color, etiqueta, valor, alcance }: Props) {
  return (
    <Tarjeta>
      <div className="flex gap-3.5">
        <span className="grid size-10 shrink-0 place-items-center rounded-[10px] border border-borde bg-panel-alt">
          <Icono nombre={icono} tamano={22} className={color} />
        </span>

        <div className="flex min-w-0 flex-col">
          <span className="text-[11px] font-semibold tracking-[0.03em] text-texto-2 uppercase">
            {etiqueta}
          </span>
          <span className="text-[28px] leading-tight font-bold">{valor}</span>
          <span className="text-xs text-texto-3">{alcance}</span>
        </div>
      </div>
    </Tarjeta>
  );
}
