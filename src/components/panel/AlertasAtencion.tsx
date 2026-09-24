import { Alerta } from "@/components/ui/Alerta";
import { EnlaceAccion } from "@/components/ui/EnlaceAccion";
import { ALERTAS } from "@/lib/datos-ejemplo";

/**
 * Lo que requiere atención ahora.
 *
 * Tres bloques con acción directa a la pantalla que resuelve el problema: el
 * panel sirve para operar, no para mirar números.
 */
export function AlertasAtencion() {
  return (
    <section aria-label="Lo que requiere atención ahora">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="m-0 text-xs font-semibold tracking-[0.05em] text-texto-2 uppercase">
          Lo que requiere atención ahora
        </h2>
        <EnlaceAccion href="/incidencias">Ver todas las alertas</EnlaceAccion>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Alerta
          tono="peligro"
          icono="alerta"
          titulo="Pedidos sin asignar"
          valor={ALERTAS.sinAsignar}
          detalle="Requieren asignación inmediata"
          accion="Ver pedidos"
          href="/pedidos?estado=Buscando"
        />
        <Alerta
          tono="alerta"
          icono="reloj"
          titulo="Pedidos demorados"
          valor={ALERTAS.demorados}
          detalle="Superan el tiempo estimado"
          accion="Ver pedidos"
          href="/pedidos?demorados=true"
        />
        <Alerta
          tono="morado"
          icono="info"
          titulo="Incidencias sin resolver"
          valor={ALERTAS.incidenciasSinResolver}
          detalle="Requieren atención"
          accion="Ver incidencias"
          href="/incidencias"
        />
      </div>
    </section>
  );
}
