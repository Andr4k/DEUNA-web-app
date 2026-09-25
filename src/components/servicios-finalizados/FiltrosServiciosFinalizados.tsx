"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

import { BarraFiltros, type Filtro } from "@/components/ui/BarraFiltros";

/**
 * Filtros del historial de servicios finalizados.
 *
 * Los filtros viven en la URL, como en la pantalla de Pedidos: `BarraFiltros` escribe el
 * parámetro y el servidor vuelve a resolver la pantalla con él aplicado, así el enlace es
 * compartible y el botón "atrás" funciona. Por eso "Limpiar filtros" es un enlace a la
 * ruta pelada y no un botón.
 *
 * El buscador y el select de calificación se delegan a `BarraFiltros`; las fechas y la
 * zona se escriben acá con la misma clase de campo, porque `BarraFiltros` solo sabe de
 * selects y de un buscador.
 *
 * NO hay filtro de restaurante ni de domiciliario, aunque el brief los pedía: el contrato
 * los tiene como `restauranteId` y `repartidorId` (identificadores) y el portal no tiene
 * el endpoint que liste esos catálogos. Un campo para pegar un GUID no es una interfaz
 * —lo dice el comentario del propio contrato—, así que el día que exista el desplegable
 * se agrega acá y el servicio ya los manda.
 *
 * Tampoco hay botón "Buscar": con los filtros en la URL cada control aplica al cambiar,
 * que es lo que ya hace la pantalla de Pedidos. Un botón pediría un formulario y un estado
 * que sobreviva al envío para hacer lo que el cambio de URL ya hace.
 */
const CALIFICACIONES: Filtro[] = [
  {
    clave: "calificacionMin",
    etiqueta: "Calificación mínima",
    valorInicial: "",
    opciones: [
      { valor: "", etiqueta: "Cualquier calificación" },
      { valor: "4", etiqueta: "4★ o más" },
      { valor: "3", etiqueta: "3★ o más" },
      { valor: "2", etiqueta: "2★ o más" },
    ],
  },
];

/** La misma clase de campo de `BarraFiltros`, para que la fila se vea de una pieza. */
const CAMPO =
  "h-9 rounded-control border border-borde bg-panel px-3 text-[13px] text-texto outline-none placeholder:text-texto-3 focus:border-acento";

/** Escribe un parámetro en la URL (vacío = lo borra) y vuelve a la página 1. */
type Aplicar = (clave: string, valor: string) => void;

export function FiltrosServiciosFinalizados() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [pendiente, iniciar] = useTransition();

  function aplicar(clave: string, valor: string) {
    const siguientes = new URLSearchParams(params.toString());
    if (valor) {
      siguientes.set(clave, valor);
    } else {
      siguientes.delete(clave);
    }
    siguientes.delete("pagina");

    iniciar(() => router.push(`${pathname}?${siguientes.toString()}`));
  }

  return (
    <div
      className={`flex flex-wrap items-center gap-2 ${pendiente ? "opacity-60" : ""}`}
      aria-busy={pendiente}
    >
      <div className="flex min-w-64 flex-1 items-center">
        <BarraFiltros
          filtros={CALIFICACIONES}
          placeholderBusqueda="Pedido, cliente o dirección…"
          claveBusqueda="buscar"
        />
      </div>

      <CampoFecha clave="desde" etiqueta="Desde" valor={params.get("desde")} aplicar={aplicar} />
      <CampoFecha clave="hasta" etiqueta="Hasta" valor={params.get("hasta")} aplicar={aplicar} />
      <CampoZona valor={params.get("zona")} aplicar={aplicar} />

      <Link
        href="/servicios-finalizados"
        className="inline-flex items-center gap-2 rounded-control border border-borde px-4 py-2.5 text-[13px] font-semibold text-texto transition-colors hover:bg-panel-hover"
      >
        Limpiar filtros
      </Link>
    </div>
  );
}

interface PropsCampo {
  /** Valor que ya está en la URL; `null` cuando el parámetro no está. */
  valor: string | null;
  aplicar: Aplicar;
}

/** Una fecha del rango. El día se manda como `YYYY-MM-DD`; el servicio lo traduce. */
function CampoFecha({
  clave,
  etiqueta,
  valor,
  aplicar,
}: PropsCampo & { clave: string; etiqueta: string }) {
  return (
    <label className="flex items-center gap-2">
      <span className="sr-only">{etiqueta}</span>
      <input
        type="date"
        value={valor ?? ""}
        onChange={(evento) => aplicar(clave, evento.target.value)}
        className={CAMPO}
      />
    </label>
  );
}

/**
 * La zona, como texto.
 *
 * El portal no tiene el catálogo de zonas: el listado de `metrics/zonas` es actividad del
 * día, no la cobertura contratada. Un desplegable con zonas escritas a mano sería una
 * lista de datos inventados que se desactualiza sola, y el backend filtra por texto igual.
 */
function CampoZona({ valor, aplicar }: PropsCampo) {
  return (
    <input
      type="search"
      defaultValue={valor ?? ""}
      onChange={(evento) => aplicar("zona", evento.target.value)}
      placeholder="Zona"
      aria-label="Zona"
      className={`${CAMPO} w-40`}
    />
  );
}
