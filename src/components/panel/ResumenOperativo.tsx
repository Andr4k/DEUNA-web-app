import { TarjetaPedidosHoy } from "@/components/panel/TarjetaPedidosHoy";
import { TarjetaDomiciliarios } from "@/components/panel/TarjetaDomiciliarios";
import { TarjetaRestaurantes } from "@/components/panel/TarjetaRestaurantes";
import { TarjetaZonas } from "@/components/panel/TarjetaZonas";
import type { ResumenPanel, Zona } from "@/lib/tipos/metricas";

/**
 * Resumen operativo del panel.
 *
 * Es la grilla: no sabe qué hay dentro de cada tarjeta. Recibe dos promesas —una por
 * endpoint— y las espera acá, así las cuatro tarjetas aparecen juntas en cuanto
 * están sus datos, sin depender de las otras secciones del panel.
 */
export async function ResumenOperativo({
  panel,
  zonas,
}: {
  panel: Promise<ResumenPanel>;
  zonas: Promise<Zona[]>;
}) {
  const [{ pedidosPorEstado, domiciliarios, restaurantes }, listaZonas] = await Promise.all([
    panel,
    zonas,
  ]);

  return (
    <section
      aria-label="Resumen operativo"
      className="grid gap-4 xl:grid-cols-[repeat(3,1fr)_1.5fr]"
    >
      <TarjetaPedidosHoy porEstado={pedidosPorEstado} />
      <TarjetaDomiciliarios resumen={domiciliarios} />
      <TarjetaRestaurantes resumen={restaurantes} />
      <TarjetaZonas zonas={listaZonas} />
    </section>
  );
}
