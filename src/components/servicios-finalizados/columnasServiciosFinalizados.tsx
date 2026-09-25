import { PillEstadoPedido } from "@/components/ui/Pill";
import type { Columna } from "@/components/ui/Tabla";
import { estrella, horaDe } from "@/components/servicios-finalizados/valoresServicio";
import { duracion, fechaCorta, hora, moneda } from "@/lib/formato";
import type { ServicioFinalizado } from "@/lib/tipos/servicios-finalizados";

/**
 * Las nueve columnas del historial, en el orden del brief.
 *
 * Están partidas en tres bloques —el quién, el servicio y el cierre— porque las nueve
 * juntas no entran en el límite de líneas por función, y porque cada bloque responde
 * una pregunta distinta del operador. El orden de la concatenación ES el orden de la
 * tabla: leer de arriba abajo es leer de izquierda a derecha.
 *
 * Vive en su propio archivo y no dentro de la lista: la lista compone, las columnas
 * definen qué se ve.
 *
 * La fecha de cierre acompaña al código aunque el brief pidiera solo la hora: el
 * historial se filtra por rango de fechas, así que una fila sin día no se puede ubicar
 * en el rango que el operador acaba de pedir.
 */
export function columnasServiciosFinalizados(): Columna<ServicioFinalizado>[] {
  return [...delPedido(), ...delServicio(), ...delCierre()];
}

/** Quién y por dónde: el pedido, el restaurante, el domiciliario y la ruta. */
function delPedido(): Columna<ServicioFinalizado>[] {
  return [
    {
      clave: "pedido",
      titulo: "Pedido",
      render: (s) => (
        <div className="flex flex-col">
          <span className="font-semibold">{s.codigo}</span>
          <span className="text-[12px] text-texto-3">
            {fechaCorta(s.cerradoEn)} · {hora(s.cerradoEn)}
          </span>
        </div>
      ),
    },
    {
      clave: "restaurante",
      titulo: "Restaurante",
      render: (s) => (
        <div className="flex flex-col">
          <span>{s.restaurante.nombre}</span>
          <span className="text-[12px] text-texto-3">{s.restaurante.ciudad}</span>
        </div>
      ),
    },
    {
      clave: "domiciliario",
      titulo: "Domiciliario",
      render: (s) =>
        s.domiciliario === null ? (
          <span className="text-[12px] text-texto-3">Sin asignación registrada</span>
        ) : (
          <div className="flex flex-col">
            <span>{s.domiciliario.nombre}</span>
            <span className="text-[12px] text-texto-2">
              {estrella(s.domiciliario.calificacion)}
            </span>
          </div>
        ),
    },
    {
      clave: "ruta",
      titulo: "Origen → Destino",
      render: (s) => (
        <div className="flex flex-col">
          <span className="text-[12px] text-texto-2">{s.origen.direccion}</span>
          <span className="text-[12px] text-texto-3">
            → {s.destino.direccion} · {s.destino.zona}
          </span>
        </div>
      ),
    },
  ];
}

/** Cuánto tardó y cuánto costó: los tiempos, el valor y las dos calificaciones. */
function delServicio(): Columna<ServicioFinalizado>[] {
  return [
    {
      clave: "tiempos",
      titulo: "Tiempos del servicio",
      render: (s) => (
        <div className="flex flex-col text-[12px] text-texto-2">
          <span>Asignado {horaDe(s.tiempos.asignadoEn)}</span>
          <span>Recogido {horaDe(s.tiempos.recogidoEn)}</span>
          <span>Entregado {hora(s.tiempos.entregadoEn)}</span>
          <span className="font-semibold text-texto">
            Total {duracion(s.tiempos.minutosTotales)}
          </span>
        </div>
      ),
    },
    {
      clave: "valor",
      titulo: "Valor / Pago",
      numerica: true,
      render: (s) => (
        <div className="flex flex-col">
          <span className="font-semibold">{moneda(s.valor.total)}</span>
          <span className="text-[12px] text-texto-3">
            Domicilio {moneda(s.valor.domicilio)}
          </span>
          <span className="text-[12px] text-texto-2">
            {s.valor.paga === null ? "Pago sin confirmar" : `Paga ${s.valor.paga}`}
          </span>
        </div>
      ),
    },
    {
      clave: "calificaciones",
      titulo: "Calificación",
      render: (s) => (
        <div className="flex flex-col text-[12px] text-texto-2">
          <span>Domiciliario {estrella(s.calificaciones.domiciliario)}</span>
          <span>Restaurante {estrella(s.calificaciones.restaurante)}</span>
        </div>
      ),
    },
  ];
}

/** Con qué quedó el servicio y qué se puede hacer con él. */
function delCierre(): Columna<ServicioFinalizado>[] {
  return [
    {
      clave: "estado",
      titulo: "Estado",
      render: (s) => <PillEstadoPedido estado={s.estado} />,
    },
    {
      clave: "accion",
      titulo: "",
      /*
       * "Ver detalle" va DESHABILITADO: la vista de detalle es la rebanada 6 y todavía
       * no existe. Un enlace a una ruta que no está rompería con un 404 y haría dudar
       * del dato que sí está en la fila; el texto apagado dice que falta la vista.
       */
      render: () => (
        <span
          aria-disabled="true"
          title="La vista de detalle todavía no existe"
          className="text-[13px] text-texto-3"
        >
          Ver detalle
        </span>
      ),
    },
  ];
}
