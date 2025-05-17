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
  // Estados serão adicionados nas próximas etapas
  return <div>Página de Simulação</div>
}