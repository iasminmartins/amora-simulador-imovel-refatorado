import React from 'react'

// Define as propriedades esperadas pelo componente
type SimuladorFormProps = {
  form: { valor_imovel: string; percentual_entrada: string; anos_contrato: string } // Estado do formulário
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void // Função para atualizar campos
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void   // Função para envio do formulário
}

// Componente de formulário do simulador
export default function SimuladorForm({ form, onChange, onSubmit }: SimuladorFormProps) {
  return (
    <form onSubmit={onSubmit}>
      {/* Campo: Valor do imóvel */}
      <div>
        <label>Valor do Imóvel (R$): </label>
        <input
          name="valor_imovel"
          type="number"
          value={form.valor_imovel}
          onChange={onChange}
          required
        />
      </div>
      {/* Campo: Percentual de entrada */}
      <div>
        <label>Percentual de Entrada (%): </label>
        <input
          name="percentual_entrada"
          type="number"
          value={form.percentual_entrada}
          onChange={onChange}
          required
        />
      </div>
      {/* Campo: Anos de contrato */}
      <div>
        <label>Anos de Contrato: </label>
        <input
          name="anos_contrato"
          type="number"
          value={form.anos_contrato}
          onChange={onChange}
          required
        />
      </div>
      {/* Botão de envio */}
      <button type="submit">
        Simular
      </button>
    </form>
  )
}