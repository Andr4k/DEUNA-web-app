import { zonasDe } from "@/components/usuarios/valoresUsuario";
import { Pill } from "@/components/ui/Pill";
import type { EstadoUsuario } from "@/lib/tipos/usuarios";

/**
 * Las celdas de la tabla que dibujan algo más que un texto.
 *
 * Viven aparte de las columnas —como en Calificaciones— porque las columnas definen qué
 * se ve y estas, cómo se dibuja: el pill del estado, la celda de zonas y la del dato que
 * falta son los tres bloques de la fila que tienen una regla adentro.
 */

/**
 * Un valor que el contrato manda en `null`.
 *
 * Va en gris y con el texto de `valoresUsuario.ts` para que "Sin dato" se escriba igual
 * en toda la pantalla: es lo que distingue "no lo sabemos" —que es el dato que hay— de
 * un cero, que afirmaría que no hay ninguno.
 */
export function CeldaSinDato({ children }: { children: string }) {
  return <span className="text-[12px] text-texto-3">{children}</span>;
}

/**
 * Las zonas asignadas.
 *
 * El texto se corta en la celda y viaja entero en el `title`: un domiciliario puede
 * tener varias zonas y la fila no puede crecer a lo alto por eso.
 */
export function CeldaZonas({ zonas }: { zonas: string[] | null }) {
  const texto = zonasDe(zonas);

  if (zonas === null || zonas.length === 0) {
    return <CeldaSinDato>{texto}</CeldaSinDato>;
  }

  return (
    <span className="block max-w-56 truncate text-[12px] text-texto-2" title={texto}>
      {texto}
    </span>
  );
}

/**
 * El estado de la cuenta, con su color.
 *
 * Es el ÚNICO lugar donde se traduce el estado a un pill: si cambia el catálogo en el
 * backend, se toca acá y el compilador avisa porque el `Record` es exhaustivo. El texto
 * es el del backend tal cual —"Activo", "Suspendido" e "Inactivo" ya son lenguaje del
 * operador— y por eso no hay un segundo mapa de etiquetas que pueda desincronizarse.
 *
 * Las variantes son las genéricas de `Pill` (el color), no una afirmación sobre
 * pedidos: la cuenta activa va en verde y la suspendida en rojo como cualquier estado
 * bueno o malo del portal.
 */
const ESTADO: Record<
  EstadoUsuario,
  { etiqueta: string; variante: "entregado" | "incidencia" | "neutro" }
> = {
  Activo: { etiqueta: "Activo", variante: "entregado" },
  Suspendido: { etiqueta: "Suspendido", variante: "incidencia" },
  Inactivo: { etiqueta: "Inactivo", variante: "neutro" },
};

export function PillEstadoUsuario({ estado }: { estado: EstadoUsuario }) {
  const { etiqueta, variante } = ESTADO[estado];

  return (
    <Pill variante={variante} conPunto>
      {etiqueta}
    </Pill>
  );
}
