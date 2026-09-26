import { BarraApilada } from "@/components/calificaciones/BarraApilada";
import {
  AspectosDeRestaurante,
  BarraPromedio,
  CeldaSinDato,
} from "@/components/calificaciones/celdasCalificacion";
import { SIN_DATO, notaConEstrella } from "@/components/calificaciones/valoresCalificacion";
import type { Columna } from "@/components/ui/Tabla";
import { Tendencia } from "@/components/ui/Tendencia";
import { numero } from "@/lib/formato";
import type { CalificacionDeRestaurante } from "@/lib/tipos/calificaciones-restaurantes";

/**
 * Las nueve columnas de la tabla de restaurantes, en el orden del brief.
 *
 * Están partidas en tres bloques —el quién, las notas y el desempeño— porque las nueve
 * juntas no entran en el límite de líneas por función, y porque cada bloque responde una
 * pregunta distinta del operador. El orden de la concatenación ES el orden de la tabla:
 * leer de arriba abajo es leer de izquierda a derecha.
 *
 * Vive en su propio archivo y no dentro de la lista: la lista compone, las columnas definen
 * qué se ve. Las celdas que dibujan algo más que texto —la barra del promedio y los
 * puntajes por criterio— viven en `celdasCalificacion.tsx`.
 *
 * Las tres columnas del contrato que pueden venir en `null` —el tipo de comida, la tendencia
 * y las incidencias— dicen "Sin dato" y no un cero: hoy los tres campos llegan vacíos porque
 * no tienen fuente, y un cero sería una afirmación falsa sobre el restaurante. Las tres usan
 * el texto de `valoresCalificacion.ts` para que "Sin dato" se escriba igual en toda la
 * pantalla.
 */
export function columnasCalificacionesRestaurantes(): Columna<CalificacionDeRestaurante>[] {
  return [...delRestaurante(), ...deLasCalificaciones(), ...delDesempeno()];
}

/** Quién es: el restaurante, dónde está y qué cocina. */
function delRestaurante(): Columna<CalificacionDeRestaurante>[] {
  return [
    {
      clave: "restaurante",
      titulo: "Restaurante",
      render: (r) => (
        <span className="font-semibold" title={r.nombre}>
          {r.nombre}
        </span>
      ),
    },
    {
      clave: "zona",
      titulo: "Zona",
      render: (r) => r.zona,
    },
    {
      clave: "tipoDeComida",
      titulo: "Tipo de comida",
      render: (r) =>
        r.tipoDeComida === null ? <CeldaSinDato>{SIN_DATO}</CeldaSinDato> : r.tipoDeComida,
    },
  ];
}

/** Cómo lo calificaron: la nota, sobre cuántas, cómo se reparten y por criterio. */
function deLasCalificaciones(): Columna<CalificacionDeRestaurante>[] {
  return [
    {
      clave: "calificacion",
      titulo: "Calificación",
      render: (r) => (
        <div className="flex min-w-24 flex-col gap-1">
          <span className="font-semibold">{notaConEstrella(r.calificacionPromedio)}</span>
          <BarraPromedio valor={r.calificacionPromedio} />
        </div>
      ),
    },
    {
      clave: "totalCalificaciones",
      titulo: "Calificaciones",
      numerica: true,
      render: (r) => <span className="tabular-nums">{numero(r.totalCalificaciones)}</span>,
    },
    {
      clave: "distribucion",
      titulo: "Distribución",
      render: (r) => (
        <div className="flex min-w-28 flex-col gap-1 text-[12px] text-texto-3">
          <BarraApilada distribucion={r.distribucion} />
          <span className="tabular-nums">
            5★ {numero(r.distribucion.cinco)} · 1★ {numero(r.distribucion.una)}
          </span>
        </div>
      ),
    },
    {
      clave: "aspectos",
      titulo: "Aspectos destacados",
      render: (r) => <AspectosDeRestaurante aspectos={r.aspectos} />,
    },
  ];
}

/** Con qué quedó: si va mejorando o empeorando, y cuántas incidencias tiene. */
function delDesempeno(): Columna<CalificacionDeRestaurante>[] {
  return [
    {
      clave: "tendencia",
      titulo: "Tendencia",
      /*
       * El contrato la manda contra el período anterior y sin base viene en `null`: ahí va
       * "Sin dato" y no un "0%", que se leería como una tendencia plana.
       */
      render: (r) =>
        r.tendencia.variacion === null ? (
          <CeldaSinDato>{SIN_DATO}</CeldaSinDato>
        ) : (
          <Tendencia valor={r.tendencia.variacion} etiqueta="vs. anterior" porcentaje />
        ),
    },
    {
      clave: "incidencias",
      titulo: "Incidencias",
      /*
       * Todavía no existe el modelo de incidencias, así que la columna llega en `null` y
       * dice "Sin dato". No se oculta: el día que el dato exista, el número aparece en el
       * mismo lugar donde hoy se lee que falta.
       */
      render: (r) =>
        r.incidencias === null ? (
          <CeldaSinDato>{SIN_DATO}</CeldaSinDato>
        ) : (
          <span className="tabular-nums">{numero(r.incidencias)}</span>
        ),
    },
  ];
}
