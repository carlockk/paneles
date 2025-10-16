'use client'
import { useState, useMemo, useRef, useEffect } from 'react'
import Inputs from '@/components/Inputs'
import RoofView from '@/components/RoofView'
import { packBest, area } from '@/lib/packing'

// Traduce el texto técnico de la estrategia a lenguaje simple
function explainStrategy(strategy) {
  if (!strategy) return ''
  if (strategy.includes('pura a×b')) return 'Todos los paneles colocados sin girar.'
  if (strategy.includes('pura b×a')) return 'Todos los paneles colocados girados 90°.'
  if (strategy.includes('mixta filas')) return 'Combinación por filas: arriba los paneles normales y abajo los rotados donde encajan mejor.'
  if (strategy.includes('mixta columnas')) return 'Combinación por columnas: a la izquierda los paneles normales y en el resto los rotados.'
  return strategy
}

export default function Page() {
  const [params, setParams] = useState({ x: 5, y: 3, a: 1, b: 2 })
  const [solution, setSolution] = useState(null)

  // Estado del tooltip
  const [openTip, setOpenTip] = useState(false)
  const tipRef = useRef(null)
  const pillRef = useRef(null)

  const onCalculate = (p) => {
    setParams(p)
    try {
      const sol = packBest(p)
      setSolution(sol)
    } catch (e) {
      console.error(e)
      alert('Error en el cálculo: ' + e.message)
    }
  }

  const occupancy = useMemo(() => {
    if (!solution) return null
    const roofArea = area(params.x, params.y)
    const panelsArea = solution.total * area(solution.panelW, solution.panelH)
    return (panelsArea / roofArea) * 100
  }, [solution, params])

  // Cerrar tooltip con Escape y clic fuera + toggle con Enter/Espacio
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') setOpenTip(false)
      if ((e.key === 'Enter' || e.key === ' ') && document.activeElement === pillRef.current) {
        e.preventDefault()
        setOpenTip(v => !v)
      }
    }
    function onClickOutside(e) {
      if (!openTip) return
      if (tipRef.current && !tipRef.current.contains(e.target) && pillRef.current && !pillRef.current.contains(e.target)) {
        setOpenTip(false)
      }
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onClickOutside)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('mousedown', onClickOutside)
    }
  }, [openTip])

  return (
    <div className="container">
      <h1>¿Cuántos paneles caben?</h1>

      {/* tooltip */}
      <span
        ref={pillRef}
        className="pill"
        role="button"
        tabIndex={0}
        aria-expanded={openTip}
        aria-controls="demo-tooltip"
        onClick={() => setOpenTip(v => !v)}
        style={{ position: 'relative', display: 'inline-block', cursor: 'pointer' }}
        title={!openTip ? 'Haz clic para ver explicación' : undefined}
      >
      Información de demo técnica
      </span>

      {openTip && (
        <div
          id="demo-tooltip"
          ref={tipRef}
          role="dialog"
          aria-label="Explicación de la demo técnica"
          style={{
            position: 'absolute',
            marginTop: 8,
            zIndex: 20,
            maxWidth: 520,
            background: 'var(--card)',
            color: 'var(--ink)',
            border: '1px solid var(--border)',
            borderRadius: 12,
            boxShadow: '0 8px 24px rgba(0,0,0,.08)',
            padding: 16
          }}
        >
          {/* explicacion en el tooltip */}
          <p style={{ marginTop: 0, marginBottom: 8 }}>
            Ingresa las medidas del techo (<b>x</b> e <b>y</b>) y del panel (<b>a</b> y <b>b</b>).
            Calcula la <b>máxima cantidad</b> de paneles que caben, pudiendo girarlos 90° si conviene.
          </p>
          <ul style={{ margin: '0 0 8px 18px' }}>
            <li>Prueba varias formas: todos sin girar, todos girados y combinaciones por filas/columnas.</li>
            <li>Muestra el total y un dibujo superior sin solapes.</li>
            <li>No uso unidades: sólo importo que todas las medidas estén en la misma escala.</li>
          </ul>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn" onClick={() => setOpenTip(false)}>Entendido</button>
          </div>
        </div>
      )}

      <div className="row" style={{marginTop:16}}>
        <div className="col-6">
          <div className="card">
            <Inputs initial={params} onCalculate={onCalculate} />
          </div>
          {solution && (
            <div className="card" style={{marginTop:12}}>
              <h3>Resultados</h3>
              <div className="stats">
                <span className="pill">Paneles: <strong>{solution.total}</strong></span>
                <span className="pill">Ocupación aprox.: {occupancy?.toFixed(1)}%</span>
              </div>
              <p style={{marginTop:12, color:'var(--muted)'}}>
                <b>Estrategia usada:</b> {explainStrategy(solution.strategy)}
              </p>
            </div>
          )}
        </div>
        <div className="col-6">
          <div className="card grid">
            <RoofView roof={{w: params.x, h: params.y}} panels={solution?.panels || []} />
          </div>
        </div>
      </div>
    </div>
  )
}
