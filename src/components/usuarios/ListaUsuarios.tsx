import { columnasUsuarios } from "@/components/usuarios/columnasUsuarios";
import { EstadoVacio } from "@/components/ui/EstadoVacio";
import { Paginacion } from "@/components/ui/Paginacion";
import { Tabla } from "@/components/ui/Tabla";
import { Tarjeta } from "@/components/ui/Tarjeta";
import type { RespuestaUsuarios } from "@/lib/tipos/usuarios";

interface Props {
  datos: Promise<RespuestaUsuarios>;
  /** Arma el enlace de una página conservando los filtros activos. */
  enlacePagina: (pagina: number) => string;
}

/**
 * Tabla del listado de usuarios.
 *
 * Es la sección que espera la promesa: la recibe y la resuelve acá adentro, así la
 * pantalla no frena mientras llegan los datos. La paginación vive en esta tarjeta y no en
 * la página porque `totalPaginas` sale del `total` del endpoint, y ese número solo existe
 * después de esperar — que la página, por la regla del servidor primero, no espera.
 *
 * La tabla va `compacta`: seis columnas con celdas de dos líneas (el nombre con su email,
 * las zonas, la fecha con su hora) se vuelven ilegibles con el aire de la tabla normal
 * antes de que haga falta desplazarla.
 */
export async function ListaUsuarios({ datos, enlacePagina }: Props) {
  const { pagina } = await datos;
  const tamano = pagina.tamano > 0 ? pagina.tamano : 1;
  const totalPaginas = Math.max(1, Math.ceil(pagina.total / tamano));

  return (
    <Tarjeta
      titulo="Usuarios"
      pie={
        totalPaginas > 1 ? (
          <Paginacion pagina={pagina.pagina} totalPaginas={totalPaginas} href={enlacePagina} />
        ) : undefined
      }
    >
      <Tabla
        compacta
        columnas={columnasUsuarios()}
        filas={pagina.items}
        claveFila={(usuario) => usuario.id}
        sinDatos={
          <EstadoVacio
            icono="usuario"
            titulo="Ningún usuario"
            descripcion="Con estos filtros no hay cuentas. Si esperabas ver alguna, probá borrar la búsqueda o limpiar los filtros."
          />
        }
      />
    </Tarjeta>
  );
}
