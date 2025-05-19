'use client'
import { useState, useEffect } from 'react'
import SimuladorForm from './simuladorForm'
import Resultado from './resultado'
import Historico from './historico'

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
      <div className="bloco-formulario">
      <SimuladorForm form={form} onChange={handleChange} onSubmit={handleSubmit} />
    </div>
    <div className="bloco-resultado">
      <Resultado resultado={resultado} />
    </div>
    <div className="bloco-historico">
      <Historico historico={historico} />
    </div>
    </>
  )
}