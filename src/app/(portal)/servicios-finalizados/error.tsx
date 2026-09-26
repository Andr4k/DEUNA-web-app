"use client";

import { Aviso } from "@/components/ui/Aviso";
import { Boton } from "@/components/ui/Boton";

/**
 * Error de la pantalla de servicios finalizados.
 *
 * Es el límite de error de la ruta: si el historial no responde, el operador ve qué
 * pasó y puede reintentar, en lugar de una pantalla en blanco.
 *
 * El mensaje nombra las dos causas probables —el servicio caído o la falta de rol—
 * porque son las que pasan: el endpoint se pide con rol ADMIN y una cuenta de
 * restaurante recibe 403. No menciona el "endpoint que todavía no está desplegado":
 * eso es cierto hoy, pero un error de red mañana no se explicaría con ese texto.
 */
export default function ErrorServiciosFinalizados({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-4 pt-10">
      <Aviso tono="error">
        <strong className="block">No se pudieron cargar los servicios finalizados</strong>
        <span className="mt-1 block">
          Puede ser que el servicio de pedidos no esté levantado (
          <code className="text-xs">docker compose ps</code>), o que tu cuenta no tenga rol de
          administrador: el historial de servicios finalizados se pide con rol ADMIN.
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
