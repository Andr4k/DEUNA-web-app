import { Icono } from "@/components/ui/Icono";

type Tono = "peligro" | "alerta" | "morado";

const TONOS: Record<Tono, { borde: string; texto: string; fondo: string }> = {
  peligro: {
    borde: "border-peligro",
    texto: "text-peligro",
    fondo: "bg-peligro/8",
  },
  alerta: {
    borde: "border-alerta",
    texto: "text-alerta",
    fondo: "bg-alerta/8",
  },
  morado: {
    borde: "border-morado",
    texto: "text-morado",
    fondo: "bg-morado/8",
  },
};

interface Props {
  tono: Tono;
  icono: string;
  titulo: string;
  valor: number;
  detalle: string;
  accion: string;
  /** A dónde lleva la acción. */
  href: string;
}

/**
 * Bloque de "lo que requiere atención ahora".
 *
 * El tono define borde, fondo y color de la acción a la vez: así un bloque no
 * puede quedar con el borde rojo y el botón amarillo.
 *
 * Se llama `BloqueAtencion` y no `Alerta` a propósito: "alerta" describía
 * cualquier aviso, y un mensaje de error en un formulario necesita otra cosa.
 * Con el nombre viejo, el primero que buscaba "mostrar un error" usaba este
 * componente y descubría que todos sus props eran obligatorios.
 */
export function BloqueAtencion({ tono, icono, titulo, valor, detalle, accion, href }: Props) {
  const t = TONOS[tono];

  return (
    <article className={`flex flex-col gap-1 rounded-tarjeta border bg-panel p-4 ${t.borde} ${t.fondo}`}>
      <div className="flex items-center gap-2.5">
        <Icono nombre={icono} tamano={22} className={t.texto} />
        <span className="text-xs font-bold tracking-[0.05em] text-texto-2 uppercase">{titulo}</span>
      </div>

      <span className={`text-[32px] leading-none font-bold ${t.texto}`}>{valor}</span>
      <span className="text-[13px] text-texto-2">{detalle}</span>

      <a
        href={href}
        className={`mt-3.5 inline-flex w-full items-center justify-between gap-2.5 rounded-control border border-current px-3.5 py-2.5 text-[13px] font-semibold transition-colors hover:bg-white/5 ${t.texto}`}
      >
        {accion}
        <Icono nombre="flecha" tamano={15} />
      </a>
    </article>
  );
}
