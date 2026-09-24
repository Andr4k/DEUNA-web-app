import { Icono } from "@/components/ui/Icono";

interface Props {
  /** Nombre del icono del set (`Icono.tsx`). */
  icono: string;
  /** Clase de color del icono, p. ej. `text-exito`. */
  colorIcono?: string;
  etiqueta: string;
  valor: string;
  periodo?: string;
  variacion: string;
  /** `true` cuando la variación es negativa respecto de ayer. */
  baja?: boolean;
  /** Acción opcional en la fila de la tendencia (p. ej. "Ver finanzas"). */
  accion?: React.ReactNode;
}

/**
 * Indicador de la fila superior del panel.
 *
 * La tendencia va SIEMPRE debajo del número, separada por una línea, como en
 * el mockup: es lo que mantiene las cinco tarjetas alineadas entre sí.
 */
export function Kpi({
  icono,
  colorIcono = "text-texto-2",
  etiqueta,
  valor,
  periodo,
  variacion,
  baja = false,
  accion,
}: Props) {
  return (
    <article className="min-w-0 rounded-tarjeta border border-borde bg-panel p-4 shadow-[0_1px_2px_rgba(0,0,0,0.3),0_1px_3px_rgba(0,0,0,0.15)]">
      <div className="flex gap-3.5">
        <span className="grid size-10 shrink-0 place-items-center rounded-[10px] border border-borde bg-panel-alt">
          <Icono nombre={icono} tamano={22} className={colorIcono} />
        </span>

        <div className="flex min-w-0 flex-col">
          <span className="text-[11px] font-semibold tracking-[0.03em] text-texto-2 uppercase">
            {etiqueta}
          </span>
          <span className="text-[28px] leading-tight font-bold">{valor}</span>
          {periodo ? <span className="text-xs text-texto-3">{periodo}</span> : null}
        </div>
      </div>

      <div
        className={`mt-2.5 flex items-center gap-1.5 border-t border-borde-suave pt-2.5 text-xs ${
          baja ? "text-peligro" : "text-exito"
        }`}
      >
        <span>{variacion}</span>
        <span className="text-texto-3">vs ayer</span>
        {accion ? <span className="ml-auto">{accion}</span> : null}
      </div>
    </article>
  );
}
