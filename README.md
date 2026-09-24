# DEUNA Domicilios — Portal de administración

Portal web del backoffice de DEUNA: el panel para administradores de la red y, más adelante, el
de cada restaurante. Construido sobre **Next.js 15** (App Router) con **TypeScript**, **React 19**
y **Tailwind CSS v4**.

## Cómo levantarlo

```bash
npm install
cp .env.example .env.local     # apunta al gateway del backend
npm run dev                    # http://localhost:3000
```

Otros comandos:

```bash
npm run build   # compila y verifica tipos
npm run lint    # ESLint (config de Next)
```

> **Nota sobre WSL:** el proyecto vive en el disco de Windows (`/mnt/c/...`). `npm install` ahí
> funciona pero es lento (varios minutos) porque el sistema de archivos de Windows no está hecho
> para la cantidad de archivos chicos que genera Node. Si se vuelve molesto, se puede instalar y
> compilar contra una copia en el disco nativo de WSL manteniendo el código acá.

## Estructura

```
src/
  app/
    globals.css              Tokens del diseño + base + tablas
    layout.tsx               Raíz: idioma, tipografía, metadatos
    (portal)/
      layout.tsx             Shell del portal: barra lateral + barra superior
      page.tsx               Panel principal (la pantalla construida)
      pedidos/page.tsx       …
  components/
    layout/                  Sidebar, Topbar
    panel/                   Secciones del panel principal
    ui/                      Componentes reutilizables (Tarjeta, Kpi, Pill, …)
  lib/
    tipos.ts                 Tipos del dominio (estados del pedido, pedido, zona…)
    formato.ts               Moneda, hora, duración, porcentaje
    navegacion.ts            Ítems de la barra lateral
    sesion.ts                Usuario en sesión (temporal)
    api.ts                   Cliente de la API (gateway)
    datos-ejemplo.ts         Datos de mentira para construir la interfaz
mockups/                     Mockup HTML aprobado, como referencia visual
```

## Cómo agregar una pantalla

1. Agregar la entrada en `src/lib/navegacion.ts` (etiqueta, ruta, icono, contador opcional).
2. Crear `src/app/(portal)/<ruta>/page.tsx`.
3. Componer con los componentes de `components/ui`. El shell (barra lateral y barra superior)
   ya lo pone el layout: la página solo aporta su contenido.

Si la pantalla necesita un icono nuevo, se agrega al mapa de `components/ui/Icono.tsx`.

## Convenciones

- **Los colores salen de los tokens**, no del HTML: `bg-panel`, `text-texto-2`, `border-borde`,
  `text-exito`, `text-peligro`, … Están definidos en `globals.css` (`@theme`). Si falta un tono,
  se agrega ahí.
- **Los estados del pedido viven en `lib/tipos.ts`** y son los del backend
  (`Buscando`, `Asignado`, `ConfirmadoEnLocal`, `EnRuta`, `Entregado`, `Cancelado`). Viajan como
  texto dentro de los eventos de integración, así que **no inventar variantes**: un literal
  distinto hace que el pedido parezca quedarse quieto sin que nada falle. La traducción a lenguaje
  del operador y el color están en `components/ui/Pill.tsx`, en un solo lugar.
- **Los textos de la interfaz van en español** (es el idioma de los operadores). El código
  —nombres de variables, tipos, comentarios— también, salvo los términos técnicos que se usan en
  inglés por convención (`props`, `fetch`, `layout`).
- **Formatear siempre con `lib/formato.ts`**: la misma cifra se escribe igual en el panel, en una
  tabla y en un reporte.

## Estado frente al backend

El portal está construido contra datos de ejemplo. Lo que **hoy** existe del otro lado:

| Recurso | Endpoint | Estado |
| :--- | :--- | :--- |
| Pedidos de un restaurante | `GET /api/v1/orders/restaurante/{id}` | Existe |
| Un pedido | `GET /api/v1/orders/{id}` | Existe |
| Seguimiento del domiciliario | `GET /api/v1/delivery/tracking/{orderId}` | Existe |

Lo que el panel necesita y **todavía no existe** (está anotado en `lib/api.ts`): agregados del
día para los KPI, métricas por zona, rendimiento, resumen de feedback por restaurante, listado
global de pedidos con filtros y asignación manual. Las pantallas sin construir usan el componente
`Pendiente`, que lista exactamente eso: es la lista de trabajo real, no un "próximamente".

El detalle del flujo y el estado de cada servicio están en la bóveda de Obsidian, en
`07. Spec-Kit (SDD)/03-tasks-graph.md`.
