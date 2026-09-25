import "server-only";

/**
 * Cliente HTTP del portal.
 *
 * Habla con el **gateway** (puerto 5000), no con cada servicio por separado: el
 * gateway resuelve el enrutamiento y aplica el rate limit.
 *
 * Es `server-only`: este módulo maneja el token de sesión, así que no puede
 * importarse desde un componente cliente. Si alguien lo intenta, el build falla
 * — es preferible a que el token termine en el navegador.
 */

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

export class ErrorApi extends Error {
  constructor(
    readonly estado: number,
    readonly ruta: string,
    mensaje?: string,
  ) {
    super(mensaje ?? `La petición a ${ruta} falló con estado ${estado}`);
    this.name = "ErrorApi";
  }

  /** El token venció o no es válido: hay que mandar al login. */
  get esNoAutorizado(): boolean {
    return this.estado === 401;
  }

  /** El usuario está autenticado pero su rol no alcanza para esta pantalla. */
  get esProhibido(): boolean {
    return this.estado === 403;
  }
}

interface OpcionesPeticion {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  /** Token de sesión. Sin token, la petición sale anónima (rutas públicas). */
  token?: string;
  /** Revalidación de caché de Next, en segundos. 0 = siempre fresco. */
  revalidar?: number;
}

/**
 * Motivo legible de un error de la API.
 *
 * `ErrorApi` ya trae el mensaje que mandó el backend, y para un 400 o un 409 ese
 * mensaje es un diagnóstico preciso —"el pedido no tiene punto de entrega: no se
 * puede calcular cercanía"—, así que mostrarlo es mejor que inventar una causa
 * probable. Inventar ("¿estará caído el servicio?") manda a buscar el problema al
 * lugar equivocado, y encima tapa el dato que el backend ya había explicado.
 *
 * Cualquier otro error sí es opaco: ahí se dice solo lo que se sabe.
 */
export function motivoDeError(error: unknown): string {
  if (error instanceof ErrorApi) return error.message;
  return "La petición falló y el servidor no explicó por qué.";
}

/**
 * Ejecuta una petición contra la API y devuelve el cuerpo tipado.
 *
 * No atrapa errores: quien llama decide qué mostrar. Un `catch` genérico acá
 * convertiría un 403 en un "algo salió mal" y perdería el motivo.
 */
export async function pedir<T>(ruta: string, opciones: OpcionesPeticion = {}): Promise<T> {
  const { method = "GET", body, token, revalidar } = opciones;

  const respuesta = await fetch(`${BASE}${ruta}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
    next: revalidar === undefined ? undefined : { revalidate: revalidar },
  });

  if (!respuesta.ok) {
    // El cuerpo del error trae el motivo real del backend; se adjunta para que
    // la pantalla pueda mostrarlo en lugar de un mensaje genérico.
    const detalle = await leerMensajeDeError(respuesta);
    throw new ErrorApi(respuesta.status, ruta, detalle);
  }

  // 204 No Content: hay endpoints que no devuelven cuerpo.
  if (respuesta.status === 204) {
    return undefined as T;
  }

  return (await respuesta.json()) as T;
}

async function leerMensajeDeError(respuesta: Response): Promise<string | undefined> {
  try {
    const cuerpo = (await respuesta.json()) as { message?: string; title?: string };
    return cuerpo.message ?? cuerpo.title;
  } catch {
    // Un error sin cuerpo JSON (502 del gateway, por ejemplo) no aporta detalle.
    return undefined;
  }
}
