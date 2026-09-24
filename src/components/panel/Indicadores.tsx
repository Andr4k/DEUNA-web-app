import { EnlaceAccion } from "@/components/ui/EnlaceAccion";
import { Kpi } from "@/components/ui/Kpi";
import { INDICADORES } from "@/lib/datos-ejemplo";
import { moneda, numero, variacion } from "@/lib/formato";

/**
 * Fila superior del panel: los cinco indicadores del día.
 *
 * Los datos son de ejemplo (ver `lib/datos-ejemplo.ts`). Cuando exista
 * `GET /api/v1/metrics/panel`, este componente recibe el objeto por props y deja
 * de importar los datos de ejemplo.
 */
export function Indicadores() {
  const i = INDICADORES;

  return (
    <section aria-label="Indicadores del día" className="grid gap-4 xl:grid-cols-[repeat(4,1fr)_1.3fr]">
      <Kpi
        icono="bolsa"
        colorIcono="text-morado"
        etiqueta="Pedidos totales"
        valor={numero(i.pedidosTotales)}
        periodo="Hoy"
        variacion={variacion(i.variacion.pedidosTotales)}
      />
      <Kpi
        icono="moto"
        colorIcono="text-info"
        etiqueta="En curso"
        valor={numero(i.pedidosEnCurso)}
        periodo="Ahora"
        variacion={variacion(i.variacion.pedidosEnCurso, "")}
      />
      <Kpi
        icono="check"
        colorIcono="text-exito"
        etiqueta="Entregados"
        valor={numero(i.pedidosEntregados)}
        periodo="Hoy"
        variacion={variacion(i.variacion.pedidosEntregados)}
      />
      <Kpi
        icono="triangulo"
        colorIcono="text-alerta"
        etiqueta="Incidencias"
        valor={numero(i.incidencias)}
        periodo="Hoy"
        variacion={variacion(i.variacion.incidencias, "")}
        baja
      />
      <Kpi
        icono="dolar"
        colorIcono="text-exito"
        etiqueta="Recaudo DEUNA (hoy)"
        valor={moneda(i.recaudo)}
        variacion={variacion(i.variacion.recaudo)}
        accion={<EnlaceAccion href="/finanzas">Ver finanzas</EnlaceAccion>}
      />
    </section>
  );
}
