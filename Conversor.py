import requests

def obter_cotacao(moeda_origem: str, moeda_destino: str) -> float:
    """
    Obtém a cotação atual entre duas moedas utilizando a AwesomeAPI.
    """
    url = f"https://economia.awesomeapi.com.br/json/last/{moeda_origem}-{moeda_destino}"
    resposta = requests.get(url)

    if resposta.status_code != 200:
        raise Exception("Erro ao acessar a API de cotação de moedas.")

    dados = resposta.json()
    chave = f"{moeda_origem}{moeda_destino}"
    cotacao = float(dados[chave]["bid"])
    return cotacao

def converter_moeda(valor: float, cotacao: float) -> float:
    """
    Converte um valor monetário com base na cotação fornecida.
    """
    valor_convertido = valor * cotacao
    return round(valor_convertido, 2)

def solicitar_dados_usuario() -> tuple[str, str, float]:
    """
    Solicita ao usuário os dados necessários para a conversão.
    """
    print("=== Conversor de Moedas ===")
    moeda_origem = input("Moeda de origem (ex: BRL): ").strip().upper()
    moeda_destino = input("Moeda de destino (ex: USD): ").strip().upper()
    valor = float(input(f"Valor em {moeda_origem}: "))
    return moeda_origem, moeda_destino, valor

def exibir_resultado(valor: float, moeda_origem: str, convertido: float, moeda_destino: str, cotacao: float):
    """
    Exibe o resultado da conversão para o usuário.
    """
    print(f"\nResultado:")
    print(f"{valor:.2f} {moeda_origem} = {convertido:.2f} {moeda_destino}")
    print(f"Cotação utilizada: 1 {moeda_origem} = {cotacao:.4f} {moeda_destino}")

def main():
    try:
        moeda_origem, moeda_destino, valor = solicitar_dados_usuario()
        cotacao = obter_cotacao(moeda_origem, moeda_destino)
        convertido = converter_moeda(valor, cotacao)
        exibir_resultado(valor, moeda_origem, convertido, moeda_destino, cotacao)
    except Exception as e:
        print(f"Erro: {e}")

if __name__ == "__main__":
    main()