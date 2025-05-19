# Simulador de compra de imóvel

Este repositório contém o desenvolvimento de uma aplicação full stack para simular a compra de um imóvel, conforme desafio técnico proposto.

---

## Objetivo

Permitir que o usuário simule a compra de um imóvel informando o valor total, a entrada e o número de parcelas desejadas, com retorno da simulação.

---

## Tecnologias utilizadas

- **Banco de dados**: PostgreSQL + SQLAlchemy
- **Backend**: FastAPI (Python)
- **Frontend**: Next.js (React)
- **Infraestrutura**: Docker + Docker Compose

---

## Estrutura do projeto

<pre> ```
amora-simulador-imovel/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py
│   │   ├── models.py
│   │   ├── schemas.py
│   │   └── database.py
│   ├── dockerfile
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │    └── app/
│   │        ├── globals.css
│   │        ├── historico.tsx
│   │        ├── layout.tsx
│   │        ├── page.tsx
│   │        ├── resultado.tsx
│   │        └── simuladorForm.tsx
│   ├── .gitignore
│   ├── dockerfile
│   ├── eslint.config.mjs
│   ├── next.config.js
│   ├── package-lock.json
│   ├── package.json
│   ├── postcss.config.mjs
│   └── tsconfig.json
├── .env.example
├── .gitignore
├── docker-compose.yml
└── README.md
``` </pre>
---

## Como executar o projeto com Docker

### 1. Instalar Docker e Docker Compose

