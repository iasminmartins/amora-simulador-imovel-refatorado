from pydantic import BaseModel, Field
from datetime import datetime
from typing import Any

# Schema de entrada para criar uma simulação
class SimulacaoCreate(BaseModel):
    # Valida as entradas com Pydantic
    valor_imovel: float = Field(..., ge=200000, le=6000000, description="Valor do imóvel deve ser de R$ 200.000 até R$ 6.000.000")
    percentual_entrada: float = Field(..., ge=5, le=100, description="Percentual de entrada deve ser no mínimo 5%, no máximo 100%")
    anos_contrato: int = Field(..., ge=1, le=40, description="Anos do contrato deve ser de 1 a 40 anos")

# Schema de resposta para retornar uma simulação
class SimulacaoResponse(SimulacaoCreate):
    id: int
    data: datetime
    resultados: Any

    # Permite leitura de objetos ORM
    class Config:
        orm_mode = True     