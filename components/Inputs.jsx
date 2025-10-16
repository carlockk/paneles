'use client'
import { useState } from 'react'

export default function Inputs({ initial, onCalculate }) {
  const [x, setX] = useState(initial.x)
  const [y, setY] = useState(initial.y)
  const [a, setA] = useState(initial.a)
  const [b, setB] = useState(initial.b)

  const handleSubmit = (e) => {
    e.preventDefault()
    const vals = { x: +x, y: +y, a: +a, b: +b }
    if ([vals.x, vals.y, vals.a, vals.b].some(v => !(v > 0))) {
      alert('Todas las dimensiones deben ser números positivos.')
      return
    }
    onCalculate(vals)
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="row">
        <div className="col-6">
          <div className="field">
            <label>Ancho techo (x)</label>
            <input inputMode="decimal" value={x} onChange={e=>setX(e.target.value)} />
          </div>
        </div>
        <div className="col-6">
          <div className="field">
            <label>Alto techo (y)</label>
            <input inputMode="decimal" value={y} onChange={e=>setY(e.target.value)} />
          </div>
        </div>
        <div className="col-6">
          <div className="field">
            <label>Ancho panel (a)</label>
            <input inputMode="decimal" value={a} onChange={e=>setA(e.target.value)} />
          </div>
        </div>
        <div className="col-6">
          <div className="field">
            <label>Alto panel (b)</label>
            <input inputMode="decimal" value={b} onChange={e=>setB(e.target.value)} />
          </div>
        </div>
      </div>
      <div style={{marginTop:12, display:'flex', gap:8}}>
        <button className="btn" type="submit">Calcular</button>
        <span className="pill">Se permiten rotaciones y mezcla por filas/columnas.</span>
      </div>
    </form>
  )
}
