import type { Metadata } from "next";

import { FormularioLogin } from "@/components/auth/FormularioLogin";
import { Marca } from "@/components/layout/Marca";

export const metadata: Metadata = {
  title: "Entrar — DEUNA Domicilios",
};

/**
 * Página de acceso.
 *
 * Vive **fuera** del grupo `(portal)` a propósito: no lleva la barra lateral ni
 * la barra superior, porque todavía no hay una sesión que mostrar en ellas.
 *
 * El `destino` lo agrega el middleware cuando corta una navegación: es lo que
 * permite volver a la pantalla que el usuario estaba buscando en lugar de
 * dejarlo en el panel.
 */
export default async function PaginaLogin({
  searchParams,
}: {
  searchParams: Promise<{ destino?: string }>;
}) {
  const { destino } = await searchParams;

  return (
    <main className="grid min-h-dvh place-items-center px-4 py-10">
      <div className="w-full max-w-[380px]">
        <div className="mb-6 flex flex-col items-center gap-2">
          <Marca />
          <div className="flex flex-col items-center leading-none">
            <span className="text-xl font-extrabold tracking-wide">DEUNA</span>
            <span className="text-[10px] font-bold tracking-[0.14em] text-acento uppercase">
              Domicilios
            </span>
          </div>
        </div>

        <div className="rounded-tarjeta border border-borde bg-panel p-6 shadow-lg">
          <h1 className="m-0 text-base font-semibold">Portal administrativo</h1>
          <p className="mt-1 mb-5 text-[13px] text-texto-2">
            Entrá con la cuenta de tu restaurante o de administración.
          </p>

          <FormularioLogin destino={destino ?? "/"} />
        </div>

        <p className="mt-5 text-center text-[11px] leading-relaxed text-texto-3">
          DEUNA DOMICILIOS
          <br />
          Versión 1.0.0
        </p>
      </div>
    </main>
  );
}
