import { EstadoVacio } from "@/components/ui/EstadoVacio";
import { Paginacion } from "@/components/ui/Paginacion";
import { Tabla } from "@/components/ui/Tabla";
import { Tarjeta } from "@/components/ui/Tarjeta";
import { columnasServiciosFinalizados } from "@/components/servicios-finalizados/columnasServiciosFinalizados";
import type { RespuestaServiciosFinalizados } from "@/lib/tipos/servicios-finalizados";

interface Props {
  datos: Promise<RespuestaServiciosFinalizados>;
  /** Arma el enlace de una página conservando los filtros activos. */
  enlacePagina: (pagina: number) => string;
}

/**
 * Tabla del historial de servicios finalizados.
 *
 * Es la sección que espera la promesa: la recibe y la resuelve acá adentro, así la
 * pantalla no frena mientras llegan los datos. La paginación vive en esta tarjeta y
 * no en la página porque `totalPaginas` sale del `total` del endpoint, y ese número
 * solo existe después de esperar — que la página, por la regla del servidor primero,
 * no espera.
 *
 * La tabla va `compacta`: son nueve columnas y varias traen dos o tres líneas
 * (código, ruta, tiempos, valor), así que el aire de la tabla normal la vuelve
 * ilegible antes de que haga falta desplazarla.
 */
export async function ListaServiciosFinalizados({ datos, enlacePagina }: Props) {
  const { pagina } = await datos;
  const tamano = pagina.tamano > 0 ? pagina.tamano : 1;
  const totalPaginas = Math.max(1, Math.ceil(pagina.total / tamano));

  return (
    <Tarjeta
      titulo="Servicios finalizados"
      pie={
        totalPaginas > 1 ? (
          <Paginacion pagina={pagina.pagina} totalPaginas={totalPaginas} href={enlacePagina} />
        ) : undefined
      }
    >
      <Tabla
        compacta
        columnas={columnasServiciosFinalizados()}
        filas={pagina.items}
        claveFila={(servicio) => servicio.pedidoId}
        sinDatos={
          <EstadoVacio
            icono="check"
            titulo="Ningún servicio finalizado"
            descripcion="Con estos filtros no hay servicios completados en el rango. Si esperabas ver alguno, probá ampliar las fechas o limpiar los filtros."
          />
        }
      />
    </Tarjeta>
  );
}
