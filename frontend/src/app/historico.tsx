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
      <div>
        {/* Exibe mensagem se não houver simulações */}
        {historico.length === 0 && (
          <div className="historico-vazio">Nenhuma simulação encontrada.</div>
        )}
        {/* Lista cada simulação do histórico */}
        {historico.map((item) => {
          const dataObj = new Date(item.data)
          return (
            <div className="historico-item" key={item.id}>
              <span>
                {dataObj.toLocaleDateString('pt-BR')} {dataObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              </span>
              <span style={{ marginLeft: 12 }}>
                R$ {item.valor_imovel.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
          )
        })}
      </div>
    </section>
  )
}