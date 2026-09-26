import { Suspense } from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { DistribucionEstrellas } from "@/components/calificaciones/DistribucionEstrellas";
import { EvolucionPromedio } from "@/components/calificaciones/EvolucionPromedio";
import { FiltrosCalificaciones } from "@/components/calificaciones/FiltrosCalificaciones";
import { ListaCalificacionesRestaurantes } from "@/components/calificaciones/ListaCalificacionesRestaurantes";
import { PromedioPorAspecto } from "@/components/calificaciones/PromedioPorAspecto";
import { ResumenCalificaciones } from "@/components/calificaciones/ResumenCalificaciones";
import { TopRestaurantes } from "@/components/calificaciones/TopRestaurantes";
import { EncabezadoSeccion } from "@/components/ui/EncabezadoSeccion";
import { EsqueletoTarjeta } from "@/components/ui/Esqueleto";
import { obtenerToken } from "@/lib/sesion-servidor";
import { diaValido, ventanaDeDias } from "@/lib/ventana";
import { calificacionesRestaurantesService } from "@/services/calificaciones-restaurantes.service";

/** El título de la barra del navegador es el de la entrada de la barra lateral. */
export const metadata: Metadata = { title: "Calificaciones y referidos" };

type Parametros = Record<string, string | string[] | undefined>;

/** Diez por página: el tamaño con el que se midió la tabla. */
const POR_PAGINA = 10;

/**
 * La ventana por defecto: los últimos 30 días, contando hoy.
 *
 * El endpoint EXIGE una ventana —"sin ventana la lista y el resumen no salen del mismo
 * conjunto"—, así que la pantalla tiene que abrir con una. Es una decisión de producto y
 * no del contrato, por eso vive acá y no en `lib/ventana.ts`, que solo sabe traducir el
 * día que se le pida.
 */
const DIAS_POR_DEFECTO = 30;

/**
 * Los cuatro bloques de resumen, en 2x2.
 *
 * No van en una sola fila de cuatro: cada bloque necesita unos 300 px para que la barra del
 * promedio por aspecto y los puntajes por criterio se lean, y a cuatro columnas el ancho no
 * alcanza hasta pantallas de 1920. En 2x2 cada bloque respira y los cuatro quedan a la vista
 * sin desplazarse.
 */
const BLOQUES = "grid gap-4 lg:grid-cols-2";

/**
 * Calificaciones a restaurantes: los indicadores, los cuatro bloques de resumen y la tabla.
 *
 * Los datos son de DOS endpoints —el listado paginado y el resumen—, así que son dos
 * promesas y no una: cada sección espera la suya dentro de su propio límite de Suspense y la
 * pantalla no frena mientras llegan. El resumen se pide con LOS MISMOS filtros que el
 * listado —ventana de fechas incluida—, que es lo que impide que el número de arriba y las
 * filas de abajo discrepen.
 *
 * No hay ruta proxy en `app/api/`: el token vive en una cookie `httpOnly` y los servicios son
 * `server-only`, así que el acceso a datos pasa por este componente de servidor y los
 * componentes reciben la promesa, no el token.
 */
