/**
 * Mapa de la operación — contrato de `GET /api/v1/admin/delivery/mapa` (rol ADMIN).
 *
 * Las tres capas vienen de fuentes distintas y se mueven distinto: los
 * domiciliarios publican su posición en vivo (app móvil), los pedidos y los
 * restaurantes son fijos. Por eso el modelo las separa en lugar de un único
 * listado de puntos: el mapa necesita saber cuál es cuál para dibujarlos
 * distinto, y el refresco solo tiene sentido para la primera.
 */

import type { EstadoPedido } from "@/lib/tipos/pedido";

/**
 * Un domiciliario con su última posición conocida.
 *
 * `vigente` sale del hash de timestamps del backend: `false` significa telemetría
 * vieja o sin timestamp, NO que el domiciliario no exista. Se dibuja igual —en
 * gris— a propósito: si se lo ocultara, "no hay flota" y "la flota no está
 * reportando" se verían idénticos y el operador creería que no tiene domiciliarios
 * cuando en realidad los tiene, solo que sin señal.
 */
export interface DomiciliarioEnMapa {
  repartidorId: string;
  nombre: string;
  latitud: number;
  longitud: number;
  /** `false` = posición vieja o sin timestamp. */
  vigente: boolean;
  /** Tiene una entrega activa (`Asignado`, `ConfirmadoEnLocal`, `EnRuta`). */
  ocupado: boolean;
  /** Código de la entrega en curso, o `null` si está libre. */
  servicioActualCodigo: string | null;
}

/** Un pedido activo con punto de entrega: la capa de destinos del mapa. */
export interface PedidoEnMapa {
  pedidoId: string;
  codigo: string;
  latitud: number;
  longitud: number;
  estado: EstadoPedido;
}

/**
 * Un restaurante ubicado por su dirección.
 *
 * El backend geocodifica `DireccionSede` (es texto, no coordenadas) y cachea el
 * resultado. Un restaurante que no se pudo geocodificar NO viaja acá: se omite y
 * se loguea, porque una coordenada inventada sería peor que un punto que falta.
 */
export interface RestauranteEnMapa {
  restauranteId: string;
  nombre: string;
  latitud: number;
  longitud: number;
}

/** Las tres capas del mapa, tal como las devuelve el endpoint. */
export interface DatosMapa {
  domiciliarios: DomiciliarioEnMapa[];
  pedidos: PedidoEnMapa[];
  restaurantes: RestauranteEnMapa[];
}

/**
 * ¿El cuerpo recibido tiene forma de mapa?
 *
 * El mapa se refresca con `fetch` desde el navegador y una respuesta puede ser
 * cualquier cosa —un redirect al login, una página de error en HTML—: sin esta
 * verificación, un cuerpo ajeno entraría al mapa como si fuera la flota y el
 * fallo aparecería recién al dibujar, lejos de su causa.
 */
export function esDatosMapa(valor: unknown): valor is DatosMapa {
  if (!valor || typeof valor !== "object") return false;

  const capas = valor as Partial<DatosMapa>;
  return (
    Array.isArray(capas.domiciliarios) &&
    Array.isArray(capas.pedidos) &&
    Array.isArray(capas.restaurantes)
  );
}

/**
 * Resultado de pedir el mapa.
 *
 * Un error de negocio o de permisos no puede llevarse puesta la pantalla de
 * pedidos: la sección recibe un resultado y decide qué dibujar, en vez de dejar
 * que un rechazo se vaya al `error.tsx` de la ruta por un mapa que no cargó.
 */
export type ResultadoMapa =
  | { ok: true; datos: DatosMapa }
  | { ok: false; motivo: string };
