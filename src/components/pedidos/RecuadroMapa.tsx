import { Suspense } from "react";

import { MapaEnVivo } from "@/components/pedidos/MapaEnVivo";
import { SelectorDomiciliario } from "@/components/pedidos/SelectorDomiciliario";
import { EstadoVacio } from "@/components/ui/EstadoVacio";
import { EsqueletoTarjeta } from "@/components/ui/Esqueleto";
import { Tarjeta } from "@/components/ui/Tarjeta";
import type { ResultadoCandidatos } from "@/lib/tipos/repartidor";

/**
 * Columna derecha de la pantalla: el mapa de la operación y, debajo, los
 * candidatos del pedido que se está asignando.
 *
 * El mapa es la isla de cliente `MapaEnVivo`, que pide las tres capas cada 10 s
 * contra la ruta del portal y las dibuja con Leaflet —Leaflet toca `window`, así
 * que no puede pasar por el servidor—. Acá solo se le da el marco: esta sección
 * es de servidor porque los candidatos llegan como promesa y una promesa no cruza
 * al navegador.
 *
 * Los candidatos se resuelven dentro de su propio `Suspense`. Si se esperaran
 * acá, elegir un pedido dejaría la sección entera esperando al backend —mapa
 * incluido— y el mapa que ya estaba en pantalla desaparecería un instante para
 * volver igual.
 */
export function RecuadroMapa({
  candidatos,
}: {
  candidatos: Promise<ResultadoCandidatos> | null;
}) {
  return (
    <div className="flex flex-col gap-4">
      <Tarjeta titulo="Mapa de la operación">
        <MapaEnVivo />
      </Tarjeta>

      <Suspense fallback={<EsqueletoTarjeta lineas={6} />}>
        {candidatos ? <Candidatos candidatos={candidatos} /> : <SinSeleccion />}
      </Suspense>
    </div>
  );
}

/** Candidatos del pedido elegido, ya resueltos. */
async function Candidatos({ candidatos }: { candidatos: Promise<ResultadoCandidatos> }) {
  const resultado = await candidatos;

  if (!resultado.ok) {
    return (
      <Tarjeta titulo="Domiciliarios candidatos">
        <EstadoVacio
          icono="info"
          titulo="No se pueden calcular los candidatos"
          descripcion={resultado.motivo}
        />
      </Tarjeta>
    );
  }

  const datos = resultado.datos;

  return (
    <Tarjeta titulo={`Candidatos para ${datos.codigo}`}>
      <SelectorDomiciliario datos={datos} />
    </Tarjeta>
  );
}

/** Sin pedido elegido no hay candidatos: se dice cómo elegir uno. */
function SinSeleccion() {
  return (
    <Tarjeta titulo="Domiciliarios candidatos">
      <EstadoVacio
        icono="moto"
        titulo="Elegí un pedido de la lista"
        descripcion="Al elegir “Asignar” en una fila, acá aparecen los domiciliarios que pueden tomarlo, con su distancia, su estado y el botón para confirmar."
      />
    </Tarjeta>
  );
}
