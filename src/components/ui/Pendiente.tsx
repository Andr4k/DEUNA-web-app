import { Tarjeta } from "@/components/ui/Tarjeta";

interface Props {
  titulo: string;
  /** Qué necesita del backend esta pantalla, para no dejarlo en un "próximamente". */
  necesita: string[];
}

/**
 * Pantalla todavía no construida.
 *
 * En lugar de un "en construcción" mudo, dice qué endpoints hacen falta: es la
 * lista de trabajo real de cada sección.
 */
export function Pendiente({ titulo, necesita }: Props) {
  return (
    <Tarjeta titulo={titulo}>
      <p className="text-[13px] text-texto-2">
        Esta pantalla todavía no está construida. Para armarla, el backend necesita exponer:
      </p>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-[13px] text-texto-2">
        {necesita.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </Tarjeta>
  );
}
