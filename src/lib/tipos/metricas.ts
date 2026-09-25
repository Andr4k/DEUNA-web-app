import type { EstadoPedido } from "@/lib/tipos/pedido";

/**
 * Métricas del panel.
 *
 * Son agregados que el backend calcula: el portal no suma pedidos por su cuenta.
 * El contrato lo define `Deuna.Metrics.Service` y los nombres coinciden con sus
 * DTOs — un cambio allá obliga a un cambio acá.
 */

/** Lo que devuelve `GET /api/v1/metrics/panel`. */
export interface ResumenPanel {
  indicadores: IndicadoresDelDia;
  pedidosPorEstado: ConteoPorEstado[];
  domiciliarios: ResumenDomiciliarios;
  restaurantes: ResumenRestaurantes;
}

export interface IndicadoresDelDia {
  pedidosTotales: number;
  pedidosEnCurso: number;
  pedidosEntregados: number;
  /**
   * Pedidos cancelados del día.
   *
   * El backend todavía no tiene un modelo de incidencias: hoy esto son los
   * cancelados. El nombre viaja del backend y se mantiene para no cambiar el
   * contrato por un detalle de vocabulario, pero el panel lo etiqueta como lo que
   * realmente es.
   */
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

/**
 * Cuántos pedidos hay en cada estado.
 *
 * Solo el estado y el número: la etiqueta que ve el operador y su color los pone
 * `components/ui/Pill.tsx`, que es el único lugar del portal que traduce estados.
 */
export interface ConteoPorEstado {
  estado: EstadoPedido;
  valor: number;
}

export interface ResumenDomiciliarios {
  activos: number;
  disponibles: number;
  enServicio: number;
  enDescanso: number;
}

export interface ResumenRestaurantes {
  activos: number;
  /** Los activos que recibieron al menos un pedido hoy. */
  conPedidosHoy: number;
  nuevosHoy: number;
}

export interface Zona {
  nombre: string;
  pedidos: number;
  entregados: number;
  pendientes: number;
  recaudo: number;
}

export interface RendimientoDelDia {
  entregasATiempo: number;
  tiempoPromedioMin: number;
  calificacionPromedio: number;
  /** Sobre cuántas entregas se calculó: un 95% sobre 2 no es un 95%. */
  entregasMedidas: number;
}

/** Tipos de evento del feed. Los emite el backend; el portal les pone el color. */
export type TipoActividad = "pedido" | "entrega" | "servicio";

export interface Actividad {
  hora: string;
  tipo: TipoActividad;
  texto: string;
}
