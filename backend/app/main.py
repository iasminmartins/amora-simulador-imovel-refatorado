from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from . import models, schemas
from .database import SessionLocal, engine
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime

# Cria as tabelas no banco de dados, se não existirem
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# Configuração do CORS para permitir requisições de qualquer origem
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependência para obter uma sessão de banco de dados
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Endpoint para criar uma nova simulação de financiamento imobiliário
@app.post("/simulacao", response_model=schemas.SimulacaoResponse)
def criar_simulacao(simulacao: schemas.SimulacaoCreate, db: Session = Depends(get_db)):
    # Cálculo dos valores da simulação
    valor_entrada = simulacao.valor_imovel * (simulacao.percentual_entrada / 100)
    valor_financiado = simulacao.valor_imovel - valor_entrada
    guardar_total = simulacao.valor_imovel * 0.15
    guardar_mensal = guardar_total / (simulacao.anos_contrato * 12)

    # Armazena os resultados em um dicionário
    resultados = {
        "valor_entrada": float(round(valor_entrada, 2)),
        "valor_financiado": float(round(valor_financiado, 2)),
        "guardar_total": float(round(guardar_total, 2)),
        "guardar_mensal": float(round(guardar_mensal, 2)),
    }

    # Cria a simulação no banco de dados
    db_simulacao = models.Simulacao(
        valor_imovel=simulacao.valor_imovel,
        percentual_entrada=simulacao.percentual_entrada,
        anos_contrato=simulacao.anos_contrato,
        resultados=resultados,
    )

    db.add(db_simulacao)      # Adiciona à sessão
    db.commit()               # Salva no banco
    db.refresh(db_simulacao)  # Atualiza com dados do banco (ex: id)
    return db_simulacao       # Retorna a simulação criada

# Endpoint para listar todas as simulações
@app.get("/historico", response_model=list[schemas.SimulacaoResponse])
def listar_simulacoes(db: Session = Depends(get_db)):
    return db.query(models.Simulacao).all()