import type { Metadata } from "next";

import { Pendiente } from "@/components/ui/Pendiente";

export const metadata: Metadata = { title: "Configuración" };

export default function PaginaConfiguracion() {
  return (
    <Pendiente
      titulo="Configuración"
      necesita={[
        "Parámetros del portal",
        "Gestión de roles y permisos",
      ]}
    />
  );
}
