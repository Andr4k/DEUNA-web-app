import { EstadoVacio } from "@/components/ui/EstadoVacio";
import { Tarjeta } from "@/components/ui/Tarjeta";
import { nota } from "@/components/calificaciones/valoresCalificacion";
import { calificacion, fechaCorta } from "@/lib/formato";
import type { ResumenCalificacionesRestaurantes as Resumen } from "@/lib/tipos/calificaciones-restaurantes";

type Punto = Resumen["evolucion"][number];

/** El lienzo del gráfico. Se estira al ancho de la tarjeta con `preserveAspectRatio="none"`. */
const ANCHO = 300;
const ALTO = 90;
/** Aire arriba y abajo para que el trazo no toque el borde de la caja. */
const MARGEN = 8;

/**
 * El promedio global a lo largo del tiempo.
 *
 * Es una serie simple, como pide el brief: una línea y el último valor anotado. No es
 * un gráfico de librería porque no hace falta —son dos números y una polilínea— y traer
 * un paquete de gráficos para esto sería una dependencia más que mantener.
 *
 * El eje Y arranca en el mínimo de la serie y no en 0: con calificaciones entre 4,2 y
 * 4,8, un eje desde 0 convierte una semana en una línea recta y esconde justo lo que el
 * bloque viene a mostrar. Los valores del eje (mínimo y máximo) están anotados, así que
 * la escala se puede leer.
 *
 * Con menos de dos puntos no hay línea: un solo día se mostraría como un punto suelto
 * que no dice nada sobre una evolución.
 */
export async function EvolucionPromedio({ datos }: { datos: Promise<Resumen> }) {
  const { evolucion } = await datos;

  return (
    <Tarjeta titulo="Evolución del promedio">
      {evolucion.length < 2 ? (
        <EstadoVacio
          icono="reportes"
          titulo="Sin evolución que dibujar"
          descripcion="Hace falta más de un día con calificaciones en el rango para ver una tendencia."
        />
      ) : (
        <Serie puntos={evolucion} />
      )}
    </Tarjeta>
  );
}

function Serie({ puntos }: { puntos: Punto[] }) {
  const valores = puntos.map((punto) => punto.promedio);
  const maximo = Math.max(...valores);
  const minimo = Math.min(...valores);
  const ultimo = puntos[puntos.length - 1];
  const trazo = coordenadas(puntos, minimo, maximo);
  const fin = trazo[trazo.length - 1];
  const desde = fechaCorta(puntos[0].fecha);
  const hasta = fechaCorta(ultimo.fecha);
  const etiqueta = `Evolución del promedio entre ${desde} y ${hasta}, de ${calificacion(
    minimo,
  )} a ${calificacion(maximo)}, último ${nota(ultimo.promedio)}`;

  return (
    <div className="flex flex-col gap-2">
      <p className="m-0 text-[12px] text-texto-2">Máximo {calificacion(maximo)}</p>

      {/*
        El badge va en HTML sobre el SVG y no adentro: el gráfico se estira con
        `preserveAspectRatio="none"`, así que un `rect` o un `text` dentro del `viewBox`
        saldría deformado —achatado o estirado según el ancho de la tarjeta—. Acá se
        posiciona en porcentaje del cuadro, que con esa escala es exactamente el mismo
        punto, y el número se lee con la tipografía del portal.
      */}
      <div className="relative">
        <svg
          viewBox={`0 0 ${ANCHO} ${ALTO}`}
          preserveAspectRatio="none"
          className="h-24 w-full text-acento"
          role="img"
          aria-label={etiqueta}
        >
          <polyline
            points={trazo.map((punto) => `${punto.x.toFixed(1)},${punto.y.toFixed(1)}`).join(" ")}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        <span
          className="absolute rounded-[4px] bg-acento px-1.5 py-0.5 text-[11px] leading-none font-bold text-fondo"
          style={{
            left: `${(fin.x / ANCHO) * 100}%`,
            top: `${(fin.y / ALTO) * 100}%`,
            transform: "translate(calc(-100% - 5px), -50%)",
          }}
        >
          {nota(ultimo.promedio)}
        </span>
      </div>

      <div className="flex items-baseline justify-between text-[12px] text-texto-3">
        <span>{fechaCorta(puntos[0].fecha)}</span>
        <span>Mínimo {calificacion(minimo)}</span>
        <span>{fechaCorta(ultimo.fecha)}</span>
      </div>
    </div>
  );
}

/**
 * Los puntos del gráfico, en el sistema de coordenadas del `viewBox`.
 *
 * Una serie plana —todos los días con el mismo promedio— no se puede escalar por rango
 * (dividiría por cero), así que se dibuja al medio: una línea recta que es exactamente
 * lo que pasó. Devuelve números y no el texto del `points` porque el badge del último
 * valor necesita la misma coordenada para posicionarse: calcularla dos veces es la forma
 * segura de que un día la línea y el badge no coincidan.
 */
function coordenadas(
  puntos: Punto[],
  minimo: number,
  maximo: number,
): { x: number; y: number }[] {
  const rango = maximo - minimo;
  const altura = ALTO - MARGEN * 2;
  const paso = ANCHO / (puntos.length - 1);

  return puntos.map((punto, indice) => ({
    x: indice * paso,
    y: rango === 0 ? MARGEN + altura / 2 : MARGEN + ((maximo - punto.promedio) / rango) * altura,
  }));
}
