'use client'
import { useMemo } from 'react'

export default function RoofView({ roof, panels, margin = 0 }) {
  // Calcula escala para que el techo siempre quepa en el SVG con padding
  const { vbW, vbH, scale, pad } = useMemo(() => {
    const pad = 10; // padding visual en px del viewBox
    // Escala proporcional para que w x h quepa en un área "cómoda"
    const maxW = 960 - pad * 2;
    const maxH = 640 - pad * 2;
    const s = Math.min(maxW / roof.w, maxH / roof.h);
    const vbW = Math.max(roof.w * s + pad * 2, 420);
    const vbH = Math.max(roof.h * s + pad * 2, 320);
    return { vbW, vbH, scale: s, pad };
  }, [roof]);

  const roofW = roof.w * scale;
  const roofH = roof.h * scale;

  return (
    <svg
      viewBox={`0 0 ${Math.round(vbW)} ${Math.round(vbH)}`}
      width="100%"
      height="100%"
      role="img"
      aria-label="Vista superior del techo y paneles"
    >
      <g transform={`translate(${pad}, ${pad})`}>
        {/* Techo en modo claro: fondo blanco, borde gris suave */}
        <rect
          x="0"
          y="0"
          width={roofW}
          height={roofH}
          fill="#ffffff"
          stroke="#cbd5e1"           /* slate-300 */
          vectorEffect="non-scaling-stroke"
          strokeWidth="1.25"
          rx="6"
        />

        {/* Paneles: SIN relleno, SOLO línea roja */}
        {panels.map((p, i) => (
          <rect
            key={i}
            x={p.x * scale}
            y={p.y * scale}
            width={p.w * scale}
            height={p.h * scale}
            fill="none"
            stroke="#ef4444"          /* red-500 */
            vectorEffect="non-scaling-stroke"
            strokeWidth="1.5"
            rx="2"
          />
        ))}
      </g>
    </svg>
  );
}
