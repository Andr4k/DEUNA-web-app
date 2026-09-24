import { EnlaceAccion } from "@/components/ui/EnlaceAccion";
import { PillEstadoPedido } from "@/components/ui/Pill";
import { Tarjeta } from "@/components/ui/Tarjeta";
import { ULTIMOS_PEDIDOS } from "@/lib/datos-ejemplo";
import { duracion, hora, moneda } from "@/lib/formato";

/** Últimos pedidos: la tabla que usa el operador para saber qué está pasando. */
export function UltimosPedidos() {
  return (
    <Tarjeta titulo="Últimos pedidos" accion={<EnlaceAccion href="/pedidos">Ver todos</EnlaceAccion>}>
      <div className="tabla-scroll">
        <table className="tabla">
          <thead>
            <tr>
              <th>Pedido</th>
              <th>Restaurante</th>
              <th>Domiciliario</th>
              <th>Estado</th>
              <th className="num">Tiempo</th>
              <th className="num">Valor</th>
              <th>Zona</th>
              <th className="num">Creado</th>
            </tr>
          </thead>
          <tbody>
            {ULTIMOS_PEDIDOS.map((pedido) => (
              <tr key={pedido.id}>
                <td className="font-semibold text-acento">{pedido.codigo}</td>
                <td>{pedido.restauranteNombre}</td>
                <td className={pedido.repartidorNombre ? "" : "text-texto-3"}>
                  {pedido.repartidorNombre ?? "-"}
                </td>
                <td>
                  <PillEstadoPedido estado={pedido.estado} />
                </td>
                <td className="num">{duracion(pedido.minutosTranscurridos)}</td>
                <td className="num">{moneda(pedido.total)}</td>
                <td>{pedido.zona}</td>
                <td className="num">{hora(pedido.creadoEn)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Tarjeta>
  );
}
