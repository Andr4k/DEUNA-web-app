import { EnlaceAccion } from "@/components/ui/EnlaceAccion";
import type { Columna } from "@/components/ui/Tabla";
import { duracion, hora, moneda } from "@/lib/formato";
import type { PedidoSinAsignar, PrioridadPedido } from "@/lib/tipos/pedido";

/**
 * Color de la prioridad.
 *
 * Se muestra el valor tal como lo manda el backend ("Alta", "Media", "Baja"): la
 * prioridad es un dato de la operación, no un estado del pedido, así que no pasa
 * por `Pill` —ese traduce los estados y es el único lugar que lo hace—. Lo único
 * que se agrega es el color, para que la fila de prioridad alta se vea de lejos.
 */
const COLOR_PRIORIDAD: Record<PrioridadPedido, string> = {
  Alta: "font-semibold text-peligro",
  Media: "text-alerta",
  Baja: "text-texto-2",
};

/**
 * Columnas de la tabla de pedidos sin asignar.
 *
 * La acción se arma con el enlace que llega por props: elegir un pedido es un
 * cambio en la URL (`?asignar=<id>`), no un estado en el cliente. Así la selección
 * se puede compartir, sobrevive al refresco y la pantalla la resuelve el servidor.
 *
 * Vive en su propio archivo y no dentro de la lista: juntas pasaban el límite de
 * líneas por archivo, y las columnas son una unidad con sentido propio —la lista
 * compone, las columnas definen qué se ve—.
 */
export function columnasPedidos(
  enlaceAsignar: (pedidoId: string) => string,
  seleccionado?: string,
): Columna<PedidoSinAsignar>[] {
  return [
    {
      clave: "pedido",
      titulo: "Pedido",
      render: (pedido) => (
        <div className="flex flex-col">
          <span className="font-semibold">{pedido.codigo}</span>
          <span className="text-[12px] text-texto-2">{pedido.restaurante}</span>
          <span className="text-[12px] text-texto-3">
            Generado a las {hora(pedido.generadoEn)}
          </span>
        </div>
      ),
    },
    { clave: "zona", titulo: "Zona", render: (pedido) => pedido.zona },
    {
      clave: "prioridad",
      titulo: "Prioridad",
      render: (pedido) => (
        <span className={COLOR_PRIORIDAD[pedido.prioridad]}>{pedido.prioridad}</span>
      ),
    },
    {
      clave: "domicilio",
      titulo: "Valor del domicilio",
      numerica: true,
      render: (pedido) => moneda(pedido.valorDomicilio),
    },
    {
      clave: "espera",
      titulo: "Espera",
      numerica: true,
      clase: "text-alerta",
      render: (pedido) => duracion(pedido.minutosEsperando),
    },
    {
      clave: "accion",
      titulo: "",
      render: (pedido) =>
        pedido.pedidoId === seleccionado ? (
          <span className="text-[13px] text-texto-2">Seleccionado</span>
        ) : (
          <EnlaceAccion href={enlaceAsignar(pedido.pedidoId)}>Asignar</EnlaceAccion>
        ),
    },
  ];
}
