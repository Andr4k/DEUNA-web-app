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
 * Es una serie simple, como pide el brief: una línea y los dos extremos anotados. No es
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

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between text-[12px] text-texto-2">
        <span>Máximo {calificacion(maximo)}</span>
        <span>Último {nota(ultimo.promedio)}</span>
      </div>

      <svg
        viewBox={`0 0 ${ANCHO} ${ALTO}`}
        preserveAspectRatio="none"
        className="h-24 w-full text-acento"
        role="img"
        aria-label={`Evolución del promedio entre ${fechaCorta(puntos[0].fecha)} y ${fechaCorta(ultimo.fecha)}, de ${calificacion(minimo)} a ${calificacion(maximo)}`}
      >
        <polyline
          points={coordenadas(puntos, minimo, maximo).join(" ")}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

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
 * lo que pasó.
 */
function coordenadas(puntos: Punto[], minimo: number, maximo: number): string[] {
  const rango = maximo - minimo;
  const altura = ALTO - MARGEN * 2;
  const paso = ANCHO / (puntos.length - 1);

  return puntos.map((punto, indice) => {
    const x = indice * paso;
    const y = rango === 0 ? MARGEN + altura / 2 : MARGEN + ((maximo - punto.promedio) / rango) * altura;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
}
