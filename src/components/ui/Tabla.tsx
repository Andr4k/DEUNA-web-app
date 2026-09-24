import type { ReactNode } from "react";

/**
 * Tabla de datos.
 *
 * Recibe las columnas y las filas, y se encarga del marcado, la alineación y el
 * desplazamiento horizontal. Existe para que ninguna pantalla vuelva a escribir
 * `<thead>`/`<tbody>` ni repita las clases de la tabla: sin esto, el listado de
 * pedidos, el de restaurantes y el de domiciliarios terminan con tres tablas
 * copiadas que se van separando entre sí.
 *
 * No incluye filtros ni paginación a propósito: esos son `BarraFiltros` y
 * `Paginacion`, y se componen alrededor. Una tabla que también filtra y pagina
 * es el componente enorme que se quiere evitar.
 */

export interface Columna<T> {
  /** Identificador único de la columna (no se muestra). */
  clave: string;
  /** Encabezado visible. */
  titulo: string;
  /** Cómo se dibuja la celda. Recibe la fila completa. */
  render: (fila: T) => ReactNode;
  /** Alinea a la derecha: para cifras, dinero y tiempos. */
  numerica?: boolean;
  /** Clase extra para la celda (colores de estado, tipografías). */
  clase?: string;
}

interface Props<T> {
  columnas: Columna<T>[];
  filas: T[];
  /** Identificador estable de cada fila. */
  claveFila: (fila: T) => string;
  /** Versión compacta: para tarjetas angostas con muchas columnas. */
  compacta?: boolean;
  /** Se muestra cuando no hay filas. */
  sinDatos?: ReactNode;
}

export function Tabla<T>({
  columnas,
  filas,
  claveFila,
  compacta = false,
  sinDatos,
}: Props<T>) {
  if (filas.length === 0 && sinDatos) {
    return <>{sinDatos}</>;
  }

  return (
    <div className="tabla-scroll">
      <table className={`tabla ${compacta ? "tabla--compacta" : ""}`}>
        <thead>
          <tr>
            {columnas.map((columna) => (
              <th key={columna.clave} className={columna.numerica ? "num" : undefined}>
                {columna.titulo}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filas.map((fila) => (
            <tr key={claveFila(fila)}>
              {columnas.map((columna) => (
                <td
                  key={columna.clave}
                  className={`${columna.numerica ? "num" : ""} ${columna.clase ?? ""}`.trim() || undefined}
                >
                  {columna.render(fila)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