export default async function PaginaCalificaciones({
  searchParams,
}: {
  searchParams: Promise<Parametros>;
}) {
  const token = await obtenerToken();

  if (!token) {
    redirect("/login");
  }

  const params = await searchParams;

  // La ventana es OBLIGATORIA en el endpoint y no un adorno: es lo que hace que los KPIs
  // de arriba y las filas de abajo salgan del mismo conjunto. Sin fechas en la URL se usa
  // la de por defecto en vez de pedir la lista sin ventana, que es lo que el backend
  // rechaza con un 400 —y con razón.
  const ventana = ventanaDeDias(DIAS_POR_DEFECTO);
  const desde = diaValido(texto(params.desde)) ?? ventana.desde;
  const hasta = diaValido(texto(params.hasta)) ?? ventana.hasta;

  // Los filtros tal como están en la URL, para reconstruir el enlace de página sin
  // perderlos. Se leen crudos: la URL es la que manda, no el filtro ya interpretado.
  // La ventana va con el valor EFECTIVO, no con el que traía la URL, porque el enlace de
  // página tiene que conservar la ventana que se está mostrando.
  const actuales = {
    desde,
    hasta,
    buscar: texto(params.buscar),
    zona: texto(params.zona),
    tipoDeComida: texto(params.tipoDeComida),
    calificacionMin: texto(params.calificacionMin),
    calificacionMax: texto(params.calificacionMax),
    pagina: texto(params.pagina),
  };

  // La ventana se escribe en la URL si no estaba —o si no se podía leer—: así la barra
  // de direcciones dice qué rango se está mirando y el enlace se puede compartir sin que
  // dentro de tres días muestre, en silencio, otro rango. Con la ventana ya puesta esto
  // no vuelve a pasar, así que la redirección sucede una sola vez.
  if (texto(params.desde) !== desde || texto(params.hasta) !== hasta) {
    redirect(enlace(actuales, {}));
  }

  const filtros = {
    desde,
    hasta,
    buscar: actuales.buscar,
    zona: actuales.zona,
    tipoDeComida: actuales.tipoDeComida,
    calificacionMin: numero(actuales.calificacionMin),
    calificacionMax: numero(actuales.calificacionMax),
  };

  const resumen = calificacionesRestaurantesService.resumen(filtros, token);
  const pagina = calificacionesRestaurantesService.listado(
    { ...filtros, pagina: numero(actuales.pagina) ?? 1, tamano: POR_PAGINA },
    token,
  );

  return (
    <>
      <EncabezadoSeccion titulo="Calificaciones a restaurantes" />

      <Suspense fallback={<FilaKpi />}>
        <ResumenCalificaciones datos={resumen} />
      </Suspense>

      <FiltrosCalificaciones />

      <div className={BLOQUES}>
        <Suspense fallback={<EsqueletoTarjeta lineas={5} />}>
          <DistribucionEstrellas datos={resumen} />
        </Suspense>

        <Suspense fallback={<EsqueletoTarjeta lineas={5} />}>
          <PromedioPorAspecto datos={resumen} />
        </Suspense>

        <Suspense fallback={<EsqueletoTarjeta lineas={5} />}>
          <EvolucionPromedio datos={resumen} />
        </Suspense>

        <Suspense fallback={<EsqueletoTarjeta lineas={5} />}>
          <TopRestaurantes datos={resumen} />
        </Suspense>
      </div>

      {/*
        El `id` es el destino de "Ver ranking completo" del bloque de top 5: no hay una
        pantalla de ranking aparte, así que el botón lleva a la lista completa de
        restaurantes —la única que existe— dentro de esta misma pantalla.
      */}
      <div id="ranking-restaurantes" className="scroll-mt-4">
        <Suspense fallback={<EsqueletoTarjeta lineas={8} />}>
          <ListaCalificacionesRestaurantes
            datos={pagina}
            enlacePagina={(destino) =>
              enlace(actuales, { pagina: destino > 1 ? String(destino) : undefined })
            }
          />
        </Suspense>
      </div>
    </>
  );
}

/** Esqueleto con la forma de la franja de seis indicadores, para el primer pintado. */
function FilaKpi() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
      {Array.from({ length: 6 }, (_, indice) => (
        <EsqueletoTarjeta key={indice} lineas={2} />
      ))}
    </div>
  );
}

/**
 * Reconstruye la URL de la pantalla cambiando solo lo que se pide.
 *
 * Un valor vacío borra el parámetro, así "Limpiar filtros" y volver a la página 1 son lo
 * mismo —dejar de mandarlo— y no hace falta una lista de parámetros válidos.
 */
function enlace(
  actuales: Record<string, string | undefined>,
  cambios: Record<string, string | undefined>,
): string {
  const params = new URLSearchParams();

  for (const [clave, valor] of Object.entries({ ...actuales, ...cambios })) {
    if (valor) params.set(clave, valor);
  }

  return `/calificaciones?${params.toString()}`;
}

/** Un parámetro de la URL es texto: se toma el primero y se descarta lo vacío. */
function texto(valor: string | string[] | undefined): string | undefined {
  const primero = Array.isArray(valor) ? valor[0] : valor;
  return primero?.trim() || undefined;
}

/** Número positivo del query string; cualquier otra cosa se trata como ausente. */
function numero(valor: string | string[] | undefined): number | undefined {
  const n = Number(texto(valor));
  return Number.isInteger(n) && n > 0 ? n : undefined;
}
