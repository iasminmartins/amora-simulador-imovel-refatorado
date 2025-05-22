'use client'
import { useState, useEffect, useRef } from 'react'
import SimuladorForm from './simuladorForm'
import Resultado from './resultado'
import Historico from './historico'
import { validarCampo, validarFormulario } from './validacao'

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

  // Estado para erros de validação dos campos
  const [erros, setErros] = useState<{ [key: string]: string }>({})

  // Estado para o resultado da simulação atual
  const [resultado, setResultado] = useState<Resultado | null>(null)

  // Estado para o histórico de simulações
  const [historico, setHistorico] = useState<HistoricoItem[]>([])
  
  // Estado para status e mensagem de feedback do envio
  const [status, setStatus] = useState<'idle' | 'sucesso' | 'erro'>('idle')
  const [mensagem, setMensagem] = useState('')

  // Ref para a seção de resultados (para scroll automático)
  const resultadoRef = useRef<HTMLDivElement>(null)

  // Atualiza os dados do formulário e valida em tempo real
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
    setErros({ ...erros, [name]: validarCampo(name, value) })
  }

  // Quando o formulário é enviado
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
     e.preventDefault()
    // Valida todos os campos antes de enviar
    const novosErros = validarFormulario(form)
    setErros(novosErros)
    if (Object.keys(novosErros).length > 0) return

    try {
      setStatus('idle')
      setMensagem('')
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
      if (!resposta.ok) throw new Error('Erro ao enviar simulação')
      const dados = await resposta.json()
      setResultado(dados.resultados) // Atualiza o resultado da simulação
      setStatus('sucesso')
      setMensagem('Simulação realizada com sucesso!')
      getHistorico() // Atualiza o histórico após nova simulação
    } catch {
      setStatus('erro')
      setMensagem('Erro ao enviar simulação. Tente novamente.')
    }
  }

  // Esconde a mensagem de sucesso após 3 segundos e faz scroll suave para a seção de resultados
  useEffect(() => {
    if (status === 'sucesso') {
      const timer = setTimeout(() => {
        setStatus('idle')
        setMensagem('')
        // Scroll para a seção de resultados após a mensagem sumir
        if (resultadoRef.current) {
          resultadoRef.current.scrollIntoView({ behavior: 'smooth' })
        }
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [status])

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
        <SimuladorForm
          form={form}
          onChange={handleChange}
          onSubmit={handleSubmit}
          erros={erros}
          status={status}
          mensagem={mensagem}
        />
      </div>
      {/* Só mostra a seção de resultados se houver resultado */}
      {resultado && (
        <div className="bloco-resultado" ref={resultadoRef}>
          <Resultado resultado={resultado} />
        </div>
      )}
      <div className="bloco-historico">
        <Historico historico={historico} />
      </div>
    </>
  )
}