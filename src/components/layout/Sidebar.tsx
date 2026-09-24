"use client";

import { usePathname } from "next/navigation";

import { EnlaceNav } from "@/components/layout/EnlaceNav";
import { Marca } from "@/components/layout/Marca";
import { UsuarioActual } from "@/components/layout/UsuarioActual";
import { NAVEGACION } from "@/lib/navegacion";

/**
 * Barra lateral del portal.
 *
 * Es solo la estructura: la marca, la navegación y el pie viven en sus propios
 * componentes. Los ítems salen de `NAVEGACION`, así que agregar una pantalla no
 * toca este archivo.
 *
 * Es cliente únicamente por el estado activo (`usePathname`); no pide datos.
 */
export function Sidebar() {
  const ruta = usePathname();

  return (
    <aside className="flex w-[260px] shrink-0 flex-col border-r border-borde bg-fondo pt-5 pb-4">
      <div className="flex items-center gap-2.5 px-5 pb-6">
        <Marca />
        <div className="flex flex-col leading-none">
          <span className="text-lg font-extrabold tracking-wide">DEUNA</span>
          <span className="text-[10px] font-bold tracking-[0.14em] text-acento uppercase">
            Domicilios
          </span>
        </div>
      </div>

      <nav aria-label="Navegación principal" className="flex-1 overflow-y-auto px-3">
        {NAVEGACION.map((seccion) => (
          <div key={seccion.titulo}>
            <p className="px-2 pt-3.5 pb-2 text-[11px] tracking-[0.08em] text-texto-3 uppercase">
              {seccion.titulo}
            </p>

            {seccion.items.map((item) => (
              <EnlaceNav key={item.href} item={item} activo={ruta === item.href} />
            ))}
          </div>
        ))}
      </nav>

      <div className="mt-3 border-t border-borde px-5 pt-4">
        <UsuarioActual />
      </div>

      <div className="mt-3.5 border-t border-borde-suave px-5 pt-3.5 text-[11px] leading-relaxed text-texto-3">
        DEUNA DOMICILIOS
        <br />
        Versión 1.0.0
      </div>
    </aside>
  );
}
