import { ActividadReciente } from "@/components/panel/ActividadReciente";
import { AlertasAtencion } from "@/components/panel/AlertasAtencion";
import { Indicadores } from "@/components/panel/Indicadores";
import { Rendimiento } from "@/components/panel/Rendimiento";
import { ResumenOperativo } from "@/components/panel/ResumenOperativo";
import { UltimosPedidos } from "@/components/panel/UltimosPedidos";
import { Boton } from "@/components/ui/Boton";
import { Icono } from "@/components/ui/Icono";
import { Tarjeta } from "@/components/ui/Tarjeta";

/**
 * Panel principal del administrador.
 *
 * Las secciones viven en `components/panel/`: esta pantalla solo las ordena en
 * las filas del layout. Cuando la API esté conectada, cada sección recibe sus
 * datos por props y esta página los pide (o los deja a un componente servidor).
 */
export default function PanelPrincipal() {
  return (
    <>
      <Indicadores />
      <AlertasAtencion />
      <ResumenOperativo />

      <div className="grid gap-4 xl:grid-cols-[2fr_1fr]">
        <UltimosPedidos />
        <ActividadReciente />
      </div>

      <div className="grid gap-4 xl:grid-cols-[2fr_1fr]">
        <Rendimiento />

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
