import { EstadoVacio } from "@/components/ui/EstadoVacio";
import { Paginacion } from "@/components/ui/Paginacion";
import { Tabla } from "@/components/ui/Tabla";
import { Tarjeta } from "@/components/ui/Tarjeta";
import { columnasCalificacionesRestaurantes } from "@/components/calificaciones/columnasCalificacionesRestaurantes";
import type { PaginaCalificacionesRestaurantes } from "@/lib/tipos/calificaciones-restaurantes";

interface Props {
  datos: Promise<PaginaCalificacionesRestaurantes>;
  /** Arma el enlace de una página conservando los filtros activos. */
  enlacePagina: (pagina: number) => string;
}

/**
 * Tabla de restaurantes con sus calificaciones.
 *
 * Es una de las secciones que espera la promesa: la recibe y la resuelve acá adentro, así
 * la pantalla no frena mientras llegan los datos. La paginación vive en esta tarjeta y no
 * en la página porque `totalPaginas` sale del `total` del endpoint, y ese número solo
 * existe después de esperar — que la página, por la regla del servidor primero, no espera.
 *
 * La tabla va `compacta`: son nueve columnas y varias traen dos o tres líneas (la nota con
 * su barra, la distribución, los criterios), así que el aire de la tabla normal la vuelve
 * ilegible antes de que haga falta desplazarla.
 *
 * La promesa es la única que resuelve el listado: los cuatro bloques de arriba salen del
 * resumen, así que la pantalla son dos `fetch` y no cinco. El bloque de promedio por
 * criterios leía de esta tabla porque el resumen no exponía los aspectos; ahora los expone
 * y los lee de allá.
 */
export async function ListaCalificacionesRestaurantes({ datos, enlacePagina }: Props) {
  const pagina = await datos;
  const tamano = pagina.tamano > 0 ? pagina.tamano : 1;
  const totalPaginas = Math.max(1, Math.ceil(pagina.total / tamano));

  return (
    <Tarjeta
      titulo="Restaurantes calificados"
      pie={
        totalPaginas > 1 ? (
          <Paginacion pagina={pagina.pagina} totalPaginas={totalPaginas} href={enlacePagina} />
        ) : undefined
      }
    >
      <Tabla
        compacta
        columnas={columnasCalificacionesRestaurantes()}
        filas={pagina.items}
        claveFila={(restaurante) => restaurante.restauranteId}
        sinDatos={
          <EstadoVacio
            icono="estrella"
            titulo="Ningún restaurante con calificaciones"
            descripcion="Con estos filtros no hay restaurantes calificados. Si esperabas ver alguno, probá ampliar el rango de calificación o limpiar los filtros."
          />
        }
      />
    </Tarjeta>
  );
}
