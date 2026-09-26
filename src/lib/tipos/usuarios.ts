/**
 * Usuarios — contratos del listado de cuentas del portal.
 *
 * El contrato lo define `Deuna.Identity.Service` y los nombres coinciden con sus
 * DTOs: un cambio allá obliga a un cambio acá. El endpoint todavía no está
 * desplegado —vive en una rama sin mergear y hoy responde 404—; esto es solo el
 * contrato, y la pantalla se programa contra él y no contra una ruta inventada.
 *
 * Reglas que valen para todo lo de abajo:
 * - Fechas como ISO 8601 en string, nunca como número.
 * - `| null` explícito en todo lo que puede faltar, y el comentario dice por qué.
 * - Los catálogos cerrados —el tipo y el estado— son uniones de literales y no
 *   `string`: un valor nuevo en el backend rompe la compilación en lugar de
 *   mostrarse en crudo en una celda.
 * - Lo que falta viaja en `null`, no en `0` ni en una lista vacía: un conteo de cero
 *   y un conteo que no existe se ven igual en pantalla y significan cosas opuestas.
 */

/**
 * Los tipos de cuenta que administra el portal.
 *
 * Es el catálogo del backend y también el origen del selector de tipo de la barra de
 * filtros: agregar un tipo acá es agregarlo a la pantalla, sin tocar el componente.
 */
export const TIPOS_USUARIO = ["Administrador", "Restaurante", "Domiciliario"] as const;

export type TipoUsuario = (typeof TIPOS_USUARIO)[number];

/**
 * Los estados de una cuenta.
 *
 * `Suspendido` es la suspensión que decide un administrador y `Inactivo` la cuenta que
 * quedó sin uso —nunca entró o se dio de baja—. Se distinguen porque el operador hace
 * cosas distintas con cada una: a la suspendida le devuelve el acceso, a la inactiva
 * la revisa.
 */
export const ESTADOS_USUARIO = ["Activo", "Suspendido", "Inactivo"] as const;

export type EstadoUsuario = (typeof ESTADOS_USUARIO)[number];

/** Una fila de la tabla: una cuenta del portal. */
export interface Usuario {
  id: string;
  nombre: string;
  email: string;

  /** Lo que separa los tres indicadores del desglose de la cabecera. */
  tipo: TipoUsuario;

  /**
   * Las zonas que tiene asignadas. `null` cuando el tipo de cuenta no usa zonas —un
   * administrador, un restaurante— o cuando todavía no le asignaron ninguna: un
   * arreglo vacío no viaja porque no agrega un estado distinto y la pantalla
   * terminaría mostrando dos textos para la misma falta.
   */
  zonas: string[] | null;

  estado: EstadoUsuario;

  /**
   * El nivel de acceso, como texto. El backend es el dueño de la escala —no es un
   * catálogo cerrado como el tipo o el estado— y acá se muestra tal cual: traducirlo
   * en el portal sería inventar una segunda escala que se desactualiza sola.
   * `null` mientras la cuenta no tenga nivel asignado.
   */
  nivelAcceso: string | null;

  /**
   * ISO 8601. `null` para la cuenta que nunca entró —el 6% de las cuentas reales—:
   * ahí la celda dice "Sin dato" y no una fecha vacía, y tampoco la fecha de alta,
   * que es otro dato y afirmaría que entró cuando no lo hizo.
   */
  ultimoAcceso: string | null;
}

/**
 * El sobre de la página.
 *
 * `total` es el total que cumple los filtros, no la cantidad de `items`: con
 * `tamano = 10`, la página 2 trae 10 items y un `total` de, por ejemplo, 137.
 */
export interface PaginaUsuarios {
  items: Usuario[];
  total: number;
  pagina: number;
  tamano: number;
}

/**
 * Los desgloses de la cabecera.
 *
 * No traen el total: ese ya viaja en `PaginaUsuarios.total` y repetirlo sería un
 * segundo campo con el mismo significado que puede discrepar del primero. La tarjeta
 * "Total de usuarios" lo lee de ahí.
 *
 * Se calculan sobre el MISMO conjunto filtrado que las filas, no con consultas
 * separadas: así el número de arriba y la lista de abajo no pueden discrepar. Con el
 * filtro de tipo en "Domiciliario", el desglose muestra los domiciliarios que cumplen
 * el filtro y los otros dos en cero, que es exactamente lo que se está mirando.
 */
export interface ResumenUsuarios {
  administradores: number;
  restaurantes: number;
  domiciliarios: number;
  /** Los que están en estado `Activo`. */
  activos: number;
}

/**
 * La respuesta del endpoint: el sobre de la página y los desgloses de la cabecera.
 *
 * No es un contrato nuevo de datos: compone los dos de arriba sin cambiarles un campo.
 * Viajan juntos porque salen del MISMO conjunto —son una consulta, no dos que puedan
 * discrepar—, que es lo que impide el contador que dice 42 con una lista de 38.
 */
export interface RespuestaUsuarios {
  pagina: PaginaUsuarios;
  resumen: ResumenUsuarios;
}

/**
 * Los filtros del listado, tal como los manda el portal.
 *
 * Es la forma de la PETICIÓN y sus nombres son los del query string del endpoint.
 *
 * No hay filtro de zona: el contrato todavía no lo tiene y la pantalla no puede
 * ofrecer un control que el backend ignore. El día que exista, se agrega acá y el
 * servicio lo manda.
 */
export interface FiltrosUsuarios {
  /** Nombre o email; el backend decide qué campos mira. */
  buscar?: string;
  tipo?: TipoUsuario;
  estado?: EstadoUsuario;
  pagina?: number;
  tamano?: number;
}
