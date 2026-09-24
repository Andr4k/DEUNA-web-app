import type { Metadata } from "next";

import { Pendiente } from "@/components/ui/Pendiente";

export const metadata: Metadata = { title: "Reportes" };

export default function PaginaReportes() {
  return (
    <Pendiente
      titulo="Reportes"
      necesita={[
        "Agregaciones por zona (PostGIS)",
        "Exportación a CSV de pedidos, feedback y finanzas",
      ]}
    />
  );
}
