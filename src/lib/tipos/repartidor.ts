/** Domiciliarios — contratos del servicio Delivery. */

export type EstadoDomiciliario = "Disponible" | "En servicio" | "En descanso";

export interface Repartidor {
  id: string;
  nombre: string;
  estado: EstadoDomiciliario;
}

/**
 * Posición del domiciliario de un pedido.
 *
 * Es dato vivo: el portal lo consulta desde un componente cliente que refresca
 * solo, no en el render del servidor.
 */
export interface UbicacionDomiciliario {
  latitud: number;
  longitud: number;
  distanciaMetros: number;
  actualizadoEn: string;
}

/* --------------------------------------------------------------------------
   Candidatos para asignar un pedido.

   Contrato de `GET /api/v1/admin/delivery/candidatos/{pedidoId}` (rol ADMIN).
   El backend devuelve la lista YA ORDENADA por distancia al punto de entrega: el
   portal no la reordena ni la filtra, la muestra en ese orden. Es lo que
   reemplaza a la "asignación por IA" del mockup: la sugerencia es el más cercano.
   -------------------------------------------------------------------------- */

/**
 * Un domiciliario que puede tomar el pedido.
 *
 * `servicioActualEstado` y `ocupadoDesde` describen la entrega que tiene encima
 * (o `null` si está libre). NO son "libera en" ni "tiempo de llegada": el backend
 * no calcula esos dos, y un número inventado en el portal se leería como un
 * compromiso de tiempo que nadie puede cumplir. `ocupadoDesde` es el hecho que sí
 * existe: desde cuándo está ocupado.
 */
export interface CandidatoEntrega {
  repartidorId: string;
  nombreCompleto: string;
  ciudadOperacion: string;
  /** Distancia al punto de entrega del pedido. */
  distanciaMetros: number;
  disponible: boolean;
  /** Código de la entrega en curso, o `null` si está libre. */
  servicioActualCodigo: string | null;
  servicioActualEstado: string | null;
  /** Desde cuándo está ocupado (ISO 8601), o `null` si está libre. */
  ocupadoDesde: string | null;
}

/** Sobre de candidatos de un pedido. `radioKm` es el radio de cobertura. */
export interface CandidatosDePedido {
  pedidoId: string;
  codigo: string;
  radioKm: number;
  total: number;
  candidatos: CandidatoEntrega[];
}

/**
 * Resultado de pedir los candidatos de un pedido.
 *
 * Un error de negocio —un pedido sin punto de entrega, por ejemplo— no es una
 * excepción: el backend lo explica con un motivo concreto y el portal tiene que
 * mostrarlo tal cual. Por eso la pantalla recibe un resultado y decide qué
 * dibujar, en vez de dejar que un rechazo se lleve puesta la página entera.
 */
export type ResultadoCandidatos =
  | { ok: true; datos: CandidatosDePedido }
  | { ok: false; motivo: string };

/**
 * Respuesta de `POST /api/v1/admin/delivery/asignar/{pedidoId}`.
 *
 * Cuando la asignación se rechaza, `pedir` lanza `ErrorApi` con el estado y el
 * mensaje del backend; los motivos (`RepartidorOcupado`, ...) se traducen en la
 * Server Action.
 */
export interface AsignacionConfirmada {
  message: string;
  pedidoId: string;
  repartidorId: string;
  /** Distancia del domiciliario asignado al punto de entrega. */
  distanciaMetros: number;
}
