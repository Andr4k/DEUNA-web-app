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

/* --------------------------------------------------------------------------
   Listado de administración: pedidos sin asignar.

   Contrato de `GET /api/v1/admin/orders/sin-asignar` (rol ADMIN). NO es el mismo
   modelo que `Pedido`: aquel es el pedido de Orders con identificadores, y este
   llega ya resuelto para operar —nombre del restaurante, zona, minutos de espera
   y valor del domicilio— porque el endpoint lo arma para esa pantalla. Tipar uno
   como el otro haría que el portal leyera campos que no vienen.
   -------------------------------------------------------------------------- */

/** Prioridad con la que el backend clasifica el pedido mientras espera. */
export type PrioridadPedido = "Alta" | "Media" | "Baja";

/** Un pedido esperando domiciliario, tal como lo devuelve el listado. */
export interface PedidoSinAsignar {
  pedidoId: string;
  codigo: string;
  /** Nombre del restaurante, ya resuelto por el backend. */
  restaurante: string;
  /** ISO 8601. */
  recogerEn: string;
  /** ISO 8601. */
  entregarEn: string;
  /** ISO 8601. */
  generadoEn: string;
  minutosEsperando: number;
  /**
   * Hoy siempre "Buscando": el endpoint devuelve, justamente, los que no tienen
   * domiciliario. Se tipa con el conjunto completo de estados para que
   * `PillEstadoPedido` lo acepte y para que un estado nuevo del backend no
   * rompa el portal.
   */
  estado: EstadoPedido;
  prioridad: PrioridadPedido;
  valorDomicilio: number;
  zona: string;
}

/**
 * Sobre paginado del listado.
 *
 * `total` es el total que cumple los filtros, no la cantidad de `items`: con
 * `tamano = 20`, la página 2 trae 20 items y un `total` de, por ejemplo, 137.
 */
export interface PaginaPedidos {
  items: PedidoSinAsignar[];
  total: number;
  pagina: number;
  tamano: number;
}

/**
 * Filtros del listado.
 *
 * Todos opcionales a propósito: lo que no viene no se manda en el query string y
 * el backend aplica su valor por defecto. `esperaMin` es un umbral —"los que
 * llevan más de N minutos esperando"—, no un rango.
 */
export interface FiltrosPedidos {
  zona?: string;
  prioridad?: PrioridadPedido;
  esperaMin?: number;
  pagina?: number;
  tamano?: number;
}
