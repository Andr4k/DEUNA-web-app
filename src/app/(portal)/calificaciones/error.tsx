"use client";

import { Aviso } from "@/components/ui/Aviso";
import { Boton } from "@/components/ui/Boton";

/**
 * Error de la pantalla de calificaciones.
 *
 * Es el límite de error de la ruta: si el listado o el resumen no responden, el operador ve
 * qué pasó y puede reintentar, en lugar de una pantalla en blanco.
 *
 * El aviso nombra las dos causas probables —el servicio de calificaciones caído o la falta
 * de rol— porque son las que pasan: las dos rutas se piden con rol de administrador y una
 * cuenta de restaurante recibe 403. El detalle va con el texto que devolvió el gateway tal
 * cual, sin reinterpretarlo: un "404" dicho por el backend es más preciso que cualquier
 * hipótesis escrita acá.
 */
export default function ErrorCalificaciones({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-4 pt-10">
      <Aviso tono="error">
        <strong className="block">No se pudieron cargar las calificaciones</strong>
        <span className="mt-1 block">
          Puede ser que el servicio de calificaciones no esté levantado (
          <code className="text-xs">docker compose ps</code>), o que tu cuenta no tenga rol de
          administrador: el listado y el resumen se piden con rol ADMIN.
        </span>
      </Aviso>

      <p className="m-0 text-[13px] text-texto-3">
        Detalle técnico: <code className="text-xs">{error.message}</code>
      </p>

      <div>
        <Boton variante="primario" onClick={reset}>
          Reintentar
        </Boton>
      </div>
    </div>
  );
}
