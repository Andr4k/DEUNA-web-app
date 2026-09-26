import { Anillo } from "@/components/ui/Anillo";
import { Icono } from "@/components/ui/Icono";
import { Tarjeta } from "@/components/ui/Tarjeta";
import type { RendimientoDelDia } from "@/lib/tipos/metricas";

/**
 * Rendimiento general del día.
 *
 * El backend devuelve CUÁNTAS entregas llegaron a tiempo, no el porcentaje, así que
 * la división se hace acá: es presentación, no un agregado. Se calcula sobre las
 * entregas medidas, y si no hubo ninguna el anillo queda en 0 en lugar de dividir
 * por cero.
 *
 * La meta de 40 minutos para el anillo del tiempo es la misma que usa el servicio de
 * métricas para decidir qué es "a tiempo". Cuando el pedido guarde su propio tiempo
 * prometido, ese número tendrá que venir de la API y no de una constante acá.
 */
const META_MINUTOS = 40;

export async function Rendimiento({ rendimiento }: { rendimiento: Promise<RendimientoDelDia> }) {
  const r = await rendimiento;

  const porcentajeATiempo =
    r.entregasMedidas === 0 ? 0 : Math.round((r.entregasATiempo / r.entregasMedidas) * 100);

  const avanceTiempo =
    r.tiempoPromedioMin === 0
      ? 0
      : Math.max(0, Math.round((1 - r.tiempoPromedioMin / META_MINUTOS) * 100));

  return (
    <Tarjeta
      titulo="Rendimiento general (hoy)"
      pie={
        r.entregasMedidas > 0 ? (
          <span className="text-[11px] text-texto-3">
            Sobre {r.entregasMedidas} entregas medidas
          </span>
        ) : (
          <span className="text-[11px] text-texto-3">Todavía no hay entregas cerradas hoy</span>
        )
      }
    >
      <div className="flex justify-around gap-4 text-center">
        <div className="flex flex-col items-center gap-2">
          <Anillo porcentaje={porcentajeATiempo} />
          <span className="max-w-[130px] text-xs text-texto-2">% entregas a tiempo</span>
          <span className="text-xs text-texto-3">
            {r.entregasATiempo} de {r.entregasMedidas}
          </span>
        </div>

        <div className="flex flex-col items-center gap-2">
          <Anillo porcentaje={avanceTiempo} texto={`${r.tiempoPromedioMin} min`} />
          <span className="max-w-[130px] text-xs text-texto-2">Tiempo promedio de entrega</span>
          <span className="text-xs text-texto-3">meta {META_MINUTOS} min</span>
        </div>

        <div className="flex flex-col items-center gap-2">
          <span className="grid h-[78px] place-items-center">
            <Icono nombre="estrella" tamano={30} className="text-acento" />
          </span>
          <span className="text-[26px] leading-none font-bold">
            {r.calificacionPromedio.toFixed(1)}
          </span>
          <span className="max-w-[130px] text-xs text-texto-2">Calificación promedio</span>
          <span className="text-xs text-texto-3">de 5</span>
        </div>
      </div>
    </Tarjeta>
  );
}
