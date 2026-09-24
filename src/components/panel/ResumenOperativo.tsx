import { TarjetaPedidosHoy } from "@/components/panel/TarjetaPedidosHoy";
import { TarjetaDomiciliarios } from "@/components/panel/TarjetaDomiciliarios";
import { TarjetaRestaurantes } from "@/components/panel/TarjetaRestaurantes";
import { TarjetaZonas } from "@/components/panel/TarjetaZonas";

/**
 * Resumen operativo del panel.
 *
 * Este componente es SOLO la grilla: no sabe qué hay dentro de cada tarjeta ni
 * de dónde salen los datos. Cada tarjeta es su propio archivo, así que cambiar
 * la de domiciliarios no obliga a tocar las otras tres (antes eran 117 líneas
 * en un solo archivo).
 */
export function ResumenOperativo() {
  return (
    <section
      aria-label="Resumen operativo"
      className="grid gap-4 xl:grid-cols-[repeat(3,1fr)_1.5fr]"
    >
      <TarjetaPedidosHoy />
      <TarjetaDomiciliarios />
      <TarjetaRestaurantes />
      <TarjetaZonas />
    </section>
  );
}
