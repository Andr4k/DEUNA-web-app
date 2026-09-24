import Link from "next/link";

import { Icono } from "@/components/ui/Icono";

interface Props {
  href: string;
  children: React.ReactNode;
}

/**
 * Enlace de acción ("Ver todos →").
 *
 * Es un `<Link>` de verdad, no un botón: navega a otra pantalla y debe poder
 * abrirse en otra pestaña y ser rastreable.
 */
export function EnlaceAccion({ href, children }: Props) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 text-[13px] font-medium text-acento transition-colors hover:text-acento-claro"
    >
      {children}
      <Icono nombre="flecha" tamano={15} />
    </Link>
  );
}
