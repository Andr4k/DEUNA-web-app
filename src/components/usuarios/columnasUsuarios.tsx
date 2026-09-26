import { CeldaSinDato, CeldaZonas, PillEstadoUsuario } from "@/components/usuarios/celdasUsuario";
import { SIN_DATO, ultimoAccesoDe } from "@/components/usuarios/valoresUsuario";
import type { Columna } from "@/components/ui/Tabla";
import type { Usuario } from "@/lib/tipos/usuarios";

/**
 * Las seis columnas del listado, en el orden del diseño.
 *
 * Están partidas en dos bloques —qué cuenta es y cómo entra— porque las seis juntas no
 * entran en el límite de líneas por función, y porque cada bloque responde una pregunta
 * distinta del operador: quién es y con qué permisos entra. El orden de la concatenación
 * ES el orden de la tabla: leer de arriba abajo es leer de izquierda a derecha.
 *
 * Vive en su propio archivo y no dentro de la lista: la lista compone, las columnas
 * definen qué se ve. Las celdas que dibujan algo más que texto —el pill del estado, las
 * zonas y el dato que falta— están en `celdasUsuario.tsx`.
 *
 * Las dos columnas que pueden venir en `null` —el nivel de acceso y el último acceso—
 * dicen "Sin dato" y no un guion ni una fecha: el último acceso de la cuenta que nunca
 * entró es justamente el dato que el operador viene a buscar —el 6% de las cuentas
 * reales nunca entró—, y dejarlo en blanco lo haría indistinguible de una celda sin
 * cargar.
 */
export function columnasUsuarios(): Columna<Usuario>[] {
  return [...deLaCuenta(), ...delAcceso()];
}

/** Quién es: el nombre con su email, de qué tipo es y qué zonas tiene asignadas. */
function deLaCuenta(): Columna<Usuario>[] {
  return [
    {
      clave: "usuario",
      titulo: "Usuario",
      render: (u) => (
        <div className="flex flex-col">
          <span className="font-semibold">{u.nombre}</span>
          <span className="text-[12px] text-texto-3">{u.email}</span>
        </div>
      ),
    },
    {
      clave: "tipo",
      titulo: "Tipo",
      /* El valor del backend tal cual: es el mismo vocabulario del filtro de la barra. */
      render: (u) => u.tipo,
    },
    {
      clave: "zonas",
      titulo: "Zonas asignadas",
      render: (u) => <CeldaZonas zonas={u.zonas} />,
    },
  ];
}

/** Cómo entra: si la cuenta está habilitada, con qué nivel y cuándo entró por última vez. */
function delAcceso(): Columna<Usuario>[] {
  return [
    {
      clave: "estado",
      titulo: "Estado",
      render: (u) => <PillEstadoUsuario estado={u.estado} />,
    },
    {
      clave: "nivel",
      titulo: "Nivel de acceso",
      /*
       * El nivel es texto libre del backend: se muestra tal cual, sin traducir. Cuando no
       * está asignado se lee "Sin dato" en lugar de "Ninguno", que afirmaría que se le
       * negó el acceso a propósito.
       */
      render: (u) =>
        u.nivelAcceso === null ? <CeldaSinDato>{SIN_DATO}</CeldaSinDato> : u.nivelAcceso,
    },
    {
      clave: "ultimoAcceso",
      titulo: "Último acceso",
      render: (u) =>
        u.ultimoAcceso === null ? (
          <CeldaSinDato>{SIN_DATO}</CeldaSinDato>
        ) : (
          <span className="text-[12px] text-texto-2">{ultimoAccesoDe(u.ultimoAcceso)}</span>
        ),
    },
  ];
}
