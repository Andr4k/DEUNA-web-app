import { Suspense } from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { FiltrosPedidos } from "@/components/pedidos/FiltrosPedidos";
import { ListaPedidos } from "@/components/pedidos/ListaPedidos";
import { RecuadroMapa } from "@/components/pedidos/RecuadroMapa";
import { ResumenPedidos } from "@/components/pedidos/ResumenPedidos";
import { EncabezadoSeccion } from "@/components/ui/EncabezadoSeccion";
import { EsqueletoTarjeta } from "@/components/ui/Esqueleto";
import { obtenerToken } from "@/lib/sesion-servidor";
import type { FiltrosPedidos as Filtros, PrioridadPedido } from "@/lib/tipos/pedido";
import { entregasService } from "@/services/entregas.service";
import { motivoDeError } from "@/services/http";
import { pedidosService } from "@/services/pedidos.service";

export const metadata: Metadata = { title: "Pedidos" };

type Parametros = Record<string, string | string[] | undefined>;

const PRIORIDADES: readonly PrioridadPedido[] = ["Alta", "Media", "Baja"];

/**
 * Pedidos sin asignar: la cola de trabajo del administrador.
 *
 * Las dos llamadas arrancan acá y **no se esperan**: cada sección recibe la promesa
 * y la resuelve dentro de su propio límite de Suspense. Los pedidos se piden una
 * sola vez y se pasan a dos secciones —la franja de indicadores y la tabla—: Next
 * memoriza el `fetch` idéntico dentro del mismo render, así que es una petición,
 * no dos.
 *
 * Los candidatos solo se piden si hay un pedido elegido (`?asignar=<id>`): la
 * elección vive en la URL, igual que los filtros, para que el servidor resuelva la
 * pantalla completa y la selección se pueda compartir o deshacer con el botón
 * "atrás".
 */
export default async function PaginaPedidos({
  searchParams,
}: {
  searchParams: Promise<Parametros>;
}) {
  const token = await obtenerToken();

  if (!token) {
    redirect("/login");
  }

  const { zona, prioridad, esperaMin, pagina, asignar } = await searchParams;
  const seleccionado = texto(asignar);

  const filtros: Filtros = {
    zona: texto(zona),
    prioridad: prioridadValida(texto(prioridad)),
    esperaMin: numero(esperaMin),
    pagina: numero(pagina) ?? 1,
  };

  const pedidos = pedidosService.sinAsignar(filtros, token);
  const candidatos = seleccionado
    ? entregasService.candidatos(seleccionado, token).then(
        (datos) => ({ ok: true as const, datos }),
        (error) => ({ ok: false as const, motivo: motivoDeError(error) }),
      )
    : null;

  // Los filtros tal como están en la URL, para reconstruir enlaces sin perderlos.
  const actuales = {
    zona: texto(zona),
    prioridad: texto(prioridad),
    esperaMin: texto(esperaMin),
    pagina: texto(pagina),
  };

  return (
    <>
      <EncabezadoSeccion titulo="Pedidos sin asignar" />

      <Suspense fallback={<FilaKpi />}>
        <ResumenPedidos datos={pedidos} />
      </Suspense>

      <FiltrosPedidos />

      <div className="grid gap-4 xl:grid-cols-2">
        <Suspense fallback={<EsqueletoTarjeta lineas={8} />}>
          <ListaPedidos
            datos={pedidos}
            seleccionado={seleccionado}
            enlaceAsignar={(pedidoId) => enlace(actuales, { asignar: pedidoId })}
            enlacePagina={(destino) =>
              enlace(actuales, {
                // Cambiar de página suelta la selección: el pedido elegido puede no
                // estar en la página nueva, y un panel de candidatos de un pedido que
                // no se ve en la tabla confunde más de lo que ayuda.
                asignar: undefined,
                pagina: destino > 1 ? String(destino) : undefined,
              })
            }
          />
        </Suspense>

        <RecuadroMapa candidatos={candidatos} />
      </div>
    </>
  );
}

/** Esqueleto con la forma de la franja de indicadores, para el primer pintado. */
function FilaKpi() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }, (_, indice) => (
        <EsqueletoTarjeta key={indice} lineas={2} />
      ))}
    </div>
  );
}

/**
 * Reconstruye la URL de la pantalla cambiando solo lo que se pide.
 *
 * Un valor vacío borra el parámetro: así "Limpiar filtros" y "soltar la selección"
 * son lo mismo —dejar de mandarlo— y no hace falta una lista de parámetros válidos.
 */
function enlace(
  actuales: Record<string, string | undefined>,
  cambios: Record<string, string | undefined>,
): string {
  const params = new URLSearchParams();

  for (const [clave, valor] of Object.entries({ ...actuales, ...cambios })) {
    if (valor) params.set(clave, valor);
  }

  return `/pedidos?${params.toString()}`;
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

/** La prioridad se valida contra los valores del backend antes de mandarla. */
function prioridadValida(valor: string | undefined): PrioridadPedido | undefined {
  return PRIORIDADES.find((candidata) => candidata === valor);
}
