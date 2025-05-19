import React from 'react'

type ResultadoProps = {
  resultado: {
    valor_entrada: number
    valor_financiado: number
    guardar_total: number
    guardar_mensal: number
  } | null
}

export default function Resultado({ resultado }: ResultadoProps) {
  // Não renderiza nada se não houver resultado
  if (!resultado) return null

  return (
    <section>
      <h2>Resultado da Simulação</h2>
      <div className="resultado-grid">
        <div>
          <strong>Valor da entrada:</strong>
          <div>R$ {resultado.valor_entrada}</div>
        </div>
        <div>
          <strong>Valor financiado:</strong>
          <div>R$ {resultado.valor_financiado}</div>
        </div>
        <div>
          <strong>Total a guardar:</strong>
          <div>R$ {resultado.guardar_total}</div>
        </div>
        <div>
          <strong>Valor mensal a guardar:</strong>
          <div>R$ {resultado.guardar_mensal}</div>
        </div>
      </div>
    </section>
  )
}