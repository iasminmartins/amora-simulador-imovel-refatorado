from sqlalchemy import Column, Integer, Numeric, DateTime, JSON
from datetime import datetime
from .database import Base

class Simulacao(Base):
    """
    Modelo ORM para a tabela 'simulacoes', que armazena os dados das simulações de compra de imóvel
    """
    __tablename__ = "simulacoes"

    id = Column(Integer, primary_key=True, index=True)  # Chave primária da simulação
    valor_imovel = Column(Numeric(15, 2), nullable=False)  # Valor do imóvel simulado
    percentual_entrada = Column(Numeric(5, 2), nullable=False)  # Percentual de entrada informado
    anos_contrato = Column(Integer, nullable=False)  # Prazo do financiamento em anos
    data = Column(DateTime, default=datetime.utcnow)  # Data/hora da simulação (UTC)
    resultados = Column(JSON, nullable=False)  # Resultados da simulação (JSON)