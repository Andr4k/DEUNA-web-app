import { EsqueletoTarjeta } from "@/components/ui/Esqueleto";

/**
 * Carga del panel.
 *
 * Se muestra al navegar a una ruta del portal, mientras el servidor resuelve la
 * página. Es distinto de los `Suspense` de la página: esos son por sección, este es
 * de la pantalla entera.
 *
 * El esqueleto tiene la forma del contenido —barra lateral, fila de indicadores,
 * tarjetas— para que el salto al llegar los datos sea mínimo. Un spinner centrado
 * obliga a reacomodar la vista.
 */
export default function CargandoPanel() {
  return (
    <>
      <div className="grid gap-4 xl:grid-cols-[repeat(4,1fr)_1.3fr]">
        {Array.from({ length: 5 }, (_, indice) => (
          <EsqueletoTarjeta key={indice} lineas={2} />
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {Array.from({ length: 3 }, (_, indice) => (
          <EsqueletoTarjeta key={indice} lineas={2} />
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[repeat(3,1fr)_1.5fr]">
        {Array.from({ length: 4 }, (_, indice) => (
          <EsqueletoTarjeta key={indice} lineas={4} />
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[2fr_1fr]">
        <EsqueletoTarjeta lineas={6} />
        <EsqueletoTarjeta lineas={6} />
      </div>
    </>
  );
}
