"use client";

import { Aviso } from "@/components/ui/Aviso";
import { Boton } from "@/components/ui/Boton";

/**
 * Error de la pantalla de usuarios.
 *
 * Es el límite de error de la ruta: si el listado no responde, el operador ve qué pasó y
 * puede reintentar, en lugar de una pantalla en blanco.
 *
 * El aviso nombra las dos causas probables —el servicio de identidad caído o la falta de
 * rol— porque son las que pasan: la ruta se pide con rol ADMIN y una cuenta de restaurante
 * recibe 403. El detalle va con el texto que devolvió el gateway TAL CUAL, sin
 * reinterpretarlo: `ErrorApi` ya trae el mensaje del backend —lo extrae `motivoDeError`— y
 * un 400 explicado por el backend es más preciso que cualquier hipótesis escrita acá. Por
 * eso no se arma un motivo nuevo en esta pantalla.
 */
export default function ErrorUsuarios({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-4 pt-10">
      <Aviso tono="error">
        <strong className="block">No se pudieron cargar los usuarios</strong>
        <span className="mt-1 block">
          Puede ser que el servicio de identidad no esté levantado (
          <code className="text-xs">docker compose ps</code>), o que tu cuenta no tenga rol de
          administrador: el listado de usuarios se pide con rol ADMIN.
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
