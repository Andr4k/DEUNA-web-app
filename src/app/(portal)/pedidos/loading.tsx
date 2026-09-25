import { EsqueletoTarjeta } from "@/components/ui/Esqueleto";

/**
 * Carga de la pantalla de pedidos.
 *
 * Se muestra al navegar a la ruta, mientras el servidor resuelve la página. Es
 * distinto de los `Suspense` de la página: esos son por sección, este es de la
 * pantalla entera.
 *
 * El esqueleto tiene la forma del contenido —franja de indicadores y las dos
 * columnas, la tabla a la izquierda y el panel de asignación a la derecha— para que
 * el salto al llegar los datos sea mínimo.
 */
export default function CargandoPedidos() {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, indice) => (
          <EsqueletoTarjeta key={indice} lineas={2} />
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <EsqueletoTarjeta lineas={8} />
        <EsqueletoTarjeta lineas={6} />
      </div>
    </>
  );
}
