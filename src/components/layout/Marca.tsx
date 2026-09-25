/**
 * Marca de DEUNA.
 *
 * Va en SVG para que escale y tome el color de marca; el día que exista el
 * logotipo definitivo se reemplaza solo este componente.
 */
export function Marca() {
  return (
    <svg width="34" height="34" viewBox="0 0 40 40" aria-hidden="true" className="shrink-0">
      <path
        d="M6 34V10a6 6 0 0 1 6-6h9c8 0 13 5 13 12s-5 12-13 12h-5v6z"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinejoin="round"
        className="text-acento"
      />
      <path d="M14 12h7c3.3 0 5 1.6 5 4s-1.7 4-5 4h-7z" className="fill-acento" />
    </svg>
  );
}
