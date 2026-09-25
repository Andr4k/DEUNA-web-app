import { Avatar } from "@/components/ui/Avatar";
import { USUARIO_ACTUAL } from "@/lib/sesion";

/**
 * Usuario con la sesión abierta.
 *
 * Hoy lee de `USUARIO_ACTUAL` (placeholder). Cuando exista el login real, este
 * es el único componente que cambia: recibe el usuario por props desde el
 * layout, que sí puede leer la cookie de sesión.
 */
export function UsuarioActual() {
  return (
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
  );
}
