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
import { calificacionesRestaurantesService } from "@/services/calificaciones-restaurantes.service";

/** El título de la barra del navegador es el de la entrada de la barra lateral. */
export const metadata: Metadata = { title: "Calificaciones y referidos" };

type Parametros = Record<string, string | string[] | undefined>;

/** Diez por página: el tamaño con el que se midió la tabla. */
const POR_PAGINA = 10;

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
 * listado, que es lo que impide que el número de arriba y las filas de abajo discrepen.
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

  // Los filtros tal como están en la URL, para reconstruir el enlace de página sin
  // perderlos. Se leen crudos: la URL es la que manda, no el filtro ya interpretado.
  const actuales = {
    buscar: texto(params.buscar),
    zona: texto(params.zona),
    tipoDeComida: texto(params.tipoDeComida),
    calificacionMin: texto(params.calificacionMin),
    calificacionMax: texto(params.calificacionMax),
    pagina: texto(params.pagina),
  };

  const filtros = {
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
          <PromedioPorAspecto datos={pagina} />
        </Suspense>

        <Suspense fallback={<EsqueletoTarjeta lineas={5} />}>
          <EvolucionPromedio datos={resumen} />
        </Suspense>

        <Suspense fallback={<EsqueletoTarjeta lineas={5} />}>
          <TopRestaurantes datos={resumen} />
        </Suspense>
      </div>

      <Suspense fallback={<EsqueletoTarjeta lineas={8} />}>
        <ListaCalificacionesRestaurantes
          datos={pagina}
          enlacePagina={(destino) =>
            enlace(actuales, { pagina: destino > 1 ? String(destino) : undefined })
          }
        />
      </Suspense>
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
