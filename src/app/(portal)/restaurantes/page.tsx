import type { Metadata } from "next";

import { Pendiente } from "@/components/ui/Pendiente";

export const metadata: Metadata = { title: "Restaurantes" };

export default function PaginaRestaurantes() {
  return (
    <Pendiente
      titulo="Restaurantes"
      necesita={[
        "Listado y alta de restaurantes",
        "Configuración de horarios de atención (hoy están fijos en el código)",
        "Radio de cobertura y abrir/cerrar el restaurante",
        "Catálogo de productos para armar los pedidos",
      ]}
    />
  );
}
