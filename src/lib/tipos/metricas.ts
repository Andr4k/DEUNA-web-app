/**
 * Métricas del panel.
 *
 * Son agregados que el backend calcula; el portal no suma pedidos por su cuenta.
 * Ver `services/metricas.service.ts`: los endpoints todavía no existen.
 */

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
}

export interface Actividad {
  hora: string;
  tipo: "pedido" | "entrega" | "dinero" | "incidencia" | "servicio";
  texto: string;
}

/** Cuántos pedidos hay en cada estado. Alimenta la tarjeta "Pedidos de hoy". */
export interface ConteoPorEstado {
  etiqueta: string;
  valor: number;
  estado: string;
}
