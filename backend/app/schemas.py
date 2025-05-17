from pydantic import BaseModel
from datetime import datetime
from typing import Any

# Schema de entrada para criar uma simulação
class SimulacaoCreate(BaseModel):
    valor_imovel: float
    percentual_entrada: float
    anos_contrato: int

# Schema de resposta para retornar uma simulação
class SimulacaoResponse(SimulacaoCreate):
    id: int
    data: datetime
    resultados: Any

    # Permite leitura de objetos ORM
    class Config:
        orm_mode = True     