"use client";

import { Aviso } from "@/components/ui/Aviso";
import { Boton } from "@/components/ui/Boton";

/**
 * Error de la pantalla de pedidos.
 *
 * Es el límite de error de la ruta: si el listado o los candidatos no responden, el
 * operador ve qué pasó y puede reintentar, en lugar de una pantalla en blanco.
 *
 * El mensaje nombra las dos causas probables —el backend caído o la falta de rol—
 * porque son las que realmente pasan: el listado de pedidos sin asignar se pide con
 * rol ADMIN, y una cuenta de restaurante recibe 403 en esa ruta.
 */
export default function ErrorPedidos({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-4 pt-10">
      <Aviso tono="error">
        <strong className="block">No se pudieron cargar los pedidos</strong>
        <span className="mt-1 block">
          Puede ser que el servicio de pedidos o el de entregas no esté levantado
          (<code className="text-xs">docker compose ps</code>), o que tu cuenta no tenga rol de
          administrador: el listado de pedidos sin asignar y los candidatos se piden con rol ADMIN.
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
