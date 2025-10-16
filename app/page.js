'use client'
import { useState, useMemo } from 'react'
import Inputs from '@/components/Inputs'
import RoofView from '@/components/RoofView'
import { packBest, area } from '@/lib/packing'

// Función para traducir estrategia técnica a una explicación simple
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

  return (
    <div className="container">
      <h1>¿Cuántos paneles caben?</h1>
      <p className="pill" title="Haz clic para calcular con diferentes medidas.">
        Información de demo técnica
      </p>

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
