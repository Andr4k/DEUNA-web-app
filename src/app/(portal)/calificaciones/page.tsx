import type { Metadata } from "next";

import { Pendiente } from "@/components/ui/Pendiente";

export const metadata: Metadata = { title: "Calificaciones y referidos" };

export default function PaginaCalificaciones() {
  return (
    <Pendiente
      titulo="Calificaciones y referidos"
      necesita={[
        "Promedio por criterio (sabor, temperatura, presentación, cantidad, empaque)",
        "Comentarios negativos con opción de responder",
        "Compartidos por WhatsApp y su enlace",
      ]}
    />
  );
}