> Consulte a documentação oficial:  
> [Docker Engine](https://docs.docker.com/engine/install/)  
> [Docker Compose](https://docs.docker.com/compose/install/)

### 2. Configurar variáveis de ambiente

Copie o arquivo `.env.example` e preencha com seus dados:

```bash
cp .env.example .env
```

### 3. Subir a aplicação

```bash
docker-compose up --build
```

### 4. Parar e remover containers (antes de subir a aplicação novamente, caso necessário)

```bash
docker-compose down --volumes
```

### 5. Acesse:

- Frontend: http://localhost:3000
- Backend: http://localhost:8000/docs

---

## Etapas de desenvolvimento

### Etapa 1 - Criação do banco de dados

A modelagem do banco de dados foi realizada utilizando PostgreSQL e SQLAlchemy ORM.  
Foi criada a tabela `simulacoes` com os campos necessários para armazenar as informações das simulações de compra de imóvel, incluindo valor do imóvel, percentual de entrada, prazo do contrato, data da simulação e resultados em formato JSON.
Há persistência dos dados da simulação, incluindo um timestamp e o resultado dos cálculos em JSON.

### Etapa 2 - Backend com FastAPI

#### Endpoints implementados:

POST /simulacao: Recebe os dados, realiza os cálculos conforme as fórmulas, persiste no banco e retorna a resposta.
GET /historico: Retorna todas as simulações já realizadas.

#### Fórmulas utilizadas:

| Cálculo          | Fórmula                                     |
| ---------------- | ------------------------------------------- |
| Valor de entrada | `valor_imovel * (percentual_entrada / 100)` |
| Valor financiado | `valor_imovel - valor_entrada`              |
| Valor a guardar  | `valor_imovel * 0.15`                       |
| Guardar mensal   | `guardar_total / (anos_contrato * 12)`      |

#### Validações:

Campos obrigatórios validados com Pydantic e restrições de valor (mínimos, máximos e tipos) implementadas com Field.

#### Variáveis de ambiente Backend

- `POSTGRES_USER` — Usuário do banco de dados PostgreSQL  
- `POSTGRES_PASSWORD` — Senha do banco de dados PostgreSQL  
- `POSTGRES_DB` — Nome do banco de dados PostgreSQL  
- `POSTGRES_HOST` — Host do banco de dados (normalmente `db` no Docker Compose)  
- `POSTGRES_PORT` — Porta do banco de dados (padrão: `5432`) 

### Etapa 3 - Testes

#### Teste de validação do endpoint POST /simulacao 

Todos os testes a seguir foram realizados via Swagger UI em [http://localhost:8000/docs](http://localhost:8000/docs) para garantir que as validações definidas no schema `SimulacaoCreate` estão funcionando corretamente.

| Cenário                         | valor_imovel        | percentual_entrada | anos_contrato | Esperado     | Resultado |
|--------------------------------|----------------------|--------------------|----------------|--------------|-----------|
| ✅ Válido (mínimo aceitável)   | 0.01                | 0.01               | 1              | 200 OK       | ✅         |
| ✅ Válido (máximo aceitável)   | 1_000_000_000_000   | 100                | 40             | 200 OK       | ✅         |
| ❌ Abaixo do mínimo            | 0                   | 0                  | 0              | 422          | ✅         |
| ❌ Acima do máximo             | 1_000_000_000_001   | 101                | 41             | 422          | ✅         |
| ❌ Valores negativos           | -100                | -1                 | -5             | 422          | ✅         |
| ❌ Tipos errados               | "abc"               | null               | 10.5           | 422          | ✅         |
| ❌ Campo ausente: valor_imovel | —                   | 10                 | 5              | 422          | ✅         |
| ❌ Campo ausente: percentual   | 300000              | —                  | 5              | 422          | ✅         |
| ❌ Campo ausente: anos         | 300000              | 10                 | —              | 422          | ✅         |

Todos os testes retornaram os erros esperados (`422 Unprocessable Entity`) quando os dados estavam fora dos critérios definidos.

---

#### Teste manual do endpoint GET /historico

Foi realizada uma requisição GET ao endpoint /historico utilizando a interface Swagger UI em http://localhost:8000/docs.

Parâmetros: Nenhum

Requisição:

```bash
curl -X 'GET' \
  'http://localhost:8000/historico' \
  -H 'accept: application/json'
```
Resposta esperada: Código 200 OK com lista de simulações armazenadas no banco de dados.
Resposta obtida: ✅ Sucesso – lista de simulações retornada conforme esperado.

| ID | Data da Simulação          | Valor do Imóvel | % Entrada | Anos de Contrato | Valor Entrada | Valor Financiado | Guardar Total | Guardar Mensal |
| -- | -------------------------- | --------------- | --------- | ---------------- | ------------- | ---------------- | ------------- | -------------- |
| 1  | 2025-05-17T21:14:46.355467 | R\$ 300.000     | 20%       | 10 anos          | R\$ 60.000    | R\$ 240.000      | R\$ 45.000    | R\$ 375,00     |
| 2  | 2025-05-17T21:15:19.322987 | R\$ 400.000     | 5%        | 3 anos           | R\$ 20.000    | R\$ 380.000      | R\$ 60.000    | R\$ 1.666,67   |
| 3  | 2025-05-17T21:33:51.185882 | R\$ 0,01        | 0,01%     | 1 ano            | R\$ 0,00      | R\$ 0,01         | R\$ 0,00      | R\$ 0,00       |

Resultado: ✅ O endpoint está funcionando corretamente e retorna todas as simulações persistidas no banco.

### Etapa 4 - Frontend com Next.js

O frontend foi desenvolvido utilizando Next.js (React) para proporcionar uma experiência de usuário moderna, responsiva e intuitiva. Acesse o port http://localhost:3000 para utilizar o simulador.

#### Funcionalidades implementadas:

- Formulário de Simulação:
O usuário pode inserir o valor do imóvel, percentual de entrada e anos de contrato em um formulário simples e validado.

- Integração com a API:
Ao submeter o formulário, é realizada uma requisição HTTP POST para o endpoint /simulacao do backend, enviando os dados no formato JSON.

- Exibição dos Resultados:
Após o retorno da API, os resultados da simulação são exibidos de forma clara e organizada na tela, permitindo ao usuário visualizar facilmente os valores calculados.

- Histórico de Simulações:
Uma seção dedicada exibe o histórico de todas as simulações já realizadas, obtidas através de uma requisição HTTP GET ao endpoint /historico da API.

- Estilização:
O layout utiliza a paleta de cores da aMORA, garantindo identidade visual e boa usabilidade, com responsividade e foco na experiência do usuário. 

---

## Possíveis melhorias e próximos passos

- Validação e feedback visual no frontend:
Adicionar mensagens de erro e validação em tempo real nos campos do formulário para melhorar a experiência do usuário.

- Mensagens de sucesso/erro:
Exibir alertas claros ao usuário após o envio do formulário, tanto para sucesso quanto para falhas de comunicação com a API.

- Acessibilidade:
Tornar a aplicação mais acessível, garantindo navegação por teclado, uso correto de labels, contraste adequado de cores, textos alternativos para leitores de tela e estrutura semântica nos elementos HTML.

- Responsividade avançada:
Melhorar o layout para dispositivos móveis e tablets.

- Melhorias no layout:
Refinar o design visual, ajustar espaçamentos, tamanhos de fonte e responsividade, além de considerar animações suaves e feedback visual para interações do usuário.

- Autenticação de usuários:
Implementar login/cadastro para que cada usuário possa ver apenas seu próprio histórico de simulações.

- Exportação de resultados:
Permitir ao usuário exportar a simulação em PDF ou CSV.

- Documentação da API:
Expandir a documentação dos endpoints, exemplos de request/response e possíveis erros.