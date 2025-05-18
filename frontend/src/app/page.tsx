'use client'
import { useState, useEffect } from 'react'

// Tipo para o resultado da simulação
type Resultado = {
  valor_entrada: number
  valor_financiado: number
  guardar_total: number
  guardar_mensal: number
}

// Tipo para cada item do histórico de simulações
type HistoricoItem = {
  id: number
  data: string
  valor_imovel: number
  percentual_entrada: number
  anos_contrato: number
  resultados: Resultado
}

export default function Home() {
  // Estado para os campos do formulário
  const [form, setForm] = useState({
    valor_imovel: '',
    percentual_entrada: '',
    anos_contrato: ''
  })

  // Estado para o resultado da simulação atual
  const [resultado, setResultado] = useState<Resultado | null>(null)

  // Estado para o histórico de simulações
  const [historico, setHistorico] = useState<HistoricoItem[]>([])

  // Atualiza os dados do formulário conforme o usuário digita
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  // Quando o formulário é enviado
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Envia os dados para o backend via POST
    const resposta = await fetch('http://localhost:8000/simulacao', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        valor_imovel: parseFloat(form.valor_imovel),
        percentual_entrada: parseFloat(form.percentual_entrada),
        anos_contrato: parseInt(form.anos_contrato)
      })
    })
    const dados = await resposta.json()
    setResultado(dados.resultados) // Atualiza o resultado da simulação
    getHistorico() // Atualiza o histórico após nova simulação
  }

  // Busca histórico de simulações do backend
  const getHistorico = async () => {
    const resposta = await fetch('http://localhost:8000/historico')
    const dados = await resposta.json()
    setHistorico(Array.isArray(dados) ? dados : [])
  }

  // Carrega o histórico ao montar o componente
  useEffect(() => {
    getHistorico()
  }, [])

  return (
    <>
      {/* Formulário de simulação */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
        <div>
          <label>Valor do Imóvel (R$): </label>
          <input
            name="valor_imovel"
            type="number"
            value={form.valor_imovel}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Percentual de Entrada (%): </label>
          <input
            name="percentual_entrada"
            type="number"
            value={form.percentual_entrada}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Anos de Contrato: </label>
          <input
            name="anos_contrato"
            type="number"
            value={form.anos_contrato}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" style={{ marginTop: '1rem' }}>
          Simular
        </button>
      </form>

      {/* Exibe o resultado da simulação, se houver */}
      {resultado && (
        <section>
          <h2>Resultado da Simulação</h2>
          <ul>
            <li>Valor da Entrada: R$ {resultado.valor_entrada}</li>
            <li>Valor Financiado: R$ {resultado.valor_financiado}</li>
            <li>Total a Guardar: R$ {resultado.guardar_total}</li>
            <li>Valor Mensal a Guardar: R$ {resultado.guardar_mensal}</li>
          </ul>
        </section>
      )}

      {/* Exibe o histórico de simulações */}
      <section>
        <h2>Histórico de Simulações</h2>
        <ul>
          {historico.length === 0 && <li>Nenhuma simulação encontrada.</li>}
          {historico.map((item) => (
            <li key={item.id}>
              {new Date(item.data).toLocaleString()} — R$ {item.valor_imovel}
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}