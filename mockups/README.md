# DEUNA Domicilios — Portal de administración (mockups)

Mockups de alta fidelidad del portal web de DEUNA, construidos como **plantilla**:
un sistema de diseño compartido y una página por pantalla.

## Cómo verlo

Abrir `index.html` en el navegador, o levantar un servidor local:

```bash
python3 -m http.server 8099
# luego http://localhost:8099
```

No hay dependencias externas: ni CDN, ni fuentes remotas, ni librerías de iconos.
Todo (iconos incluidos) vive en el repositorio, así que funciona sin internet.

## Estructura

```
index.html                 Panel principal del administrador
assets/css/estilos.css     Sistema de diseño (tokens + componentes)
```

## Reglas de la plantilla

Al agregar una pantalla nueva, copiar `index.html` y respetar esto:

1. **Una pantalla = un archivo HTML** en la raíz (`pedidos.html`, `restaurantes.html`, …).
   Reutiliza `assets/css/estilos.css`; **no** crear CSS por pantalla salvo que el
   componente sea realmente exclusivo de esa vista.
2. **Copiar el sprite de iconos** (el `<svg>` oculto al inicio del `<body>`) tal cual.
   Para un icono nuevo, agregar un `<symbol id="i-nombre" viewBox="0 0 24 24">` al sprite
   y usarlo con `<svg class="icono"><use href="#i-nombre"></use></svg>`.
   Los trazos heredan el color del texto (`currentColor`), así que se colorean con las
   clases utilitarias (`.texto-exito`, `.texto-alerta`, …).
3. **Marcar el ítem activo** del sidebar con `nav__item--activo` y `aria-current="page"`.
   El sidebar se copia igual en todas las pantallas.
4. **Usar las filas del layout** en vez de escribir grillas a mano:
   `fila--kpi` (5 columnas), `fila--alertas` (3), `fila--resumen` (3 + 1.5),
   `fila--dos` (2 + 1). Todas colapsan a 2 y 1 columna en pantallas chicas.
5. **Los datos de ejemplo son de mentira y están en el HTML**: este mockup no llama al
   backend. Al conectar la API real, cada valor sale de un endpoint (ver abajo).

## Componentes disponibles

| Componente | Clase | Para qué |
| :--- | :--- | :--- |
| Tarjeta | `.tarjeta` | Contenedor base de todo panel |
| KPI | `.kpi` + `.kpi__icono` / `.kpi__valor` / `.kpi__tendencia` | Indicadores con tendencia vs. ayer |
| Alerta | `.alerta alerta--peligro\|alerta\|morado` | Bloques de "requiere atención" con acción |
| Lista | `.lista` + `.lista__item` / `.lista__texto` / `.lista__valor` | Desgloses con valor a la derecha |
| Tabla | `.tabla` (+ `.num` para alinear números) | Datos tabulares |
| Pill de estado | `.pill--en-curso\|pendiente\|entregado\|incidencia\|neutro` | Estado de un pedido |
| Actividad | `.actividad__item` | Línea de tiempo con hora y punto de color |
| Anillo | `.anillo` | Métrica circular (se ajusta con `stroke-dasharray`) |
| Botón | `.boton--primario\|contorno\|acento` (+ `.boton--grande`) | Acciones |
| Enlace | `.enlace` | "Ver todos →" |
| Badge | `.badge` (+ `.badge--acento`) | Contadores (rojo en Pedidos, naranja en la campana) |

Los colores y medidas están como variables CSS en `:root` (`--acento`, `--exito`,
`--peligro`, `--panel`, `--radio`, …). **No** escribir colores literales en el HTML:
si falta un tono, agregarlo como variable.

## Pantallas pendientes

Este es el punto de partida; el resto se replica sobre esta base:

- [ ] Pedidos (listado + detalle, con asignación manual)
- [ ] Restaurantes (listado + detalle + alta)
- [ ] Domiciliarios (listado + detalle + documentos)
- [ ] Usuarios
- [ ] Incidencias
- [ ] Finanzas
- [ ] Calificaciones y referidos
- [ ] Campañas
- [ ] Reportes
- [ ] Configuración
- [ ] Ayuda
- [ ] Cierre del día

## Qué necesita del backend cada pantalla

El backend todavía no expone todo lo que estas pantallas muestran. Lo que falta,
por pantalla:

| Pantalla | Necesita | Estado del backend |
| :--- | :--- | :--- |
| Panel principal | Métricas agregadas del día (pedidos por estado, entregas a tiempo, tiempo promedio, calificación) | **No existe.** Hay que agregar en el backend |
| Pedidos | Listado con filtros + detalle + asignación manual | Parcial: `GET /api/v1/orders/restaurante/{id}`; no hay listado global ni asignación manual |
| Restaurantes | Listado, alta, **horarios, radio de cobertura, abrir/cerrar** | **Falta casi todo**: hoy los horarios y el radio están fijos en el código |
| Domiciliarios | Listado, perfil, documentos, historial | Parcial: hay réplica de datos, no endpoints de consulta |
| Finanzas / Cierre | Recaudo, comisiones, liquidaciones | **No existe** |
| Calificaciones | Feedback por criterio, comentarios negativos, responder | Parcial: se guarda el feedback; no hay consulta ni respuesta |
| Zonas / Reportes | Agregaciones por zona (PostGIS) + export CSV | **No existe** |

> El detalle técnico del flujo (pedido → asignación → QR del local → en ruta → entrega →
> feedback) y el estado real de cada servicio están en la bóveda de Obsidian:
> `07. Spec-Kit (SDD)/03-tasks-graph.md`.
