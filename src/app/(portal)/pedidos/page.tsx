import type { Metadata } from "next";

import { Pendiente } from "@/components/ui/Pendiente";

export const metadata: Metadata = { title: "Pedidos" };

export default function PaginaPedidos() {
  return (
    <Pendiente
      titulo="Pedidos"
      necesita={[
        "Listado global con filtros por estado, fecha, zona y restaurante",
        "Detalle del pedido con su historial de intentos de entrega",
        "Asignación manual de un domiciliario (hoy la asignación es automática)",
      ]}
    />
  );
}
