import Link from "next/link";

import { Icono } from "@/components/ui/Icono";

interface Props {
  pagina: number;
  totalPaginas: number;
  /**
   * Arma el enlace de una página conservando los filtros activos.
   *
   * Se recibe como función para que el paginador no tenga que saber qué
   * parámetros usa cada pantalla: la pantalla es la dueña de su URL.
   */
  href: (pagina: number) => string;
}

/**
 * Paginación.
 *
 * Es un componente de SERVIDOR: son enlaces, no botones. No manda JavaScript al
 * navegador y funciona incluso antes de que React hidrate. Con el enfoque
 * servidor primero, paginar es navegar, no pedir datos desde el cliente.
 */
export function Paginacion({ pagina, totalPaginas, href }: Props) {
  if (totalPaginas <= 1) {
    return null;
  }

  return (
    <nav className="flex items-center justify-between gap-3 pt-3" aria-label="Paginación">
      <span className="text-[12px] text-texto-2">
        Página {pagina} de {totalPaginas}
      </span>

      <div className="flex items-center gap-1.5">
        <EnlacePagina
          href={href(pagina - 1)}
          habilitado={pagina > 1}
          etiqueta="Página anterior"
          icono="chevron-izquierda"
        />
        <EnlacePagina
          href={href(pagina + 1)}
          habilitado={pagina < totalPaginas}
          etiqueta="Página siguiente"
          icono="chevron-derecha"
        />
      </div>
    </nav>
  );
}

function EnlacePagina({
  href,
  habilitado,
  etiqueta,
  icono,
}: {
  href: string;
  habilitado: boolean;
  etiqueta: string;
  icono: string;
}) {
  const clases =
    "grid size-8 place-items-center rounded-control border border-borde bg-panel text-texto-2";

  if (!habilitado) {
    return (
      <span className={`${clases} opacity-40`} aria-disabled="true">
        <Icono nombre={icono} tamano={16} />
      </span>
    );
  }

  return (
    <Link href={href} aria-label={etiqueta} className={`${clases} hover:border-acento hover:text-texto`}>
      <Icono nombre={icono} tamano={16} />
    </Link>
  );
}
