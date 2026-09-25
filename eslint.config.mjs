import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

/**
 * Reglas de arquitectura del portal.
 *
 * La convención está acá y no solo en el README a propósito: una regla que
 * depende de que alguien se acuerde se rompe en la tercera pantalla. Estas
 * hacen fallar el build.
 */
const MAX_LINEAS_ARCHIVO = 120;
const MAX_LINEAS_FUNCION = 60;

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "mockups/**",
    ],
  },

  // --- Tamaño ---------------------------------------------------------------
  // Aplica a donde vive la UI y la lógica. `lib/` queda afuera de `max-lines`
  // porque ahí viven listas de datos (el mapa de iconos, la navegación) que son
  // largas por naturaleza y no se parten sin perder legibilidad. Sus funciones
  // sí están cubiertas por `max-lines-per-function`.
  {
    files: ["src/components/**/*.{ts,tsx}", "src/services/**/*.ts", "src/app/**/*.{ts,tsx}"],
    rules: {
      "max-lines": [
        "error",
        { max: MAX_LINEAS_ARCHIVO, skipBlankLines: true, skipComments: true },
      ],
      "max-depth": ["error", 3],
      "max-params": ["error", 4],
    },
  },
  {
    // Una función que no entra en una pantalla es una función que hace dos cosas.
    files: ["src/**/*.{ts,tsx}"],
    rules: {
      "max-lines-per-function": [
        "error",
        { max: MAX_LINEAS_FUNCION, skipBlankLines: true, skipComments: true },
      ],
      // Un parámetro con guion bajo es "a propósito sin usar": documenta un
      // contrato que todavía no se consume (los servicios que esperan endpoints).
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },

  // --- Dependencias entre capas --------------------------------------------
  {
    // La presentación no pide datos: los recibe.
    files: ["src/components/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/services", "@/services/*"],
              message:
                "Los componentes no acceden a la API: reciben props. El acceso a datos vive en src/services/ y lo usan las páginas (servidor).",
            },
          ],
        },
      ],
    },
  },
  {
    // La capa de datos no conoce la UI.
    files: ["src/services/**/*.ts"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/components", "@/components/*", "@/app/*"],
              message:
                "Un servicio no puede depender de la UI ni de una página. Devuelve datos y nada más.",
            },
          ],
        },
      ],
    },
  },
];

export default eslintConfig;
