import './globals.css'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <header>
          <h1>Simulador de Compra de Imóvel</h1>
        </header>
        <main>
          {children}
        </main>
        <footer>
          <small>© 2025</small>
        </footer>
      </body>
    </html>
  )
}