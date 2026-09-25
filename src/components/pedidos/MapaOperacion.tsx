"use client";

import { useEffect, useRef } from "react";
import * as L from "leaflet";

import "leaflet/dist/leaflet.css";

import { etiquetaDeEstado } from "@/components/ui/Pill";
import type { DatosMapa, DomiciliarioEnMapa } from "@/lib/tipos/mapa";

/**
 * Dibujo del mapa de la operación.
 *
 * Es una isla de cliente: Leaflet toca `window` al evaluarse, así que este módulo
 * no se carga nunca en el servidor — lo trae `MapaEnVivo` con `dynamic` y
 * `ssr: false`. No usa `react-leaflet` a propósito: el portal no tiene librerías
 * de componentes y Leaflet se maneja bien con sus propias primitivas.
 *
 * Los marcadores son `divIcon` con clases del portal en lugar de las imágenes por
 * defecto: esas últimas se resuelven por una ruta relativa que el bundler
 * reescribe, y además no siguen los tokens del tema.
 */

/** Vista inicial: Bogotá, donde opera la red. Es solo el encuadre de arranque; el
    primer punto con coordenadas lo reemplaza (ver el encuadre de abajo). */
const VISTA_INICIAL: L.LatLngTuple = [4.6097, -74.0817];
const ZOOM_INICIAL = 11;
const MAX_ZOOM_ENCUADRE = 15;

type ClaveMarca =
  | "domiciliario-libre"
  | "domiciliario-ocupado"
  | "domiciliario-sin-vigencia"
  | "pedido"
  | "restaurante";

/**
 * Un tipo de punto y cómo se ve.
 *
 * Es el ÚNICO lugar donde se decide la forma y el color de cada capa, y la
 * leyenda sale de acá: así el mapa y su leyenda no pueden contradecirse. El color
 * sale de los tokens del tema (`.marca-*` en `globals.css`), nunca de un hex.
 */
const MARCAS: Record<ClaveMarca, { clase: string; etiqueta: string }> = {
  "domiciliario-libre": { clase: "marca-libre", etiqueta: "Domiciliario libre" },
  "domiciliario-ocupado": { clase: "marca-ocupado", etiqueta: "Domiciliario ocupado" },
  "domiciliario-sin-vigencia": { clase: "marca-sin-vigencia", etiqueta: "Sin telemetría vigente" },
  pedido: { clase: "marca-pedido", etiqueta: "Punto de entrega" },
  restaurante: { clase: "marca-restaurante", etiqueta: "Restaurante" },
};

const ORDEN_LEYENDA: readonly ClaveMarca[] = [
  "domiciliario-libre",
  "domiciliario-ocupado",
  "domiciliario-sin-vigencia",
  "pedido",
  "restaurante",
];

interface Punto {
  tipo: ClaveMarca;
  lat: number;
  lng: number;
  texto: string;
}

export function MapaOperacion({ datos }: { datos: DatosMapa }) {
  const contenedor = useRef<HTMLDivElement | null>(null);
  const mapa = useRef<L.Map | null>(null);
  const capa = useRef<L.LayerGroup | null>(null);
  const encuadrado = useRef(false);

  useEffect(() => {
    const nodo = contenedor.current;
    if (!nodo || mapa.current) return;

    const instancia = L.map(nodo).setView(VISTA_INICIAL, ZOOM_INICIAL);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "Datos del mapa © colaboradores de OpenStreetMap",
    }).addTo(instancia);

    capa.current = L.layerGroup().addTo(instancia);
    mapa.current = instancia;

    return () => {
      instancia.remove();
      mapa.current = null;
      capa.current = null;
    };
  }, []);

  useEffect(() => {
    const capaActual = capa.current;
    const mapaActual = mapa.current;
    if (!capaActual || !mapaActual) return;

    capaActual.clearLayers();

    const puntos = puntosDe(datos);

    for (const punto of puntos) {
      L.marker([punto.lat, punto.lng], { icon: iconoDe(punto.tipo), title: punto.texto })
        .bindPopup(punto.texto)
        .addTo(capaActual);
    }

    // Encuadrar UNA sola vez: repetirlo en cada refresco volvería a saltar el mapa
    // al centro cada 10 s y no se podría mirar una zona con tranquilidad.
    if (!encuadrado.current && puntos.length > 0) {
      const coordenadas: L.LatLngTuple[] = puntos.map((punto) => [punto.lat, punto.lng]);
      mapaActual.fitBounds(L.latLngBounds(coordenadas), {
        padding: [24, 24],
        maxZoom: MAX_ZOOM_ENCUADRE,
      });
      encuadrado.current = true;
    }
  }, [datos]);

  return (
    <div className="relative">
      <div
        ref={contenedor}
        role="img"
        aria-label="Mapa de la operación: domiciliarios, pedidos y restaurantes"
        className="h-[340px] w-full rounded-control"
      />
      <Leyenda />
    </div>
  );
}

