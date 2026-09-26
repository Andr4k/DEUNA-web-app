"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

import { BarraFiltros, type Filtro } from "@/components/ui/BarraFiltros";

/**
 * Filtros de la pantalla de calificaciones a restaurantes.
 *
 * Los filtros viven en la URL, como en Servicios finalizados y en Pedidos: `BarraFiltros`
 * escribe el parámetro y el servidor vuelve a resolver la pantalla con él aplicado, así el
 * enlace es compartible y el botón "atrás" funciona. Por eso "Limpiar filtros" es un enlace
 * a la ruta pelada y no un botón.
 *
 * La calificación se filtra por RANGO, así que son dos selects —"desde" y "hasta"—: el
 * operador busca "los que están entre 3 y 4", y un rango admite los dos extremos por
 * separado sin obligarlo a elegir entre ellos. El servicio los manda como
 * `calificacionMin` y `calificacionMax`.
 *
 * La zona y el tipo de comida son texto escrito a mano, no un desplegable: el portal no
 * tiene ninguno de los dos catálogos, y una lista de valores escrita acá sería una lista de
 * datos inventados que se desactualiza sola. El backend filtra por texto igual. El tipo de
 * comida además todavía no tiene fuente y las filas lo traen en `null`, pero el filtro se
 * manda cuando el operador lo escribe: el contrato lo acepta y el día que exista la fuente
 * no hay que tocar esto.
 *
 * Tampoco hay botón "Buscar": con los filtros en la URL cada control aplica al cambiar, que
 * es lo que ya hace el resto del portal. Un botón pediría un formulario y un estado que
 * sobreviva al envío para hacer lo que el cambio de URL ya hace.
 */
const RANGO: Filtro[] = [
  {
    clave: "calificacionMin",
    etiqueta: "Calificación mínima",
    valorInicial: "",
    opciones: [
      { valor: "", etiqueta: "Desde cualquier nota" },
      { valor: "5", etiqueta: "5★ o más" },
      { valor: "4", etiqueta: "4★ o más" },
      { valor: "3", etiqueta: "3★ o más" },
      { valor: "2", etiqueta: "2★ o más" },
      { valor: "1", etiqueta: "1★ o más" },
    ],
  },
  {
    clave: "calificacionMax",
    etiqueta: "Calificación máxima",
    valorInicial: "",
    opciones: [
      { valor: "", etiqueta: "Hasta cualquier nota" },
      { valor: "5", etiqueta: "5★ o menos" },
      { valor: "4", etiqueta: "4★ o menos" },
      { valor: "3", etiqueta: "3★ o menos" },
      { valor: "2", etiqueta: "2★ o menos" },
      { valor: "1", etiqueta: "1★ o menos" },
    ],
  },
];

/** La misma clase de campo de `BarraFiltros`, para que la fila se vea de una pieza. */
const CAMPO =
  "h-9 rounded-control border border-borde bg-panel px-3 text-[13px] text-texto outline-none placeholder:text-texto-3 focus:border-acento";

/** Escribe un parámetro en la URL (vacío = lo borra) y vuelve a la página 1. */
type Aplicar = (clave: string, valor: string) => void;

export function FiltrosCalificaciones() {
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
          filtros={RANGO}
          placeholderBusqueda="Restaurante…"
          claveBusqueda="buscar"
        />
      </div>

      <CampoTexto clave="zona" etiqueta="Zona" valor={params.get("zona")} aplicar={aplicar} />
      <CampoTexto
        clave="tipoDeComida"
        etiqueta="Tipo de comida"
        valor={params.get("tipoDeComida")}
        aplicar={aplicar}
      />

      <Link
        href="/calificaciones"
        className="inline-flex items-center gap-2 rounded-control border border-borde px-4 py-2.5 text-[13px] font-semibold text-texto transition-colors hover:bg-panel-hover"
      >
        Limpiar filtros
      </Link>
    </div>
  );
}

interface PropsCampo {
  /** Nombre del parámetro en la URL, que es también lo que el campo muestra como ayuda. */
  clave: string;
  /** Valor que ya está en la URL; `null` cuando el parámetro no está. */
  valor: string | null;
  aplicar: Aplicar;
}

/**
 * Un filtro de texto libre.
 *
 * La etiqueta es la del campo y se usa como `aria-label`, porque la fila no tiene lugar
 * para un rótulo visible sin desalinearse del resto de los controles.
 */
function CampoTexto({ clave, etiqueta, valor, aplicar }: PropsCampo & { etiqueta: string }) {
  return (
    <input
      type="search"
      defaultValue={valor ?? ""}
      onChange={(evento) => aplicar(clave, evento.target.value)}
      placeholder={etiqueta}
      aria-label={etiqueta}
      className={`${CAMPO} w-40`}
    />
  );
}
