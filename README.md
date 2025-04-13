# 💱 Conversor de Moedas com API em Tempo Real

Este projeto é um conversor de moedas simples desenvolvido em Python, ideal para fins educativos ou uso básico. Ele permite ao usuário converter valores entre duas moedas diferentes utilizando cotações em tempo real fornecidas pela [AwesomeAPI](https://docs.awesomeapi.com.br/api-de-moedas).

---

## ✨ Funcionalidades

✅ Conversão entre qualquer par de moedas suportado (ex: BRL → USD, EUR → JPY)  
✅ Cotação em tempo real pela internet  
✅ Interface simples via terminal  
✅ Código modularizado e de fácil leitura  

---

## 📦 Requisitos

- Python 3.7 ou superior
- Biblioteca `requests` (instalada via pip)

Instalação dos requisitos:
```bash
pip install requests
```

---

## 🚀 Como executar

1. Clone este repositório ou baixe o arquivo `conversor_moeda.py`:
```bash
git clone https://github.com/seu-usuario/nome-do-repositorio.git
cd nome-do-repositorio
```

2. Execute o script:
```bash
python conversor_moeda.py
```

3. Siga as instruções no terminal:
```
=== Conversor de Moedas ===
Moeda de origem (ex: BRL): BRL
Moeda de destino (ex: USD): USD
Valor em BRL: 100

Resultado:
100.00 BRL = 19.58 USD
Cotação utilizada: 1 BRL = 0.1958 USD
```

---

## ⚙️ Estrutura do Código

- `obter_cotacao()`: busca a cotação atual entre duas moedas.
- `converter_moeda()`: calcula o valor convertido.
- `solicitar_dados_usuario()`: coleta os dados digitados pelo usuário.
- `exibir_resultado()`: imprime o resultado da conversão.
- `main()`: orquestra todo o fluxo da aplicação.

---

## 📌 Observações

- As moedas devem ser digitadas com seus códigos internacionais (ex: USD, EUR, BRL, etc.).
- A API usada é gratuita e não exige autenticação.
