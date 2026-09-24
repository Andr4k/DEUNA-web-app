interface Props {
  /** 0 a 100. */
  porcentaje: number;
  /** Texto del centro; si no se pasa, se muestra el porcentaje. */
  texto?: string;
  tamano?: number;
}

/**
 * Anillo de progreso.
 *
 * Es SVG y no un `conic-gradient` porque el trazo necesita remates redondeados
 * y una transición limpia cuando el valor cambia.
 */
export function Anillo({ porcentaje, texto, tamano = 78 }: Props) {
  const radio = (tamano - 10) / 2;
  const circunferencia = 2 * Math.PI * radio;
  const avance = (Math.min(Math.max(porcentaje, 0), 100) / 100) * circunferencia;

  return (
    <div className="relative" style={{ width: tamano, height: tamano }}>
      <svg width={tamano} height={tamano} viewBox={`0 0 ${tamano} ${tamano}`} className="-rotate-90">
        <circle
          className="anillo__pista"
          cx={tamano / 2}
          cy={tamano / 2}
          r={radio}
          fill="none"
          strokeWidth={6}
        />
        <circle
          className="anillo__valor"
          cx={tamano / 2}
          cy={tamano / 2}
          r={radio}
          fill="none"
          strokeWidth={6}
          strokeDasharray={`${avance} ${circunferencia}`}
        />
      </svg>

      <span className="absolute inset-0 grid place-items-center text-[19px] font-bold">
        {texto ?? `${Math.round(porcentaje)}%`}
      </span>
    </div>
  );
}
