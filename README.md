# ¿Cuántos paneles caben?
Hecho con NextJS y React.
No se utilizó bases de datos no era necesario.
no se utilizaron imagenes, solo estiños css con tailwind.

¿Cómo funciona esta aplicación?
Esta aplicación calcula de forma automática la cantidad máxima de paneles solares rectangulares que pueden ser instalados en un techo también rectangular. El usuario ingresa las dimensiones del techo y del panel, y la aplicación analiza diferentes combinaciones para acomodar los paneles, buscando la disposición que mejor aproveche el espacio disponible.

La solución no solo considera poner todos los paneles en una sola orientación, sino que también prueba rotarlos y mezclarlos en filas o columnas para optimizar la capacidad total.

Finalmente, la aplicación muestra visualmente cómo quedarían distribuidos los paneles sobre el techo, junto con información adicional como la cantidad total de paneles y el porcentaje de área ocupada.

Archivos principales
lib/packing.js
Contiene la lógica principal del cálculo. En especial, la función packBest es la encargada de recibir las dimensiones y probar todas las alternativas de acomodo: orientación fija, rotada y opciones mixtas. Retorna la configuración óptima con las posiciones exactas de cada panel.

components/RoofView.jsx
Este componente se encarga de la visualización. Usa SVG para dibujar el techo y cada panel en su posición, creando una vista clara y visual para el usuario. Es el responsable de mostrar la distribución calculada por packing.js.

Uso
El usuario simplemente ingresa las dimensiones, presiona calcular y la app muestra el resultado numérico y gráfico para planificar la instalación de manera eficiente y sencilla.

Este enfoque combina eficiencia con visualización intuitiva, facilitando la planificación de instalaciones solares sin complicaciones.
