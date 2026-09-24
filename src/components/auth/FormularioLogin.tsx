"use client";

import { useActionState } from "react";

import { iniciarSesion, type EstadoLogin } from "@/app/login/actions";
import { Aviso } from "@/components/ui/Aviso";
import { Boton } from "@/components/ui/Boton";
import { Campo } from "@/components/ui/Campo";

/**
 * Formulario de acceso.
 *
 * Es cliente porque hay que mostrar el estado de "entrando…" y el error, pero no
 * hace la petición: la Server Action se encarga, así que la contraseña va del
 * formulario al servidor y no queda en el navegador.
 */
export function FormularioLogin({ destino }: { destino: string }) {
  const [estado, enviar, enviando] = useActionState<EstadoLogin, FormData>(iniciarSesion, {});

  return (
    <form action={enviar} className="flex flex-col gap-4">
      {estado.error ? <Aviso tono="error">{estado.error}</Aviso> : null}

      <Campo
        nombre="email"
        etiqueta="Correo"
        type="email"
        autoComplete="username"
        placeholder="tu@correo.com"
        required
        autoFocus
        disabled={enviando}
      />

      <Campo
        nombre="password"
        etiqueta="Contraseña"
        type="password"
        autoComplete="current-password"
        placeholder="••••••••"
        required
        disabled={enviando}
      />

      {/* A dónde volver después de entrar. Lo pone el middleware. */}
      <input type="hidden" name="destino" value={destino} />

      <Boton type="submit" variante="primario" disabled={enviando} className="mt-1 w-full justify-center">
        {enviando ? "Entrando…" : "Entrar"}
      </Boton>
    </form>
  );
}
