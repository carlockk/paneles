# ¿Cuántos paneles caben? (Next.js)

Pequeña app que calcula y dibuja cuántos paneles rectangulares `a×b` caben dentro de un techo `x×y`. 
Permite **rotar** los paneles y usa una **heurística guillotina** (filas/columnas) además de las dos orientaciones puras.

## Algoritmo (resumen)

1. **Puras**: probamos todo `a×b` y todo `b×a`.
2. **Mixtas por filas**: tomamos `k` filas superiores con una orientación y llenamos el resto con la mejor orientación pura.
3. **Mixtas por columnas**: igual idea, partiendo el ancho.
4. De todas las variantes, elegimos la que **maximiza** el número de paneles y generamos un **layout** con coordenadas.

## Ejecutar en local

Requisitos: Node.js 18+ (o 20+). En Windows PowerShell:

```powershell
# Clonar o descomprimir el proyecto
cd ruuf-panels-next

# Instalar dependencias
npm install   # (o pnpm install / yarn)

# Desarrollo
npm run dev
# abrir http://localhost:3000

# Producción
npm run build
npm start
```

## Uso

1. Ingresa `x`, `y` del techo; `a`, `b` del panel; y **margen** opcional (misma unidad).
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
```

## Despliegue recomendado

- **Vercel** (nativo para Next.js): conecta tu repo, `npm run build` y listo.
- Alternativa: **Netlify** con Next Runtime.

Instrucciones rápidas (Vercel):
1. Sube este proyecto a GitHub (o GitLab/Bitbucket).
2. Entra a [vercel.com](https://vercel.com), **New Project** → importa el repo.
3. Framework: *Next.js*, comando de build: `npm run build`.
4. Deploy. Fin.

## Extensiones posibles

- Márgenes distintos en X/Y.
- Zonas no utilizables del techo (obstáculos) subdividiendo en regiones.
- Comparador de soluciones (pura vs mixta).
- Exportar a SVG/PNG.
