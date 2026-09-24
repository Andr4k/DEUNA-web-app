import type {
  Actividad,
  IndicadoresDelDia,
  Pedido,
  RendimientoDelDia,
  Zona,
} from "@/lib/tipos";

/**
 * Datos de ejemplo del panel.
 *
 * Son los del mockup aprobado, tipados, para poder construir la interfaz sin
 * backend. TODO: reemplazar por llamadas a la API (ver `lib/api.ts`). Ninguna
 * pantalla debe importar este archivo una vez conectada la API real.
 *
 * Ojo: las cifras vienen del mockup y NO cuadran entre sí (los estados suman
 * 268 contra 236 totales; en Zonas, Rionegro tiene 136 pedidos pero 118 + 8 =
 * 126). Cuando sean datos reales, tienen que cuadrar: un panel que no cuadra
 * pierde credibilidad.
 */

const HOY = new Date();

function haceMinutos(minutos: number): string {
  return new Date(HOY.getTime() - minutos * 60_000).toISOString();
}

export const INDICADORES: IndicadoresDelDia = {
  pedidosTotales: 236,
  pedidosEnCurso: 28,
  pedidosEntregados: 198,
  incidencias: 10,
  recaudo: 234_000,
  variacion: {
    pedidosTotales: 18,
    pedidosEnCurso: 5,
    pedidosEntregados: 13,
    incidencias: -2,
    recaudo: 10,
  },
};

/** Desglose de pedidos por estado, tal como lo cuenta el backend. */
export const PEDIDOS_POR_ESTADO = [
  { etiqueta: "Sin asignar", valor: 12, estado: "Buscando" as const },
  { etiqueta: "Asignados", valor: 28, estado: "Asignado" as const },
  { etiqueta: "En camino", valor: 21, estado: "EnRuta" as const },
  { etiqueta: "En entrega", valor: 9, estado: "ConfirmadoEnLocal" as const },
  { etiqueta: "Entregados", valor: 198, estado: "Entregado" as const },
];

export const DOMICILIARIOS = {
  activos: 37,
  disponibles: 18,
  enServicio: 17,
  enDescanso: 2,
};

export const RESTAURANTES = {
  activos: 124,
  conPedidosHoy: 68,
  nuevosHoy: 3,
};

export const ZONAS: Zona[] = [
  { nombre: "Rionegro", pedidos: 136, entregados: 118, pendientes: 8, recaudo: 177_000 },
  { nombre: "La Ceja", pedidos: 54, entregados: 48, pendientes: 4, recaudo: 72_000 },
  { nombre: "Marinilla", pedidos: 28, entregados: 26, pendientes: 2, recaudo: 36_000 },
  { nombre: "Otros", pedidos: 18, entregados: 16, pendientes: 2, recaudo: 24_000 },
];

export const ULTIMOS_PEDIDOS: Pedido[] = [
  {
    id: "1",
    codigo: "PED-000245",
    restauranteId: "r1",
    restauranteNombre: "Burger House",
    repartidorId: "d1",
    repartidorNombre: "Juan Pérez",
    estado: "EnRuta",
    total: 8_000,
    zona: "Rionegro",
    creadoEn: haceMinutos(15),
    minutosTranscurridos: 15,
  },
  {
    id: "2",
    codigo: "PED-000233",
    restauranteId: "r2",
    restauranteNombre: "Sabor Criollo",
    repartidorId: null,
    repartidorNombre: null,
    estado: "Buscando",
    total: 7_000,
    zona: "La Ceja",
    creadoEn: haceMinutos(37),
    minutosTranscurridos: null,
  },
  {
    id: "3",
    codigo: "PED-000198",
    restauranteId: "r3",
    restauranteNombre: "Pizza Express",
    repartidorId: "d2",
    repartidorNombre: "María López",
    estado: "Entregado",
    total: 9_500,
    zona: "Rionegro",
    creadoEn: haceMinutos(43),
    minutosTranscurridos: 32,
  },
  {
    id: "4",
    codigo: "PED-000176",
    restauranteId: "r4",
    restauranteNombre: "Sushi Time",
    repartidorId: "d3",
    repartidorNombre: "Andrés Giraldo",
    estado: "Cancelado",
    total: 8_500,
    zona: "Marinilla",
    creadoEn: haceMinutos(60),
    minutosTranscurridos: null,
  },
  {
    id: "5",
    codigo: "PED-000152",
    restauranteId: "r5",
    restauranteNombre: "Wok & Roll",
    repartidorId: "d4",
    repartidorNombre: "Camila Restrepo",
    estado: "EnRuta",
    total: 8_000,
    zona: "La Ceja",
    creadoEn: haceMinutos(73),
    minutosTranscurridos: 18,
  },
];

export const ACTIVIDAD: Actividad[] = [
  { hora: "10:43 a. m.", tipo: "pedido", texto: "Pedido #PED-000245 sin asignar desde Burger House" },
  { hora: "10:21 a. m.", tipo: "entrega", texto: "Juan Pérez entregó pedido #PED-000233" },
  { hora: "10:15 a. m.", tipo: "dinero", texto: "Restaurante Pizza Express realizó consignación por $45.000" },
  { hora: "09:58 a. m.", tipo: "incidencia", texto: "Nueva incidencia reportada en pedido #PED-000198" },
  { hora: "09:45 a. m.", tipo: "servicio", texto: "María López inició servicio en zona La Ceja" },
];

export const RENDIMIENTO: RendimientoDelDia = {
  entregasATiempo: 94,
  tiempoPromedioMin: 27,
  calificacionPromedio: 4.8,
};

export const ALERTAS = {
  sinAsignar: 12,
  demorados: 7,
  incidenciasSinResolver: 3,
};
