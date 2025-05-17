from pydantic import BaseModel

# Dados esperados para criar uma simulação
class SimulacaoCreate(BaseModel):
    valor_imovel: float
    percentual_entrada: float
    anos_contrato: int

