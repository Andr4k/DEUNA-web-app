/**
 * Navegación del portal.
 *
 * Es la única fuente: la barra lateral se dibuja desde acá, así que agregar una
 * pantalla es agregar una entrada y crear su `page.tsx` en la ruta indicada.
 */

export interface ItemNavegacion {
  etiqueta: string;
  href: string;
  icono: string;
  /** Contador que se muestra como badge rojo (0 = sin badge). */
  contador?: number;
}

export interface SeccionNavegacion {
  titulo: string;
  items: ItemNavegacion[];
}

export const NAVEGACION: SeccionNavegacion[] = [
  {
    titulo: "Principal",
    items: [
      { etiqueta: "Panel principal", href: "/", icono: "home" },
      { etiqueta: "Pedidos", href: "/pedidos", icono: "pedidos", contador: 12 },
      { etiqueta: "Restaurantes", href: "/restaurantes", icono: "tienda" },
      { etiqueta: "Domiciliarios", href: "/domiciliarios", icono: "moto" },
      { etiqueta: "Usuarios", href: "/usuarios", icono: "usuario" },
      { etiqueta: "Incidencias", href: "/incidencias", icono: "alerta" },
      { etiqueta: "Finanzas", href: "/finanzas", icono: "dinero" },
      { etiqueta: "Calificaciones y referidos", href: "/calificaciones", icono: "estrella" },
      { etiqueta: "Campañas", href: "/campanas", icono: "megafono" },
      { etiqueta: "Reportes", href: "/reportes", icono: "reportes" },
    ],
  },
  {
    titulo: "Configuración",
    items: [
      { etiqueta: "Configuración", href: "/configuracion", icono: "config" },
      { etiqueta: "Ayuda", href: "/ayuda", icono: "ayuda" },
    ],
  },
];
