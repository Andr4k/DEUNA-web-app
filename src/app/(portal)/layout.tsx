import { redirect } from "next/navigation";

import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { obtenerSesion } from "@/lib/sesion-servidor";

/**
 * Shell del portal.
 *
 * Todo lo que comparten las pantallas vive acá: la barra lateral, la barra
 * superior y el contenedor del contenido. Cada `page.tsx` solo aporta su
 * contenido.
 *
 * La sesión se lee acá y baja por props: es el único punto donde el shell toca
 * la cookie, así que las pantallas y los componentes quedan sin saber de dónde
 * sale el usuario.
 *
 * El middleware ya garantizó que hay sesión para llegar hasta acá; este chequeo
 * cubre el caso del token que vence entre el middleware y el render, y le dice
 * al compilador que `sesion` no es nulo.
 */
export default async function PortalLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const sesion = await obtenerSesion();

  if (!sesion) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen bg-fondo">
      <Sidebar usuario={sesion.usuario} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar usuario={sesion.usuario} />
        <main className="grid content-start gap-4 p-6">{children}</main>
      </div>
    </div>
  );
}
