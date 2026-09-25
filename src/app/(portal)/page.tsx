import { Suspense } from "react";
import { redirect } from "next/navigation";

import { ActividadReciente } from "@/components/panel/ActividadReciente";
import { AlertasAtencion } from "@/components/panel/AlertasAtencion";
import { Indicadores } from "@/components/panel/Indicadores";
import { Rendimiento } from "@/components/panel/Rendimiento";
import { ResumenOperativo } from "@/components/panel/ResumenOperativo";
import { UltimosPedidos } from "@/components/panel/UltimosPedidos";
import { Boton } from "@/components/ui/Boton";
import { EsqueletoTarjeta } from "@/components/ui/Esqueleto";
import { Icono } from "@/components/ui/Icono";
import { Tarjeta } from "@/components/ui/Tarjeta";
import { obtenerToken } from "@/lib/sesion-servidor";
import { metricasService } from "@/services/metricas.service";

/**
 * Panel principal del administrador.
 *
 * Las cuatro llamadas arrancan acá y **no se esperan**: cada sección recibe la
 * promesa y la espera dentro de su propio límite de Suspense. Eso es lo que hace que
 * el panel no cargue de una sola vez — el armazón aparece al instante y cada sección
 * se rellena cuando llega su dato, sin que la más lenta frene a las demás.
 *
 * Ninguna sección pide datos por su cuenta: la página es la única que conoce el
 * servicio, y los componentes reciben lo que necesitan. Es la regla de la capa de
 * presentación, y ESLint la sostiene.
 */
export default async function PanelPrincipal() {
  const token = await obtenerToken();

  // El middleware ya garantiza la sesión; esto cubre el token que vence entre el
  // middleware y el render, y le dice al compilador que hay token.
  if (!token) {
    redirect("/login");
  }

  const panel = metricasService.panel(token);
  const zonas = metricasService.zonas(token);
  const rendimiento = metricasService.rendimiento(token);
  const actividad = metricasService.actividad(token);

  return (
    <>
      <Suspense fallback={<FilaKpi />}>
        <Indicadores datos={panel} />
      </Suspense>

      <Suspense fallback={<EsqueletoTarjeta lineas={2} />}>
        <AlertasAtencion datos={panel} />
      </Suspense>

      <Suspense fallback={<EsqueletoTarjeta lineas={4} />}>
        <ResumenOperativo panel={panel} zonas={zonas} />
      </Suspense>

      <div className="grid gap-4 xl:grid-cols-[2fr_1fr]">
        <UltimosPedidos />
        <Suspense fallback={<EsqueletoTarjeta lineas={5} />}>
          <ActividadReciente eventos={actividad} />
        </Suspense>
      </div>

      <div className="grid gap-4 xl:grid-cols-[2fr_1fr]">
        <Suspense fallback={<EsqueletoTarjeta lineas={3} />}>
          <Rendimiento rendimiento={rendimiento} />
        </Suspense>

        <Tarjeta titulo="Cierre del día">
          <div className="flex h-full flex-col justify-between gap-3">
            <p className="text-[13px] text-texto-2">
              Revisa el cierre financiero, cartera de restaurantes y liquidación de domiciliarios.
            </p>
            <Boton variante="primario" grande>
              <span className="flex items-center gap-2.5">
                <Icono nombre="dolar" tamano={22} />
                Ir a Cierre del día
              </span>
              <Icono nombre="flecha" />
            </Boton>
          </div>
        </Tarjeta>
      </div>

      <p className="flex items-center justify-center gap-2 py-2 text-xs text-texto-3">
        <Icono nombre="info" tamano={15} />
        Los datos se actualizan automáticamente cada 5 minutos.
      </p>
    </>
  );
}

/** Esqueleto con la forma de la fila de indicadores, para el primer pintado. */
function FilaKpi() {
  return (
    <div className="grid gap-4 xl:grid-cols-[repeat(4,1fr)_1.3fr]">
      {Array.from({ length: 5 }, (_, indice) => (
        <EsqueletoTarjeta key={indice} lineas={2} />
      ))}
    </div>
  );
}
