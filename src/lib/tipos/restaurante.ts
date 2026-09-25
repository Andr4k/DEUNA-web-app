/** Restaurantes — contratos del servicio Identity. */

export interface Restaurante {
  id: string;
  nombreComercial: string;
  razonSocial: string;
  nit: string;
  ciudad: string;
  activo: boolean;
  /** Pedidos que recibió hoy. Lo calcula el backend, no el portal. */
  pedidosHoy: number;
}
