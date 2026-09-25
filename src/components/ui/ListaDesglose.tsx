import type { ReactNode } from "react";

export interface FilaDesglose {
  /** Icono opcional a la izquierda. */
  icono?: ReactNode;
  etiqueta: string;
  valor: ReactNode;
  /** Clase de color del valor (`text-exito`, `text-peligro`, …). */
  claseValor?: string;
}

/**
 * Lista de "etiqueta … valor" con separadores.
 *
 * Es el desglose que aparece en varias tarjetas del panel (pedidos por estado,
 * estado de los domiciliarios, restaurantes). Se extrajo al tercer uso: antes
 * cada tarjeta repetía el mismo `<ul>` con sus bordes y su alineación.
 */
export function ListaDesglose({ filas }: { filas: FilaDesglose[] }) {
  return (
    <ul className="flex flex-col">
      {filas.map((fila) => (
        <li
          key={fila.etiqueta}
          className="flex items-center gap-2.5 border-b border-borde-suave py-2.5 text-[13px] last:border-b-0"
        >
          {fila.icono}
          <span className="flex-1 text-texto-2">{fila.etiqueta}</span>
          <span className={`font-bold tabular-nums ${fila.claseValor ?? ""}`}>{fila.valor}</span>
        </li>
      ))}
    </ul>
  );
}
