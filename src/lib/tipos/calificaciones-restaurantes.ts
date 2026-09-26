/**
 * Calificaciones a restaurantes — contratos del desempeño de los restaurantes
 * según las calificaciones que recibieron.
 *
 * El contrato lo define `Deuna.Feedback.Service`
 * (`DTOs/CalificacionesRestaurantesDTOs.cs`) y los nombres coinciden con sus
 * DTOs: un cambio allá obliga a un cambio acá. Todavía no hay endpoint detrás;
 * esto es solo el contrato.
 *
 * Reglas que valen para todo lo de abajo:
 * - Fechas como ISO 8601 en string, nunca como número.
 * - Los conteos de la distribución son NÚMEROS, no porcentajes: el porcentaje lo
 *   calcula la vista. Si el backend mandara el porcentaje, dos lugares harían la
 *   misma cuenta y tarde o temprano diferirían.
 * - Los aspectos son una lista de `{ criterio, promedio, cantidad }` y el criterio
 *   es texto libre —es la decisión de TASK-402, criterios en filas para poder
 *   agregar sin cambiar el esquema—, así que la API devuelve los que existan, no
 *   un conjunto fijo de cuatro.
 * - `| null` explícito en todo lo que puede faltar, y el comentario dice por qué.
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
export interface PaginaCalificacionesRestaurantes {
  items: CalificacionDeRestaurante[];
  total: number;
  pagina: number;
  tamano: number;
}

/** Una fila de la tabla: un restaurante con sus calificaciones ya agregadas. */
export interface CalificacionDeRestaurante {
  restauranteId: string;
  nombre: string;
  zona: string;
  /** `null` hasta que exista el dato. */
  tipoDeComida: string | null;

  /** `null` si nunca lo calificaron. */
  calificacionPromedio: number | null;
  totalCalificaciones: number;

  /** Conteos, no porcentajes: el porcentaje se calcula en la vista. */
  distribucion: {
    cinco: number;
    cuatro: number;
    tres: number;
    dos: number;
    una: number;
  };

  /** Nivel 2, agrupado por criterio. */
  aspectos: {
    /** El nombre tal como llegó en la encuesta: texto libre, no un catálogo fijo. */
    criterio: string;
    promedio: number;
    cantidad: number;
  }[];

  tendencia: {
    /** `null` sin base: "sin dato", no -100%. */
    variacion: number | null;
  };

  /** `null` mientras no exista el modelo de incidencias. */
  incidencias: number | null;
}

/**
 * Los KPIs de la cabecera.
 *
 * Se calculan sobre el mismo conjunto que las filas, no con consultas separadas:
 * así el número de arriba y la lista de abajo no pueden discrepar.
 */
export interface ResumenCalificacionesRestaurantes {
  /** `null` si no hay ninguna calificación en el rango. */
  promedioGlobal: number | null;
  restaurantesCalificados: number;
  /** Del total de restaurantes activos, no de los calificados. */
  restaurantesTotales: number;
  totalCalificaciones: number;
  calificacionesHoy: number;

  /** Los tres deltas del diseño, sobre el mismo conjunto filtrado que las filas. */
  variaciones: {
    /**
     * La diferencia del PROMEDIO, en puntos (0,3), no un porcentaje: el promedio va
     * de 1 a 5 y "subió 0,3" es lo que se lee; un porcentaje sería otra cuenta sobre
     * el mismo dato. `null` cuando no hay período anterior con qué comparar.
     */
    promedioVsPeriodoAnterior: number | null;
    /** La variación PORCENTUAL del total de calificaciones (15,7). `null` sin base. */
    totalVsPeriodoAnterior: number | null;
    /** La variación PORCENTUAL de hoy contra ayer (12,1). `null` sin base. */
    hoyVsAyer: number | null;
  };

  distribucion: {
    cinco: number;
    cuatro: number;
    tres: number;
    dos: number;
    una: number;
  };

  /**
   * El promedio por aspecto de TODO el filtro, no de la página: se agrega sobre el
   * mismo conjunto que las filas, así el bloque de la pantalla y la tabla no pueden
   * decir números distintos. Misma forma que los `aspectos` de cada fila —el criterio
   * es texto libre—, así que llegan los que existan y no un conjunto fijo de nombres.
   */
  aspectos: {
    criterio: string;
    promedio: number;
    cantidad: number;
  }[];

  /** Para el gráfico. */
  evolucion: {
    /** ISO 8601. */
    fecha: string;
    promedio: number;
  }[];

  /** ≥ 4.7. */
  destacados: {
    minimo: number;
    cantidad: number;
  };
  /** ≤ 3.5. */
  enAlerta: {
    maximo: number;
    cantidad: number;
  };

  top: {
    restauranteId: string;
    nombre: string;
    promedio: number;
    total: number;
  }[];
}
