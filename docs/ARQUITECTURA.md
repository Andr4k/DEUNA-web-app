# Arquitectura del portal

Cómo está organizado el portal de DEUNA y **por qué**. Las reglas no viven acá
nada más: las de tamaño y de dependencias entre capas están en
`eslint.config.mjs` y hacen fallar el build.

## El enfoque: servidor primero

Las pantallas se resuelven en el servidor. El navegador recibe HTML con los datos
adentro, no un armazón que después sale a buscarlos.

Qué implica en la práctica:

- **Leer** → un Server Component (la página) llama a un servicio y pasa el
  resultado a los componentes como props.
- **Escribir** → Server Actions. El token no toca el navegador.
- **Interactuar** (filtros, formularios) → componente cliente, pero **sin pedir
  datos**: escribe en la URL y el servidor vuelve a resolver la pantalla.
- **Dato vivo** (seguimiento del domiciliario) → componente cliente que refresca
  solo. Es la única excepción, y es a propósito.

Por qué: el token vive en una cookie `httpOnly` y nunca llega al navegador; el
código que renderiza no se envía al cliente, así que el JavaScript inicial es
menor que con el enfoque cliente; y las pantallas llegan con contenido, sin
spinner.

## Las capas

```
app/          Rutas. Solo composición.
components/   Presentación. Nunca piden datos.
services/     Acceso a la API. server-only.
lib/          Utilidades puras, tipos y configuración.
```

La dirección de las dependencias va en un solo sentido:

```
app  →  components  →  lib
 ↓
services  →  lib
```

`components` **no** puede importar `services`. Lo verifica ESLint: si alguien lo
intenta, el build falla. El motivo no es purismo: un componente que hace fetch no
se puede reusar en otra pantalla, no se puede probar sin red y no se puede
mostrar con datos de ejemplo.

## Las reglas

| Regla | Cómo se aplica |
| :--- | :--- |
| Una pantalla compone, no calcula | `page.tsx` chico: pide datos y arma secciones |
| Un componente, una responsabilidad | Si renderiza tabla + filtros + paginación, son tres |
| Máximo **120 líneas** por archivo | `max-lines` en `components/`, `services/` y `app/` |
| Máximo **60 líneas** por función | `max-lines-per-function` en todo `src/` |
| Máximo **3 niveles** de anidamiento | `max-depth` |
| Lo que se repite dos veces sube a `ui/` | Antes del tercer uso, no después |
| La presentación no sabe de datos | `no-restricted-imports` en `components/**` |
| Un servicio no conoce la UI | `no-restricted-imports` en `services/**` |
| Los servicios son `server-only` | `import "server-only"` en cada servicio |
| Sin barrels (`index.ts`) | Imports explícitos: sin ciclos, mejor tree-shaking |

Cuando un archivo pasa el límite, no se sube el límite: se parte. Las únicas
excepciones son los archivos de **datos** (el mapa de iconos, la navegación),
que son listas largas por naturaleza.

## Agregar una pantalla

Ejemplo: una pantalla de restaurantes.

**1. La entrada en la navegación** (`src/lib/navegacion.ts`):

```ts
{ etiqueta: "Restaurantes", href: "/restaurantes", icono: "tienda" },
```

El `icono` está tipado con el set real: un nombre mal escrito no compila.

**2. Los tipos** (`src/lib/tipos/restaurante.ts`) — el contrato con el backend.

**3. El servicio** (`src/services/restaurantes.service.ts`) — `server-only`, una
función por endpoint. Si el endpoint no existe, **no se inventa la ruta**: se
anota como pendiente al pie del archivo.

**4. Los componentes de la pantalla** (`src/components/restaurantes/`) — uno por
responsabilidad: `ListaRestaurantes`, `FilaRestaurante`, `FiltrosRestaurantes`.

**5. La página** (`src/app/(portal)/restaurantes/page.tsx`) — pide los datos y
compone. Nada más:

```tsx
export default async function PaginaRestaurantes({ searchParams }) {
  const { pagina, estado } = await searchParams;
  const { filas, totalPaginas } = await restaurantesService.listar({ pagina, estado });

  return (
    <>
      <EncabezadoSeccion titulo="Restaurantes" />
      <BarraFiltros filtros={FILTROS} />
      <ListaRestaurantes filas={filas} />
      <Paginacion pagina={pagina} totalPaginas={totalPaginas} href={...} />
    </>
  );
}
```

**6. Los estados de carga y error** (`loading.tsx` y `error.tsx` en la misma
carpeta) — con `EsqueletoTarjeta`, para que la pantalla no quede en blanco.

## Componentes base disponibles

Antes de escribir UI nueva, mirar acá. Si algo se parece a esto, se usa esto.

| Componente | Para qué |
| :--- | :--- |
| `Tarjeta` | Contenedor con título y acción al pie |
| `Tabla` | Tabla con columnas declarativas, alineación y scroll |
| `ListaDesglose` | Filas "etiqueta … valor" con separadores |
| `Kpi` | Indicador con valor y variación |
| `Tendencia` | "▲ 18 vs ayer", con el color según si subir es bueno |
| `Pill` | Estado del pedido traducido a lenguaje de operador |
| `Alerta` | Aviso con severidad |
| `Anillo` | Porcentaje en círculo |
| `BarraFiltros` | Filtros que escriben en la URL |
| `Paginacion` | Paginado por enlaces (sin JavaScript) |
| `EncabezadoSeccion` | Fila "TÍTULO … Ver todos →" |
| `EstadoVacio` | Cuando no hay resultados |
| `Esqueleto` | Carga, con la forma del contenido |
| `Boton`, `EnlaceAccion`, `Avatar`, `Icono` | Piezas básicas |

## Qué falta y dónde está anotado

Los huecos del backend están anotados al pie de cada servicio, no en un documento
aparte que se desactualiza. Resumen:

- **Métricas**: no hay ningún agregado (`services/metricas.service.ts`). El panel
  necesita `pedidos del día`, `entregas a tiempo`, `recaudo por zona`.
- **Pedidos**: falta el listado global con filtros y paginación.
- **Domiciliarios**: falta el listado con estado e historial.
- **Configuración del restaurante**: horarios y radio de entrega hoy están fijos
  en el código del backend.
- **Menú/catálogo**: no existe, y el precio lo manda el cliente.
