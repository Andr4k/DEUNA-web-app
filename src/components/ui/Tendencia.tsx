import { Icono } from "@/components/ui/Icono";

interface Props {
  /** Variación contra el período anterior. Negativa = bajó. */
  valor: number;
  /** Qué se está comparando ("vs ayer"). */
  etiqueta: string;
  /**
   * Color del indicador.
   *
   * Por defecto, subir es verde y bajar es rojo. En los indicadores donde bajar
   * es la buena noticia (incidencias, tiempo de entrega) hay que pasar
   * `bajarEsBueno`, si no el color miente.
   */
  bajarEsBueno?: boolean;
  /** Variación en porcentaje en lugar de unidades. */
  porcentaje?: boolean;
}

/**
 * Variación de un indicador: "▲ 18 vs ayer".
 *
 * Se extrajo porque el mismo bloque estaba repetido en el KPI y en la tarjeta de
 * rendimiento, y con dos copias el día que cambie el formato de la flecha se
 * arregla una sola.
 */
export function Tendencia({
  valor,
  etiqueta,
  bajarEsBueno = false,
  porcentaje = false,
}: Props) {
  const sube = valor >= 0;
  const esBueno = sube !== bajarEsBueno;

  const color = esBueno ? "text-exito" : "text-peligro";
  const flecha = sube ? "flecha-arriba" : "flecha-abajo";
  const numero = porcentaje ? `${Math.abs(valor)}%` : Math.abs(valor);

  return (
    <span className={`inline-flex items-center gap-1 text-[12px] font-semibold ${color}`}>
      <Icono nombre={flecha} tamano={13} />
      {numero}
      <span className="font-normal text-texto-3">{etiqueta}</span>
    </span>
  );
}
