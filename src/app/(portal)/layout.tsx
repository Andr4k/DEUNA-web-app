import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";

/**
 * Shell del portal.
 *
 * Todo lo que comparten las pantallas vive acá: la barra lateral, la barra
 * superior y el contenedor del contenido. Cada `page.tsx` solo aporta su
 * contenido, que se acomoda en las filas del layout (`fila--kpi`, etc. en el
 * mockup; en Tailwind, `grid gap-4` con las columnas que correspondan).
 */
export default function PortalLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-screen bg-fondo">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        <main className="grid content-start gap-4 p-6">{children}</main>
      </div>
    </div>
  );
}
