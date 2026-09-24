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
