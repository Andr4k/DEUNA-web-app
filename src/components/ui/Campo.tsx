import type { InputHTMLAttributes } from "react";

interface Props extends Omit<InputHTMLAttributes<HTMLInputElement>, "id" | "name"> {
  nombre: string;
  etiqueta: string;
}

/**
 * Campo de formulario con su etiqueta.
 *
 * La etiqueta se asocia por `id` (no se envuelve el input): así el clic en el
 * texto enfoca el campo y los lectores de pantalla lo anuncian bien. Es el
 * detalle que se pierde cuando cada formulario escribe su propio `<input>`.
 */
export function Campo({ nombre, etiqueta, className = "", ...resto }: Props) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={nombre} className="text-[13px] font-medium text-texto-2">
        {etiqueta}
      </label>
      <input
        id={nombre}
        name={nombre}
        className={`h-10 rounded-control border border-borde bg-fondo px-3 text-sm text-texto outline-none transition-colors placeholder:text-texto-3 focus:border-acento disabled:opacity-60 ${className}`}
        {...resto}
      />
    </div>
  );
}
