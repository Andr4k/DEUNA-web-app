import { Anillo } from "@/components/ui/Anillo";
import { Icono } from "@/components/ui/Icono";
import { Tarjeta } from "@/components/ui/Tarjeta";
import { RENDIMIENTO } from "@/lib/datos-ejemplo";
import { variacion } from "@/lib/formato";

/**
 * Rendimiento general del día.
 *
 * Los dos anillos comparten el componente `Anillo`; el tiempo promedio se
 * expresa como avance sobre una meta de 40 minutos, que es lo que le da sentido
 * visual al círculo (un "27 min" suelto no tiene porcentaje propio).
 */
const META_MINUTOS = 40;

export function Rendimiento() {
  const r = RENDIMIENTO;
  const avanceTiempo = Math.round((1 - r.tiempoPromedioMin / META_MINUTOS) * 100);

  return (
    <Tarjeta titulo="Rendimiento general (hoy)">
      <div className="flex justify-around gap-4 text-center">
        <div className="flex flex-col items-center gap-2">
          <Anillo porcentaje={r.entregasATiempo} />
          <span className="max-w-[130px] text-xs text-texto-2">% entregas a tiempo</span>
          <span className="text-xs text-exito">{variacion(4)}</span>
        </div>

        <div className="flex flex-col items-center gap-2">
          <Anillo porcentaje={avanceTiempo} texto={`${r.tiempoPromedioMin} min`} />
          <span className="max-w-[130px] text-xs text-texto-2">Tiempo promedio de entrega</span>
          <span className="text-xs text-exito">{variacion(-2, " min")}</span>
        </div>

        <div className="flex flex-col items-center gap-2">
          <span className="grid h-[78px] place-items-center">
            <Icono nombre="estrella" tamano={30} className="text-acento" />
          </span>
          <span className="text-[26px] leading-none font-bold">{r.calificacionPromedio.toFixed(1)}</span>
          <span className="max-w-[130px] text-xs text-texto-2">Calificación promedio</span>
          <span className="text-xs text-exito">{variacion(0.2, "")}</span>
        </div>
      </div>
    </Tarjeta>
  );
}
