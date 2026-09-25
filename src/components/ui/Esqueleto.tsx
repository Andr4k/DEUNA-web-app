/**
 * Esqueleto de carga.
 *
 * Se usa mientras el servidor resuelve los datos de una sección (`loading.tsx`
 * o `<Suspense>`). Es preferible a un spinner centrado: mantiene la forma del
 * contenido, así el salto al llegar los datos es mínimo.
 */

interface Props {
  /** Alto en píxeles. */
  alto?: number;
  /** Ancho en porcentaje, para simular texto de distinto largo. */
  ancho?: string;
  className?: string;
}

export function Esqueleto({ alto = 16, ancho = "100%", className = "" }: Props) {
  return (
    <span
      aria-hidden="true"
      style={{ height: alto, width: ancho }}
      className={`block animate-pulse rounded-control bg-borde ${className}`}
    />
  );
}

/** Esqueleto con la forma de una tarjeta, para los `loading.tsx` de cada ruta. */
export function EsqueletoTarjeta({ lineas = 3 }: { lineas?: number }) {
  return (
    <div className="rounded-tarjeta border border-borde bg-panel p-4">
      <Esqueleto alto={12} ancho="35%" className="mb-4" />
      <div className="flex flex-col gap-3">
        {Array.from({ length: lineas }, (_, i) => (
          <Esqueleto key={i} alto={14} ancho={`${90 - i * 12}%`} />
        ))}
      </div>
    </div>
  );
}
