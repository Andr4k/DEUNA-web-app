import type { Metadata } from "next";

import { Pendiente } from "@/components/ui/Pendiente";

export const metadata: Metadata = { title: "Usuarios" };

export default function PaginaUsuarios() {
  return (
    <Pendiente
      titulo="Usuarios"
      necesita={[
        "Listado de usuarios del portal con su rol",
        "Alta, suspensión y recuperación de acceso",
      ]}
    />
  );
}
