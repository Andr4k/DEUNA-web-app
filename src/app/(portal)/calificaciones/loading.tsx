import { EsqueletoTarjeta } from "@/components/ui/Esqueleto";

/**
 * Carga de la pantalla de calificaciones.
 *
 * Es el esqueleto de la ruta entera, distinto de los `Suspense` de la página: esos son por
 * sección. Tiene la forma del contenido —la franja de seis indicadores, los cuatro bloques
 * en 2x2 y la tarjeta de la tabla— para que el salto al llegar los datos sea mínimo.
 */
export default function CargandoCalificaciones() {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
        {Array.from({ length: 6 }, (_, indice) => (
          <EsqueletoTarjeta key={indice} lineas={2} />
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {Array.from({ length: 4 }, (_, indice) => (
          <EsqueletoTarjeta key={indice} lineas={5} />
        ))}
      </div>

      <EsqueletoTarjeta lineas={10} />
    </>
  );
}
