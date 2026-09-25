# DEUNA Domicilios — Portal de administración

Portal web del backoffice de DEUNA: el panel para administradores de la red y, más adelante, el
de cada restaurante. Construido sobre **Next.js 15** (App Router) con **TypeScript**, **React 19**
y **Tailwind CSS v4**.

La arquitectura, las reglas y el motivo de cada decisión están en
**[docs/ARQUITECTURA.md](docs/ARQUITECTURA.md)**. Vale la pena leerlo antes de agregar una pantalla.

## Cómo levantarlo

```bash
npm install
cp .env.example .env.local     # apunta al gateway del backend
npm run dev                    # http://localhost:3000
```

Otros comandos:

```bash
npm run build   # compila y verifica tipos
npm run lint    # ESLint + reglas de arquitectura (tamaño y capas)
```

> **Nota sobre WSL:** el proyecto vive en el disco de Windows (`/mnt/c/...`). `npm install` y
> `npm run build` ahí funcionan pero son lentos (varios minutos) porque el sistema de archivos de
> Windows no está hecho para la cantidad de archivos chicos que genera Node. Si se vuelve molesto,
> se puede instalar y compilar contra una copia en el disco nativo de WSL manteniendo el código acá.

> **No dejar un `next dev` corriendo mientras se compila.** El servidor de desarrollo escribe en la
> misma carpeta `.next/` que el build de producción, así que lo corrompe: después `next start` falla
> con `Cannot find module './NNN.js'` y la página devuelve 500. Se arregla borrando `.next/` y
> volviendo a compilar. Si se necesitan los dos a la vez, se usa un `distDir` distinto.

## Estructura

```
src/
  app/                       Rutas. Solo composición.
    globals.css              Tokens del diseño + base + tablas
    layout.tsx               Raíz: idioma, tipografía, metadatos
    (portal)/
      layout.tsx             Shell del portal: barra lateral + barra superior
      page.tsx               Panel principal (la pantalla construida)
      pedidos/page.tsx       … 11 rutas más, con su componente `Pendiente`
  components/                Presentación. Nunca piden datos.
    layout/                  Sidebar, Topbar, Marca, EnlaceNav, UsuarioActual
    panel/                   Secciones del panel, una por archivo
    ui/                      Primitivas reutilizables (Tarjeta, Tabla, Kpi, Pill, …)
  services/                  Acceso a la API. `server-only`.
    http.ts                  Cliente base (gateway, errores, token)
    pedidos.service.ts       ← espejo de Orders
    entregas.service.ts      ← espejo de Delivery
    sesion.service.ts        ← espejo de Identity
    metricas.service.ts      ← todavía sin endpoints del otro lado
  lib/                       Utilidades puras, tipos y datos
    tipos/pedido.ts          Estados y contratos del pedido
    tipos/metricas.ts        Agregados del panel
    tipos/repartidor.ts      Domiciliarios
    tipos/restaurante.ts     Restaurantes
    iconos.tsx               Trazados SVG (datos)
    formato.ts               Moneda, hora, duración, porcentaje
    navegacion.ts            Ítems de la barra lateral
    sesion.ts                Usuario en sesión (temporal)
    datos-ejemplo.ts         Datos de mentira mientras no hay backend conectado
docs/ARQUITECTURA.md         Las reglas y el por qué
mockups/                     Mockup HTML aprobado, como referencia visual
```

## Cómo agregar una pantalla

El paso a paso está en `docs/ARQUITECTURA.md`. En corto: la entrada en `lib/navegacion.ts`, los
tipos en `lib/tipos/`, el servicio en `services/`, los componentes en `components/<dominio>/` y la
página en `app/(portal)/<ruta>/page.tsx`. Más `loading.tsx` y `error.tsx` en la misma carpeta.

Si la pantalla necesita un icono nuevo, se agrega al mapa de `lib/iconos.tsx` — y como el tipo
`NombreIcono` sale de ese mapa, el icono queda disponible con autocompletado en toda la app.

## Convenciones

- **Las reglas de arquitectura las aplica el linter**, no la memoria de cada uno: máximo 120 líneas
  por archivo, 60 por función, y `components/` no puede importar `services/`. Están en
  `eslint.config.mjs` y hacen fallar el build. Si un archivo no entra en el límite, se parte; no se
  sube el límite.
- **Los colores salen de los tokens**, no del HTML: `bg-panel`, `text-texto-2`, `border-borde`,
  `text-exito`, `text-peligro`, … Están definidos en `globals.css` (`@theme`). Si falta un tono,
  se agrega ahí.
- **Los estados del pedido viven en `lib/tipos/pedido.ts`** y son los del backend
  (`Buscando`, `Asignado`, `ConfirmadoEnLocal`, `EnRuta`, `Entregado`, `Cancelado`). Viajan como
  texto dentro de los eventos de integración, así que **no inventar variantes**: un literal
  distinto hace que el pedido parezca quedarse quieto sin que nada falle. La traducción a lenguaje
  del operador y el color están en `components/ui/Pill.tsx`, en un solo lugar.
- **Los textos de la interfaz van en español** (es el idioma de los operadores). El código
  —nombres de variables, tipos, comentarios— también, salvo los términos técnicos que se usan en
  inglés por convención (`props`, `fetch`, `layout`).
- **Formatear siempre con `lib/formato.ts`**: la misma cifra se escribe igual en el panel, en una
  tabla y en un reporte.
- **No inventar rutas de API.** Si el endpoint no existe, se anota como pendiente al pie del
  servicio. Una ruta inventada falla en ejecución, no al compilar, y el error aparece en producción.

## Estado frente al backend

El portal está construido contra datos de ejemplo. Lo que **hoy** existe del otro lado:

| Recurso | Endpoint | Estado |
| :--- | :--- | :--- |
| Pedidos de un restaurante | `GET /api/v1/orders/restaurante/{id}` | Existe |
| Un pedido | `GET /api/v1/orders/{id}` | Existe |
| Seguimiento del domiciliario | `GET /api/v1/delivery/tracking/{orderId}` | Existe |
| Iniciar sesión | `POST /api/v1/identity/login` | Existe |

Lo que el panel necesita y **todavía no existe** está anotado al pie de cada archivo de
`services/` (no en un documento aparte que se desactualiza): agregados del día para los KPI,
métricas por zona, rendimiento, listado global de pedidos con filtros, listado de domiciliarios con
su estado, configuración del restaurante y menú. Las pantallas sin construir usan el componente
`Pendiente`, que lista exactamente eso: es la lista de trabajo real, no un "próximamente".

El detalle del flujo y el estado de cada servicio del backend están en la bóveda de Obsidian, en
`07. Spec-Kit (SDD)/03-tasks-graph.md`.
