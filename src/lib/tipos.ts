/**
 * Tipos del dominio del portal.
 *
 * `EstadoPedido` NO es una lista inventada acá: son los estados canónicos del
 * backend (Deuna.Shared.Domain.EstadosPedido). Viajan como texto dentro de los
 * eventos de integración, así que un literal distinto en el frontend hace que
 * el pedido parezca quedarse quieto sin que nada falle. Si el backend agrega un
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

/** Un intento de entrega: el historial 1:N que mantiene Orders (TASK-308). */
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

export interface Pedido {
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

export interface Zona {
  nombre: string;
  pedidos: number;
  entregados: number;
  pendientes: number;
  recaudo: number;
}

export interface Repartidor {
  id: string;
  nombre: string;
  estado: "Disponible" | "En servicio" | "En descanso";
}

export interface Restaurante {
  id: string;
  nombreComercial: string;
  activo: boolean;
  pedidosHoy: number;
}

/** Los indicadores de la fila superior del panel. */
export interface IndicadoresDelDia {
  pedidosTotales: number;
  pedidosEnCurso: number;
  pedidosEntregados: number;
  incidencias: number;
  recaudo: number;
  /** Variación contra el día anterior, en la unidad de cada indicador. */
  variacion: {
    pedidosTotales: number;
    pedidosEnCurso: number;
    pedidosEntregados: number;
    incidencias: number;
    recaudo: number;
  };
}

export interface Actividad {
  hora: string;
  tipo: "pedido" | "entrega" | "dinero" | "incidencia" | "servicio";
  texto: string;
}

export interface RendimientoDelDia {
  entregasATiempo: number;
  tiempoPromedioMin: number;
  calificacionPromedio: number;
}
