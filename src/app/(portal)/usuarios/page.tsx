import { Suspense } from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { FiltrosUsuarios } from "@/components/usuarios/FiltrosUsuarios";
import { ListaUsuarios } from "@/components/usuarios/ListaUsuarios";
import { ResumenUsuarios } from "@/components/usuarios/ResumenUsuarios";
import { EncabezadoSeccion } from "@/components/ui/EncabezadoSeccion";
import { EsqueletoTarjeta } from "@/components/ui/Esqueleto";
import { obtenerToken } from "@/lib/sesion-servidor";
import {
  ESTADOS_USUARIO,
  TIPOS_USUARIO,
  type EstadoUsuario,
  type FiltrosUsuarios as Filtros,
  type TipoUsuario,
} from "@/lib/tipos/usuarios";
import { usuariosService } from "@/services/usuarios.service";

export const metadata: Metadata = { title: "Usuarios" };

type Parametros = Record<string, string | string[] | undefined>;

/** Diez por página: el tamaño con el que se midió la tabla. */
const POR_PAGINA = 10;

/**
 * Gestión de usuarios: los indicadores, la barra de filtros y el listado.
 *
 * La petición arranca acá y **no se espera**: la misma promesa se pasa a las dos secciones
 * y cada una la resuelve dentro de su propio límite de Suspense. Son una sola consulta a
 * propósito —el endpoint devuelve las filas y los desgloses del mismo conjunto—, así el
 * número de arriba no puede discrepar de la lista de abajo.
 *
 * El Panel de Permisos que el diseño tiene a la derecha NO está, y no es un olvido:
 * necesita un endpoint de permisos por usuario que todavía no existe en ningún servicio.
 * Un panel con casillas sin fuente afirmaría permisos que nadie puede leer.
 *
 * No hay ruta proxy en `app/api/`: el token vive en una cookie `httpOnly` y los servicios
 * son `server-only`, así que el acceso a datos pasa por este componente de servidor y los
 * componentes reciben la promesa, no el token.
 */
export default async function PaginaUsuarios({
  searchParams,
}: {
  searchParams: Promise<Parametros>;
}) {
  const token = await obtenerToken();

  if (!token) {
    redirect("/login");
  }

  const params = await searchParams;

  // El tipo y el estado se validan contra el catálogo del contrato antes de mandarlos: un
  // valor que no es del catálogo no se aplica —el backend devolvería un 400 por un filtro
  // que el operador no puede haber elegido en la barra— y la pantalla muestra el listado
  // sin ese filtro.
  const filtros: Filtros = {
    buscar: texto(params.buscar),
    tipo: tipoValido(texto(params.tipo)),
    estado: estadoValido(texto(params.estado)),
    pagina: numero(params.pagina) ?? 1,
    tamano: POR_PAGINA,
  };

  const datos = usuariosService.listado(filtros, token);

  // Los filtros tal como quedaron aplicados, y no como vienen en la URL, para reconstruir
  // el enlace de página sin perderlos: si un `tipo` fuera del catálogo viajara al enlace,
  // la barra de direcciones mostraría un filtro que no se está aplicando.
  const actuales = {
    buscar: filtros.buscar,
    tipo: filtros.tipo,
    estado: filtros.estado,
    pagina: texto(params.pagina),
  };

  return (
    <>
      <EncabezadoSeccion titulo="Usuarios" />

      <Suspense fallback={<FilaKpi />}>
        <ResumenUsuarios datos={datos} />
      </Suspense>

      <FiltrosUsuarios />

      <Suspense fallback={<EsqueletoTarjeta lineas={8} />}>
        <ListaUsuarios
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

  return `/usuarios?${params.toString()}`;
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

/** El tipo se valida contra el catálogo del contrato antes de mandarlo. */
function tipoValido(valor: string | undefined): TipoUsuario | undefined {
  return TIPOS_USUARIO.find((candidato) => candidato === valor);
}

/** El estado, igual: solo los del catálogo llegan al endpoint. */
function estadoValido(valor: string | undefined): EstadoUsuario | undefined {
  return ESTADOS_USUARIO.find((candidato) => candidato === valor);
}
