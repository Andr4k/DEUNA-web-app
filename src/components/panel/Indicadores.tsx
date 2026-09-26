import { EnlaceAccion } from "@/components/ui/EnlaceAccion";
import { Kpi } from "@/components/ui/Kpi";
import { moneda, numero, variacion, variacionMoneda } from "@/lib/formato";
import type { ResumenPanel } from "@/lib/tipos/metricas";

/**
 * Fila superior del panel: los cinco indicadores del día.
 *
 * Recibe la **promesa** de los datos y la espera acá adentro. Eso es lo que permite
 * que la página renderice el resto del panel mientras estos números llegan: cada
 * sección tiene su propio límite de Suspense y no espera a las demás.
 *
 * Las variaciones vienen del backend como diferencia absoluta contra ayer (no como
 * porcentaje), así que se muestran en su unidad: pedidos de más, pesos de más.
 */
export async function Indicadores({ datos }: { datos: Promise<ResumenPanel> }) {
  const { indicadores: i } = await datos;

  return (
    <section aria-label="Indicadores del día" className="grid gap-4 xl:grid-cols-[repeat(4,1fr)_1.3fr]">
      <Kpi
        icono="bolsa"
        colorIcono="text-morado"
        etiqueta="Pedidos totales"
        valor={numero(i.pedidosTotales)}
        periodo="Hoy"
        variacion={variacion(i.variacion.pedidosTotales, "")}
        baja={i.variacion.pedidosTotales < 0}
      />
      <Kpi
        icono="moto"
        colorIcono="text-info"
        etiqueta="En curso"
        valor={numero(i.pedidosEnCurso)}
        periodo="Ahora"
        variacion={variacion(i.variacion.pedidosEnCurso, "")}
        baja={i.variacion.pedidosEnCurso < 0}
      />
      <Kpi
        icono="check"
        colorIcono="text-exito"
        etiqueta="Entregados"
        valor={numero(i.pedidosEntregados)}
        periodo="Hoy"
        variacion={variacion(i.variacion.pedidosEntregados, "")}
        baja={i.variacion.pedidosEntregados < 0}
      />
      {/*
        El backend todavía no tiene un modelo de incidencias: su campo `incidencias`
        son los pedidos cancelados del día. Se etiqueta por lo que realmente es, en
        lugar de mostrar un número que dice "incidencias" y significa otra cosa.
      */}
      <Kpi
        icono="triangulo"
        colorIcono="text-alerta"
        etiqueta="Cancelados"
        valor={numero(i.incidencias)}
        periodo="Hoy"
        variacion={variacion(i.variacion.incidencias, "")}
        baja={i.variacion.incidencias > 0}
      />
      <Kpi
        icono="dolar"
        colorIcono="text-exito"
        etiqueta="Recaudo DEUNA (hoy)"
        valor={moneda(i.recaudo)}
        variacion={variacionMoneda(i.variacion.recaudo)}
        accion={<EnlaceAccion href="/finanzas">Ver finanzas</EnlaceAccion>}
      />
    </section>
  );
}
