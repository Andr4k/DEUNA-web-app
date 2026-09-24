import type { Metadata } from "next";

import { Pendiente } from "@/components/ui/Pendiente";

export const metadata: Metadata = { title: "Campañas" };

export default function PaginaCampañas() {
  return (
    <Pendiente
      titulo="Campañas"
      necesita={[
        "Alta y seguimiento de campañas",
        "Métricas de cada campaña",
      ]}
    />
  );
}
