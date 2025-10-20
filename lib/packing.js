// Calculo el área de un rectángulo, simplemente multiplicando ancho por alto.
export const area = (w,h) => w*h
//División entera hacia abajo (como un "div" matemático), útil para saber cuántas veces cabe algo.
const floorDiv = (a,b) => Math.floor(a / b)

/**
 * Esta función genera una “grilla” de paneles en el área disponible del techo.
 * Recibe el tamaño del techo (x, y), el tamaño de los paneles (pw, ph) y el margen entre ellos.
 * Devuelvo cuántos paneles entran y la posición de cada uno (como objeto para poder dibujarlo).
 */
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

/**
 * Esta función prueba las dos formas "puras" de acomodar paneles:
 * Todos horizontales (a×b) o todos verticales (b×a).
 * Devuelvo la opción con más paneles y su orientación.
 */
function bestPure(x,y,a,b,margin=0) {
  const p1 = makeGrid(x,y,a,b,margin)
  const p2 = makeGrid(x,y,b,a,margin)
  return (p2.total > p1.total)
    ? { ...p2, panelW:b, panelH:a, strategy: 'pura b×a' }
    : { ...p1, panelW:a, panelH:b, strategy: 'pura a×b' }
}

/**
 * Esta función mezcla filas para aprovechar mejor el espacio del techo.
 * Prueba distintas cantidades de filas acomodadas en una orientación (arriba) y el resto en la mejor combinación posible.
 * Devuelvo la variante que más paneles logra acomodar.
 */
function mixByRows(x,y,a,b,margin=0) {
  let best = { total: -1 }
  // // Caso 1: filas superiores con panel a×b, resto acomodado de la mejor forma posible
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
      // Ajusto las posiciones de los paneles del área inferior sumando la altura de las filas superiores.
      const panels = [
        ...top.panels,
        ...rest.panels.map(p => ({...p, y: p.y + topH + (topH>0 && rest.panels.length>0 ? margin:0)}))
      ]
      best = { total, panels, panelW: rest.panelW, panelH: rest.panelH, strategy:`mixta filas (a×b arriba, resto mejor)` }
    }
  }
  // Caso 2: filas superiores con panel b×a (rotado), resto mejor forma posible
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

/**
 * Mezcla por columnas: pruebo separar áreas a la izquierda con paneles en una orientación,
 * y el área derecha la lleno usando la mejor combinación posible.
 */
function mixByCols(x,y,a,b,margin=0) {
  let best = { total: -1 }
 // Lado izquierdo con panel a×b
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
      // Ajusto la posición en X de los paneles que van a la derecha
      const panels = [
        ...left.panels,
        ...rest.panels.map(p => ({...p, x: p.x + leftW + (leftW>0 && rest.panels.length>0 ? margin:0)}))
      ]
      best = { total, panels, panelW: rest.panelW, panelH: rest.panelH, strategy:`mixta columnas (a×b izquierda, resto mejor)` }
    }
  }
   // Lado izquierdo con panel b×a (rotado)
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

/**
 * Esta es la función principal que exporto y uso en la aplicación.
 * Valida que las dimensiones sean correctas.
 * Llama a bestPure, mixByRows y mixByCols para calcular todas las combinaciones posibles,
 * y retorna la mejor opción (la que más paneles permite).
 */
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
