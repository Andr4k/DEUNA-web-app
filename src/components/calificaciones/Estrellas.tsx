import { Icono } from "@/components/ui/Icono";

interface Props {
  /** La nota, de 0 a 5. */
  valor: number;
  /** Lado de cada estrella en píxeles: 12 en los bloques, 10 en el top. */
  tamano?: number;
}

/**
 * Una nota dibujada en estrellas, con media estrella cuando pasa de la mitad.
 *
 * Las cinco estrellas se pintan siempre —llenas, medias o vacías—, así dos filas con
 * notas distintas se comparan por cuántas están encendidas y no por cuántos iconos
 * tiene cada una. La media y la vacía se distinguen por opacidad, que es lo que hace
 * el diseño, y no por un trazado distinto: es la misma estrella rellena del set.
 *
 * Va `aria-hidden` porque el número que la acompaña al lado es el que se anuncia: en
 * voz alta, "cuatro coma seis" se entiende y cinco estrellas opacas no.
 */
export function Estrellas({ valor, tamano = 12 }: Props) {
  const llenas = Math.floor(valor);
  const media = valor - llenas >= 0.4;

  return (
    <span className="flex items-center gap-px text-alerta" aria-hidden="true">
      {[0, 1, 2, 3, 4].map((indice) => (
        <Icono
          key={indice}
          nombre="estrella"
          tamano={tamano}
          className={opacidad(indice, llenas, media)}
        />
      ))}
    </span>
  );
}

/** Cuánto de cada estrella está encendida: entera, media o apagada. */
function opacidad(indice: number, llenas: number, media: boolean): string {
  if (indice < llenas) return "opacity-100";
  if (indice === llenas && media) return "opacity-[0.45]";
  return "opacity-[0.18]";
}