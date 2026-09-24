import { BloqueAtencion } from "@/components/ui/BloqueAtencion";
import { EnlaceAccion } from "@/components/ui/EnlaceAccion";
import { numero } from "@/lib/formato";
import type { ResumenPanel } from "@/lib/tipos/metricas";

/**
 * Lo que requiere atención ahora.
 *
 * Tres bloques con acción directa a la pantalla que resuelve el problema: el panel
 * sirve para operar, no para mirar números.
 *
 * **Los tres bloques cambiaron respecto del mockup, y es a propósito.** El mockup
 * pedía "pedidos demorados" e "incidencias sin resolver", y ninguno de los dos
 * existe como dato: demorados necesita un tiempo prometido que el pedido no guarda,
 * e incidencias necesita un modelo que todavía no está. En su lugar se muestran tres
 * cosas que sí salen de la base —sin asignar, cancelados y restaurantes sin
 * pedidos— en vez de bloques con números que nadie puede respaldar. Lo que falta
 * está anotado al pie de `services/metricas.service.ts`.
 */
export async function AlertasAtencion({ datos }: { datos: Promise<ResumenPanel> }) {
  const { pedidosPorEstado, indicadores, restaurantes } = await datos;

  const sinAsignar = pedidosPorEstado.find((conteo) => conteo.estado === "Buscando")?.valor ?? 0;
  const sinPedidos = Math.max(restaurantes.activos - restaurantes.conPedidosHoy, 0);

  return (
    <section aria-label="Lo que requiere atención ahora">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="m-0 text-xs font-semibold tracking-[0.05em] text-texto-2 uppercase">
          Lo que requiere atención ahora
        </h2>
        <EnlaceAccion href="/pedidos">Ver todos los pedidos</EnlaceAccion>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <BloqueAtencion
          tono="peligro"
          icono="alerta"
          titulo="Pedidos sin asignar"
          valor={sinAsignar}
          detalle="Requieren asignación inmediata"
          accion="Ver pedidos"
          href="/pedidos?estado=Buscando"
        />
        <BloqueAtencion
          tono="alerta"
          icono="triangulo"
          titulo="Cancelados hoy"
          valor={indicadores.incidencias}
          detalle="Pedidos que no llegaron a entregarse"
          accion="Ver pedidos"
          href="/pedidos?estado=Cancelado"
        />
        <BloqueAtencion
          tono="morado"
          icono="tienda"
          titulo="Restaurantes sin pedidos hoy"
          valor={sinPedidos}
          detalle={`De ${numero(restaurantes.activos)} activos`}
          accion="Ver restaurantes"
          href="/restaurantes"
        />
      </div>
    </section>
  );
}
