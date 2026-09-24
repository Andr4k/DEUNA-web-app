/**
 * Pedidos — contratos del servicio Orders.
 *
 * `EstadoPedido` NO es una lista inventada acá: son los estados canónicos del
 * backend (`Deuna.Shared.Domain.EstadosPedido`). Viajan como texto dentro de los
 * eventos de integración, así que un literal distinto en el portal hace que el
 * pedido parezca quedarse quieto sin que nada falle. Si el backend agrega un
 * estado, se agrega acá y el compilador señala todos los lugares a revisar.
 */

export const ESTADOS_PEDIDO = [
  "Buscando",
  "Asignado",
  "ConfirmadoEnLocal",
  "EnRuta",
  "Entregado",
  "Cancelado",
] as const;

export type EstadoPedido = (typeof ESTADOS_PEDIDO)[number];

/** Estados en los que el pedido sigue vivo (no terminó). */
export const ESTADOS_ACTIVOS: readonly EstadoPedido[] = [
  "Buscando",
  "Asignado",
  "ConfirmadoEnLocal",
  "EnRuta",
];

export type EstadoAsignacion =
  | "Asignado"
  | "EnLocal"
  | "EnRuta"
  | "Completado"
  | "Rechazado";

/**
 * Un intento de entrega. Orders mantiene el historial 1:N de intentos: un pedido
 * pasa por varios domiciliarios si el asignado rechaza antes de llegar al local.
 */
export interface Asignacion {
  id: string;
  repartidorId: string;
  fechaAsignacion: string;
  fechaLlegadaLocal: string | null;
  fechaSalidaRuta: string | null;
  fechaEntrega: string | null;
  estado: EstadoAsignacion;
  motivoRechazo: string | null;
}

/** El pedido tal como lo devuelve el backend (con identificadores, no nombres). */
export interface Pedido {
  id: string;
  codigo: string;
  restauranteId: string;
  clienteId: string;
  repartidorId: string | null;
  estado: EstadoPedido;
  subtotal: number;
  costoEnvio: number;
  total: number;
  creadoEn: string;
  fechaEntrega: string | null;
  asignaciones: Asignacion[];
}

/** Subconjunto que alcanza para un listado, sin traer el historial completo. */
export type PedidoResumen = Pick<
  Pedido,
  "id" | "codigo" | "restauranteId" | "estado" | "total" | "creadoEn"
>;

/**
 * El pedido como lo muestra el portal: con los nombres ya resueltos y el tiempo
 * transcurrido calculado.
 *
 * Es un modelo de VISTA, distinto del contrato del backend a propósito: el
 * backend devuelve identificadores y no sabe de "zona" ni de minutos. La pantalla
 * (o el servicio) arma este objeto combinando el pedido con los catálogos de
 * restaurantes y domiciliarios. Los componentes de presentación reciben esto y
 * no tienen que saber de dónde salieron los nombres.
 */
export interface PedidoEnLista {
  id: string;
  codigo: string;
  restauranteId: string;
  restauranteNombre: string;
  repartidorId: string | null;
  repartidorNombre: string | null;
  estado: EstadoPedido;
  total: number;
  zona: string;
  creadoEn: string;
  /** Minutos desde la creación; `null` si el pedido todavía no arrancó. */
  minutosTranscurridos: number | null;
}
