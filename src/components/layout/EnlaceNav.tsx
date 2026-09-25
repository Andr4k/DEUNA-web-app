import Link from "next/link";

import { Icono } from "@/components/ui/Icono";
import type { ItemNavegacion } from "@/lib/navegacion";

interface Props {
  item: ItemNavegacion;
  activo: boolean;
}

/**
 * Un enlace de la barra lateral.
 *
 * Se extrajo para que la barra no tenga que saber cómo se ve un ítem activo ni
 * cómo se dibuja el contador: agregar una pantalla sigue siendo solo agregar una
 * entrada a `NAVEGACION`.
 */
export function EnlaceNav({ item, activo }: Props) {
  return (
    <Link
      href={item.href}
      aria-current={activo ? "page" : undefined}
      className={`mb-0.5 flex items-center gap-3 rounded-r-control border-l-[3px] py-2.5 pr-4 pl-4 text-sm transition-colors ${
        activo
          ? "border-acento bg-borde font-semibold text-acento-claro"
          : "border-transparent text-texto-2 hover:bg-panel hover:text-texto"
      }`}
    >
      <Icono nombre={item.icono} />
      <span className="flex-1">{item.etiqueta}</span>

      {item.contador ? (
        <span className="inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-peligro px-1.5 text-[11px] font-bold text-white">
          {item.contador}
        </span>
      ) : null}
    </Link>
  );
}
