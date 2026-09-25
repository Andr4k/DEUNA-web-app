import { EnlaceAccion } from "@/components/ui/EnlaceAccion";
import { EstadoVacio } from "@/components/ui/EstadoVacio";
import { Tabla, type Columna } from "@/components/ui/Tabla";
import { Tarjeta } from "@/components/ui/Tarjeta";
import { moneda, numero } from "@/lib/formato";
import type { Zona } from "@/lib/tipos/metricas";

/**
 * Las columnas se declaran fuera del componente: son constantes, no cambian entre
 * renders, y así la tabla queda legible en una pantalla.
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

/**
 * Actividad del día por zona.
 *
 * La zona es la ciudad de la dirección de entrega, normalizada: en la base conviven
 * "Bogotá" y "Bogota", y sin normalizar la misma ciudad aparecería como dos filas
 * con la mitad de los pedidos cada una.
 */
export function TarjetaZonas({ zonas }: { zonas: Zona[] }) {
  return (
    <Tarjeta
      titulo="Zonas (hoy)"
      pie={<EnlaceAccion href="/reportes">Ver todas las zonas</EnlaceAccion>}
    >
      <Tabla
        columnas={COLUMNAS}
        filas={zonas}
        claveFila={(zona) => zona.nombre}
        compacta
        sinDatos={
          <EstadoVacio
            icono="reportes"
            titulo="Todavía no hay pedidos hoy"
            descripcion="Las zonas se llenan a medida que entran pedidos."
          />
        }
      />
    </Tarjeta>
  );
}
