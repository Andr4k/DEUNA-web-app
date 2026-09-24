import type { Metadata } from "next";

import { Pendiente } from "@/components/ui/Pendiente";

export const metadata: Metadata = { title: "Domiciliarios" };

export default function PaginaDomiciliarios() {
  return (
    <Pendiente
      titulo="Domiciliarios"
      necesita={[
        "Listado con su estado (disponible, en servicio, en descanso)",
        "Perfil y documentos del domiciliario",
        "Historial de entregas y liquidaciones",
      ]}
    />
  );
}
