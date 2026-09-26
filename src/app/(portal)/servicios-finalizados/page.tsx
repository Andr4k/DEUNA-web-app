import { Suspense } from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { FiltrosServiciosFinalizados } from "@/components/servicios-finalizados/FiltrosServiciosFinalizados";
import { ListaServiciosFinalizados } from "@/components/servicios-finalizados/ListaServiciosFinalizados";
import { ResumenServiciosFinalizados } from "@/components/servicios-finalizados/ResumenServiciosFinalizados";
import { EncabezadoSeccion } from "@/components/ui/EncabezadoSeccion";
import { EsqueletoTarjeta } from "@/components/ui/Esqueleto";
import { obtenerToken } from "@/lib/sesion-servidor";
import type { FiltrosServiciosFinalizados as Filtros } from "@/lib/tipos/servicios-finalizados";
import { serviciosFinalizadosService } from "@/services/servicios-finalizados.service";

export const metadata: Metadata = { title: "Servicios finalizados" };

type Parametros = Record<string, string | string[] | undefined>;

/** Diez por página: el tamaño que pide el brief y con el que se midió la tabla. */
const POR_PAGINA = 10;

/**
 * Historial de servicios finalizados.
 *
 * La petición arranca acá y **no se espera**: la misma promesa se pasa a las dos
 * secciones y cada una la resuelve dentro de su propio límite de Suspense. Son una
 * sola consulta a propósito —el endpoint devuelve las filas y los KPIs del mismo
 * conjunto—, así el número de arriba no puede discrepar de la lista de abajo.
 *
 * No hay ruta proxy en `app/api/`: el token vive en una cookie `httpOnly` y los
 * servicios son `server-only`, así que el acceso a datos pasa por este componente de
 * servidor y los componentes reciben la promesa, no el token. La ruta `/api/mapa`
 * existe porque el mapa es una isla de cliente que hace polling, y acá no hay cliente
 * que pida datos.
 */
export default async function PaginaServiciosFinalizados({
  searchParams,
}: {
  searchParams: Promise<Parametros>;
}) {
  const token = await obtenerToken();

  if (!token) {
    redirect("/login");
  }

  const params = await searchParams;

  const filtros: Filtros = {
    desde: texto(params.desde),
    hasta: texto(params.hasta),
    zona: texto(params.zona),
    calificacionMin: numero(params.calificacionMin),
    buscar: texto(params.buscar),
    pagina: numero(params.pagina) ?? 1,
    tamano: POR_PAGINA,
  };

  const datos = serviciosFinalizadosService.historial(filtros, token);

  // Los filtros tal como están en la URL, para reconstruir el enlace de página sin
  // perderlos. Se leen crudos: la URL es la que manda, no el filtro ya interpretado.
  const actuales = {
    desde: texto(params.desde),
    hasta: texto(params.hasta),
    zona: texto(params.zona),
    calificacionMin: texto(params.calificacionMin),
    buscar: texto(params.buscar),
    pagina: texto(params.pagina),
  };

  return (
    <>
      <EncabezadoSeccion titulo="Servicios finalizados" />

      <Suspense fallback={<FilaKpi />}>
        <ResumenServiciosFinalizados datos={datos} />
      </Suspense>

      <FiltrosServiciosFinalizados />

      <Suspense fallback={<EsqueletoTarjeta lineas={8} />}>
        <ListaServiciosFinalizados
          datos={datos}
          enlacePagina={(destino) =>
            enlace(actuales, { pagina: destino > 1 ? String(destino) : undefined })
          }
        />
      </Suspense>
    </>
  );
}

/** Esqueleto con la forma de la franja de indicadores, para el primer pintado. */
function FilaKpi() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {Array.from({ length: 5 }, (_, indice) => (
        <EsqueletoTarjeta key={indice} lineas={2} />
      ))}
    </div>
  );
}

/**
 * Reconstruye la URL de la pantalla cambiando solo lo que se pide.
 *
 * Un valor vacío borra el parámetro, así "Limpiar filtros" y volver a la página 1 son
 * lo mismo —dejar de mandarlo— y no hace falta una lista de parámetros válidos.
 */
function enlace(
  actuales: Record<string, string | undefined>,
  cambios: Record<string, string | undefined>,
): string {
  const params = new URLSearchParams();

  for (const [clave, valor] of Object.entries({ ...actuales, ...cambios })) {
    if (valor) params.set(clave, valor);
  }

  return `/servicios-finalizados?${params.toString()}`;
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
