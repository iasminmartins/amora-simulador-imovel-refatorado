// Função para validar um campo individual do formulário
export function validarCampo(nome: string, valor: string): string {
  switch (nome) {
    case 'valor_imovel':
      if (!valor) return 'Informe o valor do imóvel'
      if (Number(valor) < 200000 || Number(valor) > 6000000) return 'O valor do imóvel deve ser entre R$200.000 e R$6.000.000'
      break
    case 'percentual_entrada':
      if (!valor) return 'Informe o percentual de entrada'
      if (Number(valor) < 5 || Number(valor) > 100) return 'O percentual deve ser entre 5% e 100%'
      break
    case 'anos_contrato':
      if (!valor) return 'Informe a duração de contrato'
      if (Number(valor) < 1 || Number(valor) > 3) return 'O contrato deve durar entre 1 a 3 anos'
      break
  }
  return ''
}

// Função para validar todos os campos do formulário de uma vez
export function validarFormulario(form: { [key: string]: string }): { [key: string]: string } {
  const erros: { [key: string]: string } = {}
  Object.entries(form).forEach(([nome, valor]) => {
    const erro = validarCampo(nome, valor)
    if (erro) erros[nome] = erro
  })
  return erros
}