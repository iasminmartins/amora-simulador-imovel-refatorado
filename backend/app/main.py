from fastapi import FastAPI, Depends, HTTPException, Query
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
    try:
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
    except Exception as e:
        db.rollback()  # Desfaz transações em caso de erro
        # Retorna erro 500 com mensagem detalhada
        raise HTTPException(status_code=500, detail=f"Erro ao criar simulação: {str(e)}")

# Endpoint para listar simulações com paginação
@app.get("/historico", response_model=list[schemas.SimulacaoResponse])
def listar_simulacoes(
    skip: int = Query(0, ge=0, description="Número de registros a pular"),
    limit: int = Query(10, ge=1, le=10, description="Quantidade máxima de registros a retornar"),
    db: Session = Depends(get_db)):
    try:
        # Busca todas as simulações no banco de dados, ordenando do mais novo para o mais antigo
        return db.query(models.Simulacao).order_by(models.Simulacao.data.desc()).offset(skip).limit(limit).all()
    except Exception as e:
        # Retorna erro 500 com mensagem detalhada
        raise HTTPException(status_code=500, detail=f"Erro ao buscar histórico: {str(e)}")