import type { Metadata } from "next";

import { Pendiente } from "@/components/ui/Pendiente";

export const metadata: Metadata = { title: "Finanzas" };

export default function PaginaFinanzas() {
  return (
    <Pendiente
      titulo="Finanzas"
      necesita={[
        "Recaudo y comisiones por restaurante",
        "Liquidación de domiciliarios",
        "Consignaciones de los restaurantes",
      ]}
    />
  );
}
