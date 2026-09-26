import { EsqueletoTarjeta } from "@/components/ui/Esqueleto";

/**
 * Carga de la pantalla de usuarios.
 *
 * Es el esqueleto de la ruta entera, distinto de los `Suspense` de la página: esos son por
 * sección. Tiene la forma del contenido —la franja de cinco indicadores, la barra de
 * filtros y la tarjeta de la tabla— para que el salto al llegar los datos sea mínimo.
 */
export default function CargandoUsuarios() {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {Array.from({ length: 5 }, (_, indice) => (
          <EsqueletoTarjeta key={indice} lineas={2} />
        ))}
      </div>

      <EsqueletoTarjeta lineas={1} />

      <EsqueletoTarjeta lineas={10} />
    </>
  );
}
