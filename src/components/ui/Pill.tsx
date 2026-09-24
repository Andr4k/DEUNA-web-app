import type { ReactNode } from "react";

import { Icono } from "@/components/ui/Icono";
import type { EstadoPedido } from "@/lib/tipos";

type Variante = "en-curso" | "pendiente" | "entregado" | "incidencia" | "neutro";

const VARIANTES: Record<Variante, string> = {
  "en-curso": "border-info/30 bg-info/15 text-info",
  pendiente: "border-alerta/30 bg-alerta/15 text-alerta",
  entregado: "border-exito/30 bg-exito/15 text-exito",
  incidencia: "border-peligro/30 bg-peligro/15 text-peligro",
  neutro: "border-texto-3/30 bg-texto-3/15 text-texto-2",
};

interface Props {
  variante?: Variante;
  /** Muestra el punto de color a la izquierda del texto. */
  conPunto?: boolean;
  children: ReactNode;
}

export function Pill({ variante = "neutro", conPunto = false, children }: Props) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold whitespace-nowrap ${VARIANTES[variante]}`}
    >
      {conPunto ? <span className="size-1.5 rounded-full bg-current" /> : null}
      {children}
    </span>
  );
}

/* --------------------------------------------------------------------------
   Estado de un pedido.

   El backend devuelve los estados canónicos (`Buscando`, `ConfirmadoEnLocal`,
   ...). Acá se traducen al lenguaje del operador y se les asigna color. Es el
   ÚNICO lugar donde se hace ese mapeo: si cambia un estado en el backend, se
   toca acá y el compilador avisa porque el Record es exhaustivo.
   -------------------------------------------------------------------------- */

const PRESENTACION: Record<EstadoPedido, { etiqueta: string; variante: Variante }> = {
  Buscando: { etiqueta: "Sin asignar", variante: "pendiente" },
  Asignado: { etiqueta: "Asignado", variante: "en-curso" },
  ConfirmadoEnLocal: { etiqueta: "En el local", variante: "en-curso" },
  EnRuta: { etiqueta: "En ruta", variante: "en-curso" },
  Entregado: { etiqueta: "Entregado", variante: "entregado" },
  Cancelado: { etiqueta: "Cancelado", variante: "neutro" },
};

export function PillEstadoPedido({ estado }: { estado: EstadoPedido }) {
  const { etiqueta, variante } = PRESENTACION[estado];
  return (
    <Pill variante={variante} conPunto>
      {etiqueta}
    </Pill>
  );
}

/** Variante suelta para usos que no son un estado de pedido (p. ej. incidencias). */
export function PillIncidencia() {
  return (
    <Pill variante="incidencia" conPunto>
      Incidencia
    </Pill>
  );
}

/** Icono del estado, para las listas que lo muestran junto al texto. */
export function iconoDeEstado(estado: EstadoPedido) {
  switch (estado) {
    case "Entregado":
      return <Icono nombre="check" tamano={15} className="text-exito" />;
    case "Cancelado":
      return <Icono nombre="alerta" tamano={15} className="text-texto-3" />;
    case "Buscando":
      return <Icono nombre="pedidos" tamano={15} className="text-alerta" />;
    default:
      return <Icono nombre="moto" tamano={15} className="text-info" />;
  }
}
