from pydantic import BaseModel, Field
from datetime import datetime
from typing import Any

# Schema de entrada para criar uma simulação
class SimulacaoCreate(BaseModel):
    # Valida as entradas com Pydantic
    valor_imovel: float = Field(..., gt=0, le=1000000000000, description="Valor do imóvel deve ser maior que zero")
    percentual_entrada: float = Field(..., gt=0, le=100, description="Percentual de entrada entre 0 e 100")
    anos_contrato: int = Field(..., gt=0, le=40, description="Anos do contrato deve ser maior que zero")

# Schema de resposta para retornar uma simulação
class SimulacaoResponse(SimulacaoCreate):
    id: int
    data: datetime
    resultados: Any

    # Permite leitura de objetos ORM
    class Config:
        orm_mode = True     