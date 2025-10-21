# ¿Cuántos paneles caben? (Next.js)

Pequeña app que calcula y dibuja cuántos paneles rectangulares `a×b` caben dentro de un techo `x×y`. 
Permite **rotar** los paneles y usa una **heurística guillotina** (filas/columnas) además de las dos orientaciones puras.

## Algoritmo (resumen)

1. **Puras**: probamos todo `a×b` y todo `b×a`.
2. **Mixtas por filas**: tomamos `k` filas superiores con una orientación y llenamos el resto con la mejor orientación pura.
3. **Mixtas por columnas**: igual idea, partiendo el ancho.
4. De todas las variantes, elegimos la que **maximiza** el número de paneles y generamos un **layout** con coordenadas.

## Uso

1. Ingresa `x`, `y` del techo; `a`, `b` del panel; (misma unidad).
2. Presiona **Calcular**.
3. Se muestra el **total** y el **dibujo** (SVG) con los paneles colocados.

## Estructura

```
/app
  layout.js
  page.js            # UI principal
/components
  Inputs.jsx         # formulario controlado
  RoofView.jsx       # dibujo SVG
/lib
  packing.js         # algoritmo de colocación
/styles
  globals.css        # estilos mínimos

