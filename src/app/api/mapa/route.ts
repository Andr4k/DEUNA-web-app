import { NextResponse } from "next/server";

import { obtenerToken } from "@/lib/sesion-servidor";
import { entregasService } from "@/services/entregas.service";
import { ErrorApi, motivoDeError } from "@/services/http";

/**
 * Puente entre el mapa del portal y el gateway.
 *
 * El navegador no puede pedirle la flota a la API por su cuenta: el token vive en
 * una cookie `httpOnly` y los servicios son `server-only`. Este Route Handler lee
 * la cookie en el servidor, llama al servicio y devuelve el JSON — el mapa hace
 * polling contra esta misma ruta y el token nunca toca el navegador.
 *
 * Cuando el backend rechaza se devuelve su estado y su motivo tal cual: es el
 * diagnóstico que el operador necesita. Cambiarlo por un "algo salió mal" manda a
 * buscar el problema al lugar equivocado y tapa el dato que el backend explicó.
 */
export async function GET() {
  const token = await obtenerToken();

  if (!token) {
    return NextResponse.json({ message: "Tu sesión venció. Volvé a entrar." }, { status: 401 });
  }

  try {
    return NextResponse.json(await entregasService.mapa(token));
  } catch (error) {
    return NextResponse.json(
      { message: motivoDeError(error) },
      { status: error instanceof ErrorApi ? error.estado : 502 },
    );
  }
}
