import type { ButtonHTMLAttributes } from "react";

type Variante = "primario" | "contorno" | "acento";

const VARIANTES: Record<Variante, string> = {
  primario: "border-acento bg-acento text-fondo hover:bg-acento-claro",
  contorno: "border-borde text-texto hover:bg-panel-hover",
  acento: "border-acento text-acento hover:bg-acento/10",
};

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: Variante;
  /** Ocupa el ancho disponible y separa el contenido de la flecha. */
  grande?: boolean;
}

export function Boton({
  variante = "contorno",
  grande = false,
  // El tipo por defecto va acá y no fijo en el `<button>`: puesto fijo, el
  // `{...resto}` lo pisaba igual, pero un `type="submit"` escrito antes de la
  // propagación es una trampa esperando al próximo que lo lea.
  type = "button",
  className = "",
  children,
  ...resto
}: Props) {
  return (
    <button
      type={type}
      className={`inline-flex items-center gap-2 rounded-control border font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
        grande ? "w-full justify-between px-5 py-4 text-[15px]" : "px-4 py-2.5 text-[13px]"
      } ${VARIANTES[variante]} ${className}`}
      {...resto}
    >
      {children}
    </button>
  );
}
