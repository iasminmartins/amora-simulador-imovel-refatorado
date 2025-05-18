import React from 'react'

// Define o tipo de cada item do histórico de simulações
type HistoricoItem = {
  id: number
  data: string
  valor_imovel: number
  percentual_entrada: number
  anos_contrato: number
  resultados: {
    valor_entrada: number
    valor_financiado: number
    guardar_total: number
    guardar_mensal: number
  }
}

// Define o tipo das props esperadas pelo componente
type HistoricoProps = {
  historico: HistoricoItem[]
}

// Exibe o histórico de simulações
export default function Historico({ historico }: HistoricoProps) {
  return (
    <section>
      <h2>Histórico de Simulações</h2>
      <ul>
        {/* Exibe mensagem se não houver simulações */}
        {historico.length === 0 && <li>Nenhuma simulação encontrada.</li>}
        {/* Lista cada simulação do histórico */}
        {historico.map((item) => (
          <li key={item.id}>
            {new Date(item.data).toLocaleString()} — R$ {item.valor_imovel}
          </li>
        ))}
      </ul>
    </section>
  )
}