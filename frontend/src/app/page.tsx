'use client'
import { useState } from 'react'

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

  return <div>Estados e handlers prontos</div>
}