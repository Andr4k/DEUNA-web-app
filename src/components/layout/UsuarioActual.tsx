"use client";

import { cerrarSesion } from "@/app/login/actions";
import { Avatar } from "@/components/ui/Avatar";
import { Icono } from "@/components/ui/Icono";
import { etiquetaDeRol, inicialesDe } from "@/lib/sesion";
import type { UsuarioSesion } from "@/lib/tipos/sesion";

/**
 * Usuario con la sesión abierta, y la salida.
 *
 * El cierre de sesión es un `<form>` con la Server Action: funciona sin
 * JavaScript y no necesita estado. Un `onClick` que llame a la acción sería más
 * código para hacer lo mismo peor.
 */
export function UsuarioActual({ usuario }: { usuario: UsuarioSesion }) {
  return (
    <div className="flex items-center gap-2.5">
      <Avatar iniciales={inicialesDe(usuario.nombre)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-[13px] font-semibold" title={usuario.nombre}>
          {usuario.nombre}
        </span>
        <span className="text-xs text-texto-2">{etiquetaDeRol(usuario.rol)}</span>
        <span className="mt-0.5 inline-flex items-center gap-1.5 text-xs text-texto-2">
          <span className="size-2 shrink-0 rounded-full bg-exito" />
          En línea
        </span>
      </div>

      <form action={cerrarSesion}>
        <button
          type="submit"
          title="Cerrar sesión"
          aria-label="Cerrar sesión"
          className="grid size-8 place-items-center rounded-control border border-transparent text-texto-3 transition-colors hover:border-borde hover:bg-panel hover:text-peligro"
        >
          <Icono nombre="salir" tamano={16} />
        </button>
      </form>
    </div>
  );
}
