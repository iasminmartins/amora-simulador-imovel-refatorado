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

amora-simulador-imovel/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py
│   │   ├── models.py
│   │   ├── schemas.py
│   │   └── database.py
│   ├── Dockerfile
│   ├── requirements.txt
├── frontend/
├── docker-compose.yml
├── .env.example
└── README.md

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
Acesse o backend em: http://localhost:8000/docs

## Parar e remover containers

```bash
docker-compose down --volumes
```
---

## Etapas de desenvolvimento

### Etapa 1 - Criação do banco de dados

A modelagem do banco de dados foi realizada utilizando PostgreSQL e SQLAlchemy ORM.  
Foi criada a tabela `simulacoes` com os campos necessários para armazenar as informações das simulações de compra de imóvel, incluindo valor do imóvel, percentual de entrada, prazo do contrato, data da simulação e resultados em formato JSON.
Há persistência dos dados da simulação, incluindo um timestamp e o resultado dos cálculos em JSON.

### Etapa 2 - Backend com FastAPI

#### Endpoints implementados:

POST /simulacao: Recebe os dados, realiza os cálculos conforme as fórmulas, persiste no banco e retorna a resposta.

#### Validações:

Campos obrigatórios validados com Pydantic e restrições de valor (mínimos, máximos e tipos) implementadas com Field.

### Etapa 3 - Frontend com Next.js

### Etapa 4 - Testes

#### Testes funcionais (Swagger)

##### Teste de validação do endpoint POST /simulacao 

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