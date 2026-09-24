import type { Metadata } from "next";

import { Pendiente } from "@/components/ui/Pendiente";

export const metadata: Metadata = { title: "Ayuda" };

export default function PaginaAyuda() {
  return (
    <Pendiente
      titulo="Ayuda"
      necesita={[
        "Documentación de uso del portal",
      ]}
    />
  );
}
