import { EnlaceAccion } from "@/components/ui/EnlaceAccion";
import { Icono } from "@/components/ui/Icono";
import { ListaDesglose } from "@/components/ui/ListaDesglose";
import { Tarjeta } from "@/components/ui/Tarjeta";
import { PEDIDOS_POR_ESTADO } from "@/lib/datos-ejemplo";
import { numero } from "@/lib/formato";

/** Icono y color con que se representa cada estado en el desglose. */
const ESTILO: Record<string, { icono: "check" | "pedidos" | "moto"; color: string }> = {
  Entregado: { icono: "check", color: "text-exito" },
  Buscando: { icono: "pedidos", color: "text-peligro" },
  EnRuta: { icono: "moto", color: "text-info" },
};

/** Pedidos de hoy desglosados por estado. */
export function TarjetaPedidosHoy() {
  const filas = PEDIDOS_POR_ESTADO.map((fila) => {
    const estilo = ESTILO[fila.estado] ?? { icono: "pedidos" as const, color: "text-texto-2" };

    return {
      icono: <Icono nombre={estilo.icono} tamano={15} className={estilo.color} />,
      etiqueta: fila.etiqueta,
      valor: numero(fila.valor),
      claseValor: fila.estado === "Entregado" ? "text-exito" : undefined,
    };
  });

  return (
    <Tarjeta
      titulo="Pedidos de hoy"
      pie={<EnlaceAccion href="/pedidos">Ver todos los pedidos</EnlaceAccion>}
    >
      <ListaDesglose filas={filas} />
    </Tarjeta>
  );
}
