"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Avatar } from "@/components/ui/Avatar";
import { Icono } from "@/components/ui/Icono";
import { NAVEGACION } from "@/lib/navegacion";
import { USUARIO_ACTUAL } from "@/lib/sesion";

/**
 * Barra lateral del portal.
 *
 * Los ítems salen de `NAVEGACION`, así que agregar una pantalla no toca este
 * archivo. Es cliente solo por el estado activo (`usePathname`).
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

            {seccion.items.map((item) => {
              const activo = ruta === item.href;

              return (
                <Link
                  key={item.href}
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
            })}
          </div>
        ))}
      </nav>

      <div className="mt-3 border-t border-borde px-5 pt-4">
        <div className="flex items-center gap-2.5">
          <Avatar />
          <div className="flex min-w-0 flex-col">
            <span className="text-[13px] font-semibold">{USUARIO_ACTUAL.nombre}</span>
            <span className="text-xs text-texto-2">{USUARIO_ACTUAL.rol}</span>
            <span className="mt-0.5 inline-flex items-center gap-1.5 text-xs text-texto-2">
              <span className="size-2 shrink-0 rounded-full bg-exito" />
              En línea
            </span>
          </div>
        </div>
      </div>

      <div className="mt-3.5 border-t border-borde-suave px-5 pt-3.5 text-[11px] leading-relaxed text-texto-3">
        DEUNA DOMICILIOS
        <br />
        Versión 1.0.0
      </div>
    </aside>
  );
}

/**
 * Marca de DEUNA.
 *
 * Va en SVG para que escale y tome el color de marca; el día que exista el
 * logotipo definitivo se reemplaza solo este componente.
 */
function Marca() {
  return (
    <svg width="34" height="34" viewBox="0 0 40 40" aria-hidden="true" className="shrink-0">
      <path
        d="M6 34V10a6 6 0 0 1 6-6h9c8 0 13 5 13 12s-5 12-13 12h-5v6z"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinejoin="round"
        className="text-acento"
      />
      <path d="M14 12h7c3.3 0 5 1.6 5 4s-1.7 4-5 4h-7z" className="fill-acento" />
    </svg>
  );
}
