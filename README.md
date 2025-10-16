# ¿Cuántos paneles caben?

Este proyecto es una **pequeña app hecha con Next.js y React** que calcula cuántos paneles solares rectangulares pueden caber dentro de un techo rectangular.

La idea es simple: escribes las medidas del **techo** (ancho y alto) y las del **panel** (ancho y alto), y la app te muestra:
- Cuántos paneles caben como máximo.
- Qué tipo de distribución se usó.
- Un dibujo en pantalla mostrando cómo se acomodan.

---

## Qué hace exactamente

El programa prueba varias formas de acomodar los paneles dentro del techo:

1. Todos los paneles colocados **sin girar**.  
2. Todos los paneles colocados **girados 90°**.  
3. Una **combinación por filas o columnas**, donde se mezclan paneles normales y rotados para aprovechar mejor el espacio.

Después elige la que **da más paneles** y la muestra gráficamente.

No hay unidades (metros, centímetros, etc.), solo números.  
El cálculo funciona mientras todas las medidas estén en la **misma unidad**.

---

## Cómo usarlo
Por defecto tiene las medidas sugeridas en el ejemplo.
1. Ingresa:
   - Ancho del techo (x)  
   - Alto del techo (y)  
   - Ancho del panel (a)  
   - Alto del panel (b)

2. Presiona **Calcular**.

3. Verás el número máximo de paneles que caben, el porcentaje de ocupación del techo y una explicación en palabras simples del tipo de acomodo.

También puedes hacer clic en el texto **“Demo técnica”** para ver un pequeño resumen de cómo funciona el sistema.

---

## Cómo ejecutarlo en tu computador
Lo subí a **Vercel** asi que es de simple acceso
https://paneles-gold.vercel.app/
