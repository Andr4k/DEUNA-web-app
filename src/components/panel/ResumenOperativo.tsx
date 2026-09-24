import { EnlaceAccion } from "@/components/ui/EnlaceAccion";
import { Icono } from "@/components/ui/Icono";
import { Tarjeta } from "@/components/ui/Tarjeta";
import { DOMICILIARIOS, PEDIDOS_POR_ESTADO, RESTAURANTES, ZONAS } from "@/lib/datos-ejemplo";
import { moneda, numero } from "@/lib/formato";

/** Fila de resumen operativo: pedidos por estado, domiciliarios, restaurantes y zonas. */
export function ResumenOperativo() {
  return (
    <section
      aria-label="Resumen operativo"
      className="grid gap-4 xl:grid-cols-[repeat(3,1fr)_1.5fr]"
    >
      <Tarjeta titulo="Pedidos de hoy" pie={<EnlaceAccion href="/pedidos">Ver todos los pedidos</EnlaceAccion>}>
        <ul className="flex flex-col">
          {PEDIDOS_POR_ESTADO.map((fila) => (
            <li
              key={fila.etiqueta}
              className="flex items-center gap-2.5 border-b border-borde-suave py-2.5 text-[13px] last:border-b-0"
            >
              <Icono
                nombre={fila.estado === "Entregado" ? "check" : fila.estado === "Buscando" ? "pedidos" : "moto"}
                tamano={15}
                className={
                  fila.estado === "Entregado"
                    ? "text-exito"
                    : fila.estado === "Buscando"
                      ? "text-peligro"
                      : "text-info"
                }
              />
              <span className="flex-1 text-texto-2">{fila.etiqueta}</span>
              <span
                className={`font-bold tabular-nums ${
                  fila.estado === "Entregado" ? "text-exito" : ""
                }`}
              >
                {numero(fila.valor)}
              </span>
            </li>
          ))}
        </ul>
      </Tarjeta>

      <Tarjeta titulo="Domiciliarios" pie={<EnlaceAccion href="/domiciliarios">Ver todos</EnlaceAccion>}>
        <div className="mb-3 flex items-center gap-3">
          <Icono nombre="moto" tamano={22} className="text-exito" />
          <div>
            <div className="text-[26px] leading-none font-bold">{numero(DOMICILIARIOS.activos)}</div>
            <div className="text-[13px] text-texto-2">Activos ahora</div>
          </div>
        </div>
        <ul className="flex flex-col">
          <li className="flex items-center gap-2.5 border-b border-borde-suave py-2.5 text-[13px] last:border-b-0">
            <span className="flex-1 text-texto-2">Disponibles</span>
            <span className="font-bold text-exito tabular-nums">{numero(DOMICILIARIOS.disponibles)}</span>
          </li>
          <li className="flex items-center gap-2.5 border-b border-borde-suave py-2.5 text-[13px] last:border-b-0">
            <span className="flex-1 text-texto-2">En servicio</span>
            <span className="font-bold tabular-nums">{numero(DOMICILIARIOS.enServicio)}</span>
          </li>
          <li className="flex items-center gap-2.5 border-b border-borde-suave py-2.5 text-[13px] last:border-b-0">
            <span className="flex-1 text-texto-2">En descanso</span>
            <span className="font-bold tabular-nums">{numero(DOMICILIARIOS.enDescanso)}</span>
          </li>
        </ul>
      </Tarjeta>

      <Tarjeta titulo="Restaurantes" pie={<EnlaceAccion href="/restaurantes">Ver todos</EnlaceAccion>}>
        <div className="mb-3 flex items-center gap-3">
          <Icono nombre="tienda" tamano={22} className="text-morado" />
          <div>
            <div className="text-[26px] leading-none font-bold">{numero(RESTAURANTES.activos)}</div>
            <div className="text-[13px] text-texto-2">Activos</div>
          </div>
        </div>
        <ul className="flex flex-col">
          <li className="flex items-center gap-2.5 border-b border-borde-suave py-2.5 text-[13px] last:border-b-0">
            <span className="flex-1 text-texto-2">Con pedidos hoy</span>
            <span className="font-bold text-morado tabular-nums">{numero(RESTAURANTES.conPedidosHoy)}</span>
          </li>
          <li className="flex items-center gap-2.5 border-b border-borde-suave py-2.5 text-[13px] last:border-b-0">
            <span className="flex-1 text-texto-2">Nuevos hoy</span>
            <span className="font-bold tabular-nums">{numero(RESTAURANTES.nuevosHoy)}</span>
          </li>
        </ul>
      </Tarjeta>

      <Tarjeta titulo="Zonas (hoy)" pie={<EnlaceAccion href="/reportes">Ver todas las zonas</EnlaceAccion>}>
        <div className="tabla-scroll">
          <table className="tabla tabla--compacta">
            <thead>
              <tr>
                <th>Zona</th>
                <th className="num">Pedidos</th>
                <th className="num">Entregados</th>
                <th className="num">Pendientes</th>
                <th className="num">Recaudo</th>
              </tr>
            </thead>
            <tbody>
              {ZONAS.map((zona) => (
                <tr key={zona.nombre}>
                  <td>{zona.nombre}</td>
                  <td className="num">{numero(zona.pedidos)}</td>
                  <td className="num">{numero(zona.entregados)}</td>
                  <td className="num">{numero(zona.pendientes)}</td>
                  <td className="num font-semibold text-exito">{moneda(zona.recaudo)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Tarjeta>
    </section>
  );
}
