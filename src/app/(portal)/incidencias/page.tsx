import type { Metadata } from "next";

import { Pendiente } from "@/components/ui/Pendiente";

export const metadata: Metadata = { title: "Incidencias" };

export default function PaginaIncidencias() {
  return (
    <Pendiente
      titulo="Incidencias"
      necesita={[
        "Listado de incidencias reportadas durante las entregas",
        "Detalle y cambio de estado de la incidencia",
      ]}
    />
  );
}
