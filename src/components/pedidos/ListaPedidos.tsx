import { EstadoVacio } from "@/components/ui/EstadoVacio";
import { Paginacion } from "@/components/ui/Paginacion";
import { Tabla } from "@/components/ui/Tabla";
import { Tarjeta } from "@/components/ui/Tarjeta";
import { columnasPedidos } from "@/components/pedidos/columnasPedidos";
import type { PaginaPedidos } from "@/lib/tipos/pedido";

interface Props {
  datos: Promise<PaginaPedidos>;
  /** Pedido cuyos candidatos se están viendo en el panel de la derecha. */
  seleccionado?: string;
  /** Arma el enlace que selecciona un pedido para asignarlo. */
  enlaceAsignar: (pedidoId: string) => string;
  /** Arma el enlace de una página conservando los filtros. */
  enlacePagina: (pagina: number) => string;
}

/**
 * Tabla de pedidos sin asignar.
 *
 * Es la sección que espera la promesa: recibe los datos y los resuelve acá adentro,
 * así la pantalla no frena mientras llegan. La paginación vive en esta tarjeta y no
 * en la página porque `totalPaginas` sale del `total` que devuelve el endpoint, y
 * ese número solo existe después de esperar la promesa — que la página, por la
 * regla del servidor primero, no espera.
 *
 * No hay columna de estado: el endpoint devuelve, por definición, pedidos
 * "Buscando" (sin asignar), así que una columna que siempre dice lo mismo que el
 * título de la pantalla es ruido.
 */
export async function ListaPedidos({
  datos,
  seleccionado,
  enlaceAsignar,
  enlacePagina,
}: Props) {
  const pagina = await datos;
  const tamano = pagina.tamano > 0 ? pagina.tamano : 1;
  const totalPaginas = Math.max(1, Math.ceil(pagina.total / tamano));

  return (
    <Tarjeta
      titulo="Pedidos sin asignar"
      pie={
        totalPaginas > 1 ? (
          <Paginacion pagina={pagina.pagina} totalPaginas={totalPaginas} href={enlacePagina} />
        ) : undefined
      }
    >
      <Tabla
        columnas={columnasPedidos(enlaceAsignar, seleccionado)}
        filas={pagina.items}
        claveFila={(pedido) => pedido.pedidoId}
        sinDatos={
          <EstadoVacio
            icono="check"
            titulo="Ningún pedido esperando domiciliario"
            descripcion="Con estos filtros no queda ningún pedido sin asignar. Si esperabas ver pedidos, probá limpiar los filtros."
          />
        }
      />
    </Tarjeta>
  );
}
