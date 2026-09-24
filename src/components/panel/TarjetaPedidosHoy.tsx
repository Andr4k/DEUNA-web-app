import { EnlaceAccion } from "@/components/ui/EnlaceAccion";
import { ListaDesglose } from "@/components/ui/ListaDesglose";
import { Tarjeta } from "@/components/ui/Tarjeta";
import { etiquetaDeEstado, iconoDeEstado } from "@/components/ui/Pill";
import { numero } from "@/lib/formato";
import { ESTADOS_PEDIDO } from "@/lib/tipos/pedido";
import type { ConteoPorEstado } from "@/lib/tipos/metricas";

/**
 * Pedidos de hoy desglosados por estado.
 *
 * La etiqueta y el icono de cada estado salen de `Pill.tsx`, que es el único lugar
 * del portal que traduce los estados del backend al lenguaje del operador. Antes
 * este archivo tenía su propia tabla de traducción: dos fuentes para lo mismo es una
 * que se desactualiza.
 *
 * La lista se recorre con `ESTADOS_PEDIDO` y no con lo que devuelve la API. El
 * backend agrupa por estado y solo devuelve los que tienen pedidos, así que un día
 * tranquilo daría una tarjeta de una sola fila y en orden alfabético. El operador
 * necesita el ciclo completo —**un cero también informa**: "no hay nada en ruta" es
 * un dato— y en el orden en que ocurre el pedido.
 */
export function TarjetaPedidosHoy({ porEstado }: { porEstado: ConteoPorEstado[] }) {
  const conteo = new Map(porEstado.map((conteo) => [conteo.estado, conteo.valor]));

  // Si el backend agrega un estado, se muestra al final en vez de desaparecer.
  const estados = [
    ...ESTADOS_PEDIDO,
    ...porEstado.map((c) => c.estado).filter((estado) => !ESTADOS_PEDIDO.includes(estado)),
  ];

  const filas = estados.map((estado) => ({
    icono: iconoDeEstado(estado),
    etiqueta: etiquetaDeEstado(estado),
    valor: numero(conteo.get(estado) ?? 0),
    claseValor: estado === "Entregado" ? "text-exito" : undefined,
  }));

  return (
    <Tarjeta
      titulo="Pedidos de hoy"
      pie={<EnlaceAccion href="/pedidos">Ver todos los pedidos</EnlaceAccion>}
    >
      <ListaDesglose filas={filas} />
    </Tarjeta>
  );
}
