"use server";

import { revalidatePath } from "next/cache";

import { obtenerToken } from "@/lib/sesion-servidor";
import { ErrorApi } from "@/services/http";
import { entregasService } from "@/services/entregas.service";

/**
 * Asignación manual de un pedido.
 *
 * Es una Server Action porque escribe: el token sale de la cookie `httpOnly` en el
 * servidor y nunca pasa por el navegador. El componente que la usa es cliente —el
 * operador elige de una lista— pero no conoce el servicio: manda el formulario y
 * recibe `{ error?, exito? }` para mostrar.
 *
 * `revalidatePath` es lo que hace que el pedido desaparezca de la lista sin
 * recargar a mano: al dejar de estar "sin asignar", la página se vuelve a resolver.
 */

export interface ResultadoAsignacion {
  error?: string;
  exito?: string;
}

/** Motivos con los que el backend rechaza una asignación. */
type MotivoAsignacion =
  | "RepartidorOcupado"
  | "RepartidorNoEsCandidato"
  | "EstadoInvalido"
  | "SinPuntoEntrega"
  | "PedidoNoEncontrado";

/**
 * Traducción de cada motivo a lo que el operador necesita saber.
 *
 * El texto no repite el motivo: dice qué pasó y, cuando se puede, qué hacer. "Ese
 * domiciliario ya tiene una entrega activa" le dice al operador que elija otro;
 * "error 409" no le dice nada.
 */
const MENSAJES: Record<MotivoAsignacion, string> = {
  RepartidorOcupado: "Ese domiciliario ya tiene una entrega activa",
  RepartidorNoEsCandidato: "Ese domiciliario no está dentro del radio del pedido",
  EstadoInvalido: "El pedido ya no se puede asignar",
  SinPuntoEntrega: "El pedido no tiene punto de entrega",
  PedidoNoEncontrado: "El pedido ya no existe",
};

export async function asignarPedido(
  _estadoPrevio: ResultadoAsignacion,
  formulario: FormData,
): Promise<ResultadoAsignacion> {
  const pedidoId = String(formulario.get("pedidoId") ?? "").trim();
  const repartidorId = String(formulario.get("repartidorId") ?? "").trim();

  if (!pedidoId || !repartidorId) {
    return { error: "Elegí un domiciliario de la lista." };
  }

  const token = await obtenerToken();

  if (!token) {
    return { error: "Tu sesión venció. Volvé a entrar para asignar el pedido." };
  }

  try {
    const asignacion = await entregasService.asignar(pedidoId, repartidorId, token);

    revalidatePath("/pedidos");

    return {
      exito: `Pedido asignado. El domiciliario está a ${enKilometros(asignacion.distanciaMetros)}.`,
    };
  } catch (error) {
    return { error: mensajeDeError(error) };
  }
}

/**
 * El motivo del rechazo, deducido del estado y del mensaje del backend.
 *
 * `ErrorApi` expone el estado y el mensaje, pero no el `motivo` del cuerpo: `pedir`
 * se queda con `message`. Por eso los dos motivos que comparten estado se
 * distinguen por el texto que manda el backend. Cuando no se reconoce ninguno, la
 * respuesta es el mensaje del backend tal cual: es un dato real y siempre es mejor
 * que un "algo salió mal".
 */
function motivoDe(error: ErrorApi): MotivoAsignacion | null {
  const mensaje = error.message.toLowerCase();

  if (error.estado === 409) {
    return mensaje.includes("ocupad") ? "RepartidorOcupado" : "RepartidorNoEsCandidato";
  }

  if (error.estado === 404) {
    return "PedidoNoEncontrado";
  }

  if (error.estado === 400) {
    return mensaje.includes("punto") ? "SinPuntoEntrega" : "EstadoInvalido";
  }

  return null;
}

/** Traduce el rechazo de la API a algo que el operador pueda leer. */
function mensajeDeError(error: unknown): string {
  if (!(error instanceof ErrorApi)) {
    return "No se pudo conectar con el servidor. Revisá que el backend esté levantado.";
  }

  const motivo = motivoDe(error);

  if (motivo) {
    return MENSAJES[motivo];
  }

  if (error.estado === 401) {
    return "Tu sesión venció. Volvé a entrar.";
  }

  if (error.estado === 403) {
    return "Tu cuenta no tiene permiso para asignar pedidos: la asignación es del administrador.";
  }

  return error.message;
}

/** 1.240 m → "1,2 km". Con coma, porque el portal escribe en español. */
function enKilometros(metros: number): string {
  return `${(metros / 1000).toFixed(1).replace(".", ",")} km`;
}
