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
 * Se extrajo para que la barra no tenga que saber cómo se ve un ítem activo:
 * agregar una pantalla sigue siendo solo agregar una entrada a `NAVEGACION`.
 *
 * No dibuja contadores. El mockup traía un badge con un número fijo al lado de
 * "Pedidos" y era mentira: un número inventado en un panel real se lee como dato.
 * El conteo real —los pedidos sin asignar— está en el panel, y ponerlo acá obligaría
 * al layout a depender del servicio de métricas en todas las pantallas.
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
    </Link>
  );
}
