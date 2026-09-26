import { Kpi } from "@/components/ui/Kpi";
import { numero } from "@/lib/formato";
import type { RespuestaUsuarios } from "@/lib/tipos/usuarios";

/**
 * El alcance de los cinco números, dicho en cada tarjeta.
 *
 * Los desgloses se calculan sobre el conjunto que cumple los filtros, no sobre toda la
 * base de cuentas: sin esta línea, el total de una búsqueda por "maría" se leería como el
 * total del portal. La pantalla de Pedidos resolvió lo mismo con la misma frase.
 */
const ALCANCE = "Con los filtros actuales";

/**
 * Fila de indicadores del listado de usuarios.
 *
 * Recibe la promesa y la espera acá adentro, así la pantalla no frena mientras los
 * números llegan. Los cinco salen de la MISMA respuesta que las filas —por eso viajan
 * juntos—, y eso es lo que impide el contador que dice 42 con una lista de 38: el total
 * es el `total` del sobre de la página, el que también usa la paginación.
 *
 * Se usa el `Kpi` de `ui/` y no una tarjeta propia: el `Kpi` ya sabe dibujar icono,
 * etiqueta, valor y una línea de contexto, y su fila de tendencia es OPCIONAL. Acá no se
 * pasa a propósito: este contrato no trae ninguna comparación contra un período anterior,
 * y un "▲ 12% vs ayer" sería un dato inventado. Es la diferencia con la pantalla de
 * Pedidos, que se armó su propia tarjeta porque su endpoint no traía ni el contexto.
 */
export async function ResumenUsuarios({ datos }: { datos: Promise<RespuestaUsuarios> }) {
  const { pagina, resumen } = await datos;

  return (
    <section
      aria-label="Resumen de usuarios"
      className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5"
    >
      <Kpi
        icono="usuario"
        colorIcono="text-morado"
        etiqueta="Total de usuarios"
        valor={numero(pagina.total)}
        periodo={ALCANCE}
      />
      <Kpi
        icono="config"
        colorIcono="text-info"
        etiqueta="Administradores"
        valor={numero(resumen.administradores)}
        periodo={ALCANCE}
      />
      <Kpi
        icono="tienda"
        colorIcono="text-alerta"
        etiqueta="Restaurantes"
        valor={numero(resumen.restaurantes)}
        periodo={ALCANCE}
      />
      <Kpi
        icono="moto"
        colorIcono="text-exito"
        etiqueta="Domiciliarios"
        valor={numero(resumen.domiciliarios)}
        periodo={ALCANCE}
      />
      <Kpi
        icono="check"
        colorIcono="text-acento"
        etiqueta="Usuarios activos"
        valor={numero(resumen.activos)}
        periodo={ALCANCE}
      />
    </section>
  );
}