/** Todo lo que hay que dibujar, en un solo listado: las tres capas juntas. */
function puntosDe(datos: DatosMapa): Punto[] {
  return [
    ...datos.domiciliarios.map((domiciliario) => ({
      tipo: claveDeDomiciliario(domiciliario),
      lat: domiciliario.latitud,
      lng: domiciliario.longitud,
      texto: textoDeDomiciliario(domiciliario),
    })),
    ...datos.pedidos.map((pedido) => ({
      tipo: "pedido" as const,
      lat: pedido.latitud,
      lng: pedido.longitud,
      texto: `Pedido ${pedido.codigo} · ${etiquetaDeEstado(pedido.estado)}`,
    })),
    ...datos.restaurantes.map((restaurante) => ({
      tipo: "restaurante" as const,
      lat: restaurante.latitud,
      lng: restaurante.longitud,
      texto: `Restaurante ${restaurante.nombre}`,
    })),
  ];
}

/**
 * Qué marcador le toca al domiciliario.
 *
 * La vigencia manda sobre la ocupación: una posición vieja no dice nada del
 * estado actual de la entrega, así que se dibuja como "sin telemetría" y no como
 * libre u ocupado —eso sería afirmar algo que la telemetría no respalda.
 */
function claveDeDomiciliario(domiciliario: DomiciliarioEnMapa): ClaveMarca {
  if (!domiciliario.vigente) return "domiciliario-sin-vigencia";
  return domiciliario.ocupado ? "domiciliario-ocupado" : "domiciliario-libre";
}

function textoDeDomiciliario(domiciliario: DomiciliarioEnMapa): string {
  if (!domiciliario.vigente) return `${domiciliario.nombre} · sin telemetría vigente`;
  if (domiciliario.ocupado) {
    return `${domiciliario.nombre} · en ${domiciliario.servicioActualCodigo ?? "una entrega"}`;
  }
  return `${domiciliario.nombre} · libre`;
}

/** Marcador HTML. Sin `leaflet-div-icon`: su fondo blanco y su borde no van con el tema. */
function iconoDe(tipo: ClaveMarca): L.DivIcon {
  return L.divIcon({
    className: "",
    html: `<span class="marcador ${MARCAS[tipo].clase}"></span>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
    popupAnchor: [0, -10],
  });
}

/** Qué es cada marcador. Va sobre el mapa para no obligar a deducirlo. */
function Leyenda() {
  return (
    <div className="absolute bottom-3 left-3 z-[1000] rounded-control border border-borde bg-panel/95 px-3 py-2 shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
      <ul className="m-0 flex list-none flex-col gap-1.5 p-0">
        {ORDEN_LEYENDA.map((clave) => (
          <li key={clave} className="flex items-center gap-2 text-[11px] text-texto-2">
            <span className={`punto ${MARCAS[clave].clase}`} />
            {MARCAS[clave].etiqueta}
          </li>
        ))}
      </ul>
    </div>
  );
}
