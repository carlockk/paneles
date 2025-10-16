import '../styles/globals.css'

export const metadata = {
  title: '¿Cuántos paneles caben? - Ruuf demo',
  description: 'Calcula y dibuja cuántos paneles rectangulares caben en un techo',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
