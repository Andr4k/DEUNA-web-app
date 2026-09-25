import type { EstadoPedido } from "@/lib/tipos/pedido";

/**
 * Servicios finalizados — contratos del historial de servicios completados.
 *
 * El contrato lo define `Deuna.Orders.Service`
 * (`DTOs/ServiciosFinalizadosDTOs.cs`) y los nombres coinciden con sus DTOs: un
 * cambio allá obliga a un cambio acá. Todavía no hay endpoint detrás; esto es
 * solo el contrato.
 *
 * Reglas que valen para todo lo de abajo:
 * - Fechas como ISO 8601 en string, nunca como número.
 * - Duraciones en minutos, calculadas en el backend: el cliente no resta fechas.
 *   Si el cálculo vive en dos lados, tarde o temprano difieren.
 * - `| null` explícito en todo lo que puede faltar, y el comentario dice por qué.
 * - Los estados son los canónicos del backend (`EstadoPedido`), no literales
 *   inventados para la UI.
 * - Los agregados que no se pueden calcular viajan en `null`, no en `0`: un
 *   promedio de cero y un promedio que no existe se ven igual en pantalla y
 *   significan cosas opuestas.
 */

/**
 * El sobre de la página.
 *
 * `total` es el total que cumple los filtros, no la cantidad de `items`: con
 * `tamano = 20`, la página 2 trae 20 items y un `total` de, por ejemplo, 137.
 */
export interface PaginaServiciosFinalizados {
  items: ServicioFinalizado[];
  total: number;
  pagina: number;
  tamano: number;
}

/** Una fila de la tabla: un servicio ya cerrado. */
export interface ServicioFinalizado {
  pedidoId: string;
  /** Ej: "PED-20260923-000001". */
  codigo: string;

  /** ISO 8601 — `FechaEntrega`. Siempre existe si el servicio está cerrado. */
  cerradoEn: string;

  restaurante: {
    id: string;
    nombre: string;
    ciudad: string;
  };

  /** `null` si el pedido se entregó sin asignación registrada. */
  domiciliario: {
    id: string;
    nombre: string;
    /** Promedio histórico del domiciliario; `null` si nunca lo calificaron. */
    calificacion: number | null;
  } | null;

  /** La sede del restaurante. */
  origen: { direccion: string };

  destino: { direccion: string; zona: string };

  tiempos: {
    /** ISO 8601. `null` si el pedido se cerró sin asignación registrada. */
    asignadoEn: string | null;
    /** ISO 8601. `null` si el domiciliario nunca escaneó el QR del local. */
    recogidoEn: string | null;
    /** ISO 8601 — siempre existe si el servicio está cerrado. */
    entregadoEn: string;
    /** `null` si falta algún extremo del cálculo. No viaja en 0. */
    minutosTotales: number | null;
  };

  valor: {
    domicilio: number;
    total: number;
    /** "Cliente" o "Domiciliario". `null` hasta confirmar de dónde sale el dato. */
    paga: "Cliente" | "Domiciliario" | null;
  };

  calificaciones: {
    /** 1..5. `null` si el cliente no calificó al domiciliario. */
    domiciliario: number | null;
    /** 1..5. `null` si el cliente no calificó al restaurante. */
    restaurante: number | null;
  };

  /**
   * Hoy siempre `{ hay: false, motivo: null }`: no existe el modelo de
   * incidencias en ningún servicio, así que la columna no puede tener fuente. El
   * campo viaja igual para que la pantalla y el contrato no cambien cuando exista.
   */
  incidencia: {
    hay: boolean;
    /** `null` cuando no hay incidencia, o cuando todavía no hay modelo que la explique. */
    motivo: string | null;
  };

  /** Estado canónico del backend; no se inventa un literal para la UI. */
  estado: EstadoPedido;
}

/**
 * Los KPIs de la cabecera.
 *
 * Se calculan sobre el mismo conjunto que las filas, no con consultas separadas:
 * así el número de arriba y la lista de abajo no pueden discrepar.
 */
export interface ResumenServiciosFinalizados {
  completadosHoy: number;
  valorDomiciliosHoy: number;
  /** `null` si no hay ninguna calificación en el rango. */
  calificacionPromedio: number | null;
  /** El "basado en N calificaciones" del mockup: sobre cuántas se calculó. */
  calificacionesContadas: number;
  /** `null` mientras no exista el modelo de incidencias. No viaja en 0. */
  conIncidencias: number | null;
  /** `null` si falta algún extremo del cálculo. No viaja en 0. */
  tiempoPromedioMin: number | null;
  /** El mismo agregado corrido con el rango de ayer. */
  ayer: {
    completados: number;
    valorDomicilios: number;
    /** `null` si ayer no se puede calcular: la variación se muestra "sin dato", no -100%. */
    tiempoPromedioMin: number | null;
  };
}

/**
 * La respuesta del endpoint: el sobre de la página y los KPIs de la cabecera.
 *
 * No es un contrato nuevo de datos: compone los dos de arriba sin cambiarles un
 * campo. Viajan juntos porque salen del MISMO conjunto —son una consulta, no dos que
 * puedan discrepar—, que es lo que impide el contador que dice 42 con una lista de 38.
 */
export interface RespuestaServiciosFinalizados {
  pagina: PaginaServiciosFinalizados;
  resumen: ResumenServiciosFinalizados;
}

/**
 * Los filtros del historial, tal como los manda el portal.
 *
 * Es la forma de la PETICIÓN y sus nombres son los del query string del endpoint.
 *
 * `desde` y `hasta` son DÍAS (`YYYY-MM-DD`), que es lo que elige el operador; el
 * servicio los traduce a los instantes del contrato, donde `hasta` es exclusivo.
 *
 * `restauranteId` y `repartidorId` son identificadores y el contrato los tiene, pero
 * la pantalla todavía no los ofrece: no hay endpoint que liste el catálogo de
 * restaurantes ni el de domiciliarios, y un campo para pegar un GUID no es una
 * interfaz. El día que exista el desplegable, el servicio ya los manda.
 *
 * `conIncidencia` y `pago` NO están, y no es un olvido: el endpoint los rechaza
 * mientras no tengan fuente (no existe el modelo de incidencias y "quién paga" sigue
 * sin decidirse). Mandarlos en `false` o vacío sería afirmar algo que no se sabe.
 */
export interface FiltrosServiciosFinalizados {
  desde?: string;
  hasta?: string;
  restauranteId?: string;
  repartidorId?: string;
  zona?: string;
  calificacionMin?: number;
  buscar?: string;
  pagina?: number;
  tamano?: number;
}
