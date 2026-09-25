import { EnlaceAccion } from "@/components/ui/EnlaceAccion";
import { Tabla, type Columna } from "@/components/ui/Tabla";
import { Tarjeta } from "@/components/ui/Tarjeta";
import { ZONAS } from "@/lib/datos-ejemplo";
import { moneda, numero } from "@/lib/formato";
import type { Zona } from "@/lib/tipos/metricas";

/**
 * Las columnas se declaran fuera del componente: son constantes, no cambian
 * entre renders, y así la tabla queda legible en una pantalla.
 */
const COLUMNAS: Columna<Zona>[] = [
  { clave: "nombre", titulo: "Zona", render: (zona) => zona.nombre },
  { clave: "pedidos", titulo: "Pedidos", numerica: true, render: (zona) => numero(zona.pedidos) },
  {
    clave: "entregados",
    titulo: "Entregados",
    numerica: true,
    render: (zona) => numero(zona.entregados),
  },
  {
    clave: "pendientes",
    titulo: "Pendientes",
    numerica: true,
    render: (zona) => numero(zona.pendientes),
  },
  {
    clave: "recaudo",
    titulo: "Recaudo",
    numerica: true,
    clase: "font-semibold text-exito",
    render: (zona) => moneda(zona.recaudo),
  },
];

/** Actividad del día por zona. */
export function TarjetaZonas() {
  return (
    <Tarjeta
      titulo="Zonas (hoy)"
      pie={<EnlaceAccion href="/reportes">Ver todas las zonas</EnlaceAccion>}
    >
      <Tabla columnas={COLUMNAS} filas={ZONAS} claveFila={(zona) => zona.nombre} compacta />
    </Tarjeta>
  );
}
