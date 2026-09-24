import type { ReactNode } from "react";

import { Icono } from "@/components/ui/Icono";

type Tono = "error" | "info" | "exito";

const TONOS: Record<Tono, { borde: string; texto: string; fondo: string; icono: "alerta" | "info" | "check" }> = {
  error: { borde: "border-peligro", texto: "text-peligro", fondo: "bg-peligro/8", icono: "alerta" },
  info: { borde: "border-info", texto: "text-info", fondo: "bg-info/8", icono: "info" },
  exito: { borde: "border-exito", texto: "text-exito", fondo: "bg-exito/8", icono: "check" },
};

interface Props {
  tono?: Tono;
  children: ReactNode;
}

/**
 * Aviso en línea: un mensaje con su icono y su color.
 *
 * Para lo que hay que decirle al usuario en el momento — un error al entrar, una
 * confirmación, una advertencia. No confundir con `BloqueAtencion`, que es la
 * tarjeta con contador y acción del panel: ese tiene otro propósito y otros
 * props, y por eso ya no se llama "Alerta".
 */
export function Aviso({ tono = "info", children }: Props) {
  const t = TONOS[tono];

  return (
    <div
      role={tono === "error" ? "alert" : "status"}
      className={`flex items-start gap-2.5 rounded-control border px-3.5 py-3 text-[13px] ${t.borde} ${t.fondo}`}
    >
      <Icono nombre={t.icono} tamano={16} className={`mt-0.5 ${t.texto}`} />
      <span className="flex-1 text-texto">{children}</span>
    </div>
  );
}
