"use client";

import { Aviso } from "@/components/ui/Aviso";
import { Boton } from "@/components/ui/Boton";

/**
 * Error del panel.
 *
 * Es el límite de error de la ruta: si las métricas no responden, el usuario ve qué
 * pasó y puede reintentar, en lugar de una pantalla en blanco.
 *
 * El mensaje distingue el caso más probable —el servicio de métricas caído— porque es
 * la causa real la mayoría de las veces, y decirlo ahorra la media hora de buscar el
 * problema en el portal.
 */
export default function ErrorPanel({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-4 pt-10">
      <Aviso tono="error">
        <strong className="block">No se pudieron cargar las métricas</strong>
        <span className="mt-1 block">
          Puede ser que el servicio de métricas no esté levantado
          (<code className="text-xs">docker compose ps metrics</code>), o que tu cuenta no tenga
          permiso para ver los números de toda la red: el panel de administración los pide con rol
          de administrador.
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
