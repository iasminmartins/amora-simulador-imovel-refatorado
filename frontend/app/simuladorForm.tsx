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
    <section>
      <h2>Faça sua simulação</h2>
      <form onSubmit={onSubmit}>
        {/* Campo: Valor do imóvel */}
        <div>
          <label>Qual o valor do imóvel desejado? (R$)</label>
          <input
            name="valor_imovel"
            type="number"
            value={form.valor_imovel}
            onChange={onChange}
            required
            placeholder="De R$ 200.000 até R$ 6.000.000"
          />
          <div className="input-helper">
            Atendemos imóveis somente na cidade de São Paulo.
          </div>
        </div>
        {/* Campo: Percentual de entrada */}
        <div>
          <label>Qual o percentual da entrada? (%)</label>
          <input
            name="percentual_entrada"
            type="number"
            value={form.percentual_entrada}
            onChange={onChange}
            required
            placeholder="Mínimo de 5%"
          />
          <div className="input-helper">
            O valor da entrada deve ser no mínimo de R$ 10000,00.
          </div>
        </div>
        {/* Campo: Anos de contrato */}
        <div>
          <label>Quantos anos de contrato? (anos) </label>
          <input
            name="anos_contrato"
            type="number"
            value={form.anos_contrato}
            onChange={onChange}
            required
            placeholder="De 1 ano até 40 anos"
          />
        </div>
        {/* Botão de envio */}
        <button type="submit">
          Simular
        </button>
      </form>
    </section>
  )
}