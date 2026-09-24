"use client";

import { usePathname } from "next/navigation";

import { Avatar } from "@/components/ui/Avatar";
import { Boton } from "@/components/ui/Boton";
import { Icono } from "@/components/ui/Icono";
import { fechaLarga } from "@/lib/formato";
import { NAVEGACION } from "@/lib/navegacion";
import { USUARIO_ACTUAL } from "@/lib/sesion";

/**
 * Barra superior.
 *
 * El título sale de la ruta: la pantalla de inicio saluda, el resto muestra el
 * nombre de la sección. Así ninguna página repite su encabezado.
 */
export function Topbar() {
  const ruta = usePathname();
  const esInicio = ruta === "/";
  const item = NAVEGACION.flatMap((s) => s.items).find((i) => i.href === ruta);

  const titulo = esInicio ? `¡Bienvenido, ${primerNombre(USUARIO_ACTUAL.nombre)}!` : (item?.etiqueta ?? "DEUNA");
  const subtitulo = esInicio ? `Así está DEUNA hoy, ${fechaLarga(new Date())}.` : undefined;

  return (
    <header className="sticky top-0 z-10 flex h-[72px] items-center justify-between gap-4 border-b border-borde bg-fondo px-6">
      <div>
        <h1 className="m-0 text-2xl font-bold">{titulo}</h1>
        {subtitulo ? <p className="mt-0.5 text-sm text-texto-2">{subtitulo}</p> : null}
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          className="inline-flex items-center gap-2.5 rounded-control border border-borde px-3.5 py-2 text-[13px] transition-colors hover:bg-panel"
        >
          <Icono nombre="calendario" />
          <span>Hoy, {fechaLarga(new Date())}</span>
          <Icono nombre="chevron" tamano={15} />
        </button>

        <button
          type="button"
          aria-label="Notificaciones"
          className="relative inline-flex text-texto-2 transition-colors hover:text-texto"
        >
          <Icono nombre="campana" tamano={22} />
          <span className="absolute -top-1.5 -right-2 inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-acento px-1.5 text-[11px] font-bold text-fondo">
            9
          </span>
        </button>

        <div className="flex items-center gap-2.5">
          <Avatar tamano={32} />
          <div>
            <div className="text-[13px] font-semibold">{USUARIO_ACTUAL.nombre}</div>
            <div className="text-xs text-texto-2">{USUARIO_ACTUAL.rol}</div>
          </div>
        </div>

        <Boton variante="acento">
          <Icono nombre="mas" />
          Nuevo usuario
        </Boton>
      </div>
    </header>
  );
}

function primerNombre(nombreCompleto: string): string {
  return nombreCompleto.split(" ")[0];
}
