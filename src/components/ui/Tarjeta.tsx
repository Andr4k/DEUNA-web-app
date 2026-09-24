import type { ReactNode } from "react";

interface Props {
  titulo?: string;
  /** Acción de la cabecera, normalmente un `<EnlaceAccion />`. */
  accion?: ReactNode;
  /** Contenido que va después del cuerpo, separado por una línea. */
  pie?: ReactNode;
  className?: string;
  children: ReactNode;
}

/**
 * Contenedor base de todos los paneles del portal.
 *
 * Si se pasa `titulo`, la cabecera ya queda con la tipografía y la separación
 * correctas: no repetir esos estilos en cada pantalla.
 */
export function Tarjeta({ titulo, accion, pie, className = "", children }: Props) {
  return (
    <section
      className={`min-w-0 rounded-tarjeta border border-borde bg-panel p-4 shadow-[0_1px_2px_rgba(0,0,0,0.3),0_1px_3px_rgba(0,0,0,0.15)] ${className}`}
    >
      {titulo || accion ? (
        <div className="mb-3.5 flex items-center justify-between gap-3">
          {titulo ? (
            <h2 className="m-0 text-xs font-semibold tracking-[0.05em] text-texto-2 uppercase">
              {titulo}
            </h2>
          ) : (
            <span />
          )}
          {accion}
        </div>
      ) : null}

      {children}

      {pie ? <div className="mt-3.5 border-t border-borde-suave pt-3">{pie}</div> : null}
    </section>
  );
}
