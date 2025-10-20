// Helpers
export const area = (w,h) => w*h

const floorDiv = (a,b) => Math.floor(a / b)

function makeGrid(x, y, pw, ph, margin=0) {
  const nx = floorDiv(x + margin, pw + margin)
  const ny = floorDiv(y + margin, ph + margin)
  const total = nx * ny
  const panels = []
  for (let iy=0; iy<ny; iy++) {
    for (let ix=0; ix<nx; ix++) {
      const px = ix * (pw + margin)
      const py = iy * (ph + margin)
      if (px + pw <= x + 1e-9 && py + ph <= y + 1e-9) {
        panels.push({ x: px, y: py, w: pw, h: ph })
      }
    }
  }
  return { total: panels.length, panels }
}

function bestPure(x,y,a,b,margin=0) {
  const p1 = makeGrid(x,y,a,b,margin)
  const p2 = makeGrid(x,y,b,a,margin)
  return (p2.total > p1.total)
    ? { ...p2, panelW:b, panelH:a, strategy: 'pura b×a' }
    : { ...p1, panelW:a, panelH:b, strategy: 'pura a×b' }
}

// Guillotine by rows: k rows with (a×b), rest with best pure
function mixByRows(x,y,a,b,margin=0) {
  let best = { total: -1 }
  // case 1: top with a×b, rest best pure
  const ny1 = floorDiv(y + margin, b + margin)
  const nx1 = floorDiv(x + margin, a + margin)
  for (let k=0; k<=ny1; k++) {
    const topH = k * (b + margin) - (k>0 ? margin : 0)
    const remH = y - topH
    if (topH < -1e-9 || remH < -1e-9) continue
    const top = makeGrid(x, topH, a, b, margin)
    const restPure1 = makeGrid(x, remH, a, b, margin)
    const restPure2 = makeGrid(x, remH, b, a, margin)
    const rest = (restPure2.total > restPure1.total) ? {...restPure2, panelW:b, panelH:a} : {...restPure1, panelW:a, panelH:b}
    const total = top.total + rest.total
    if (total > best.total) {
      const panels = [
        ...top.panels,
        ...rest.panels.map(p => ({...p, y: p.y + topH + (topH>0 && rest.panels.length>0 ? margin:0)}))
      ]
      best = { total, panels, panelW: rest.panelW, panelH: rest.panelH, strategy:`mixta filas (a×b arriba, resto mejor)` }
    }
  }
  // case 2: top with b×a, rest best pure
  const ny2 = floorDiv(y + margin, a + margin)
  const nx2 = floorDiv(x + margin, b + margin)
  for (let k=0; k<=ny2; k++) {
    const topH = k * (a + margin) - (k>0 ? margin : 0)
    const remH = y - topH
    const top = makeGrid(x, topH, b, a, margin)
    const restPure1 = makeGrid(x, remH, a, b, margin)
    const restPure2 = makeGrid(x, remH, b, a, margin)
    const rest = (restPure2.total > restPure1.total) ? {...restPure2, panelW:b, panelH:a} : {...restPure1, panelW:a, panelH:b}
    const total = top.total + rest.total
    if (total > best.total) {
      const panels = [
        ...top.panels,
        ...rest.panels.map(p => ({...p, y: p.y + topH + (topH>0 && rest.panels.length>0 ? margin:0)}))
      ]
      best = { total, panels, panelW: rest.panelW, panelH: rest.panelH, strategy:`mixta filas (b×a arriba, resto mejor)` }
    }
  }
  return best
}

// Guillotine by columns
function mixByCols(x,y,a,b,margin=0) {
  let best = { total: -1 }
  // left with a×b, rest best pure
  const nx1 = floorDiv(x + margin, a + margin)
  for (let k=0; k<=nx1; k++) {
    const leftW = k * (a + margin) - (k>0 ? margin : 0)
    const remW = x - leftW
    const left = makeGrid(leftW, y, a, b, margin)
    const restPure1 = makeGrid(remW, y, a, b, margin)
    const restPure2 = makeGrid(remW, y, b, a, margin)
    const rest = (restPure2.total > restPure1.total) ? {...restPure2, panelW:b, panelH:a} : {...restPure1, panelW:a, panelH:b}
    const total = left.total + rest.total
    if (total > best.total) {
      const panels = [
        ...left.panels,
        ...rest.panels.map(p => ({...p, x: p.x + leftW + (leftW>0 && rest.panels.length>0 ? margin:0)}))
      ]
      best = { total, panels, panelW: rest.panelW, panelH: rest.panelH, strategy:`mixta columnas (a×b izquierda, resto mejor)` }
    }
  }
  // left with b×a
  const nx2 = floorDiv(x + margin, b + margin)
  for (let k=0; k<=nx2; k++) {
    const leftW = k * (b + margin) - (k>0 ? margin : 0)
    const remW = x - leftW
    const left = makeGrid(leftW, y, b, a, margin)
    const restPure1 = makeGrid(remW, y, a, b, margin)
    const restPure2 = makeGrid(remW, y, b, a, margin)
    const rest = (restPure2.total > restPure1.total) ? {...restPure2, panelW:b, panelH:a} : {...restPure1, panelW:a, panelH:b}
    const total = left.total + rest.total
    if (total > best.total) {
      const panels = [
        ...left.panels,
        ...rest.panels.map(p => ({...p, x: p.x + leftW + (leftW>0 && rest.panels.length>0 ? margin:0)}))
      ]
      best = { total, panels, panelW: rest.panelW, panelH: rest.panelH, strategy:`mixta columnas (b×a izquierda, resto mejor)` }
    }
  }
  return best
}

export function packBest({ x, y, a, b, margin=0 }) {
  // Validación
  if (a<=0 || b<=0 || x<=0 || y<=0) throw new Error('Dimensiones deben ser > 0')
  // Prueba la colocación “pura” en ambas orientaciones.
  let best = bestPure(x,y,a,b,margin)
  // Prueba combinaciones por filas
  const rows = mixByRows(x,y,a,b,margin)
  if (rows.total > best.total) best = rows
  // Prueba combinaciones por columnas
  const cols = mixByCols(x,y,a,b,margin)
  if (cols.total > best.total) best = cols
  return best
}
