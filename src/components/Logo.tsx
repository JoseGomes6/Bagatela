/** A Etiqueta: símbolo da Bagatela (etiqueta de preço com furo e um "b"). */
export function LogoMark({ size = 32, tag = "#6B46E5", className = "logo-svg" }: { size?: number; tag?: string; className?: string }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M6 0h13.5L32 12.5V26a6 6 0 0 1-6 6H6a6 6 0 0 1-6-6V6a6 6 0 0 1 6-6zM24.5 5.1a2.4 2.4 0 1 0 0 4.8 2.4 2.4 0 0 0 0-4.8z"
        fill={tag}
      />
      <rect x="8.5" y="7" width="4.2" height="18.5" rx="2.1" fill="#F7F2E9" />
      <circle cx="17" cy="19.5" r="5.1" fill="none" stroke="#FFD84D" strokeWidth="4.2" />
    </svg>
  );
}
