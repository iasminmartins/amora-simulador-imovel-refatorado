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
      <ul>
        {/* Exibe os valores calculados da simulação */}
        <li>Valor da entrada: R$ {resultado.valor_entrada}</li>
        <li>Valor financiado: R$ {resultado.valor_financiado}</li>
        <li>Total a guardar: R$ {resultado.guardar_total}</li>
        <li>Valor mensal a guardar: R$ {resultado.guardar_mensal}</li>
      </ul>
    </section>
  )
}