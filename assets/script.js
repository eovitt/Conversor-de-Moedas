// Chave da API - cadastre-se gratuitamente em https://www.exchangerate-api.com
const API_KEY = 'YOUR_API_KEY'; // Substitua pela sua chave
const API_URL = `https://v6.exchangerate-api.com/v6/0565e0753596fbe8c24257ac/latest/USD`;

// Configurações de cache e limite
const CACHE_DURATION = 12 * 60 * 60 * 1000; // 12 horas em milissegundos
const MAX_MONTHLY_REQUESTS = 1400; // Margem de segurança abaixo do limite de 1500
const REQUEST_COUNTER_KEY = 'apiRequestCounter';
const REQUEST_MONTH_KEY = 'apiRequestMonth';

let exchangeRates = {};
let lastUpdate = '';
let currentRequestCount = 0;
let currentMonth = new Date().getMonth();

// Elementos do DOM
const amountInput = document.getElementById('amount');
const fromCurrency = document.getElementById('fromCurrency');
const toCurrency = document.getElementById('toCurrency');
const convertBtn = document.getElementById('convertBtn');
const resultDiv = document.getElementById('result');
const updateTimeSpan = document.getElementById('updateTime');

// Inicializa o contador de requisições
function initRequestCounter() {
    const storedMonth = localStorage.getItem(REQUEST_MONTH_KEY);
    const now = new Date();
    
    // Se é um novo mês, reinicia o contador
    if (storedMonth !== now.getMonth().toString()) {
        localStorage.setItem(REQUEST_MONTH_KEY, now.getMonth().toString());
        localStorage.setItem(REQUEST_COUNTER_KEY, '0');
        currentRequestCount = 0;
    } else {
        currentRequestCount = parseInt(localStorage.getItem(REQUEST_COUNTER_KEY)) || 0;
    }
    
    currentMonth = now.getMonth();
}

// Incrementa o contador de requisições
function incrementRequestCounter() {
    currentRequestCount++;
    localStorage.setItem(REQUEST_COUNTER_KEY, currentRequestCount.toString());
}

// Verifica se pode fazer nova requisição
function canMakeRequest() {
    return currentRequestCount < MAX_MONTHLY_REQUESTS;
}

// Mostra status das requisições no console (para debug)
function logRequestStatus() {
    console.log(`Requisições este mês: ${currentRequestCount}/${MAX_MONTHLY_REQUESTS}`);
}

// Carrega dados do cache
function loadFromCache() {
    const cachedData = localStorage.getItem('cachedExchangeRates');
    const cachedTime = localStorage.getItem('cachedTime');
    
    if (cachedData && cachedTime) {
        const age = Date.now() - parseInt(cachedTime);
        if (age < CACHE_DURATION) {
            return {
                data: JSON.parse(cachedData),
                age: age
            };
        }
    }
    return null;
}

// Armazena dados no cache
function saveToCache(data) {
    localStorage.setItem('cachedExchangeRates', JSON.stringify(data));
    localStorage.setItem('cachedTime', Date.now().toString());
}

// Busca taxas de câmbio (com cache e controle de requisições)
async function fetchExchangeRates() {
    // Verifica cache primeiro
    const cached = loadFromCache();
    if (cached) {
        console.log(`Usando dados em cache (${Math.floor(cached.age / 3600000)} horas atrás)`);
        return cached.data;
    }
    
    // Verifica limite de requisições
    if (!canMakeRequest()) {
        throw new Error('Limite mensal de requisições atingido');
    }
    
    try {
        resultDiv.innerHTML = '<div class="loading"></div>';
        const response = await fetch(API_URL);
        const data = await response.json();
        
        if (data.result === 'success') {
            // Atualiza cache e contador
            saveToCache(data);
            incrementRequestCounter();
            logRequestStatus();
            
            return data;
        } else {
            throw new Error(data['error-type']);
        }
    } catch (error) {
        console.error('Erro ao buscar taxas:', error);
        
        // Tenta usar cache mesmo que antigo se a requisição falhar
        const cached = loadFromCache();
        if (cached) {
            console.log('Falha na API. Usando cache antigo como fallback');
            return cached.data;
        }
        
        throw error;
    }
}

// Carregar e processar taxas de câmbio
async function loadExchangeRates() {
    try {
        const data = await fetchExchangeRates();
        
        exchangeRates = data.conversion_rates;
        lastUpdate = new Date(data.time_last_update_utc);
        updateTimeSpan.textContent = lastUpdate.toLocaleString('pt-BR');
        
        // Adiciona suporte para BRL (que não está na API padrão)
        if (!exchangeRates.BRL) {
            // Usando taxa aproximada como fallback
            exchangeRates.BRL = 5.0;
        }
        
        return true;
    } catch (error) {
        console.error('Erro ao carregar taxas:', error);
        
        if (error.message.includes('Limite mensal')) {
            resultDiv.textContent = 'Limite mensal de atualizações atingido. Usando últimas taxas disponíveis.';
        } else {
            resultDiv.textContent = 'Erro ao carregar taxas. Usando valores padrão.';
        }
        
        // Valores padrão como fallback
        exchangeRates = {
            USD: 1,
            BRL: 5.0,
            EUR: 0.85,
            GBP: 0.73,
            JPY: 110,
            CAD: 1.25,
            AUD: 1.30,
            CNY: 6.45
        };
        
        lastUpdate = new Date();
        updateTimeSpan.textContent = 'Offline - ' + lastUpdate.toLocaleString('pt-BR');
        return false;
    }
}

// Converter moedas
function convertCurrency() {
    const amount = parseFloat(amountInput.value);
    if (isNaN(amount) || amount <= 0) {
        resultDiv.textContent = 'Por favor, insira um valor válido maior que zero.';
        return;
    }

    const from = fromCurrency.value;
    const to = toCurrency.value;

    if (from === to) {
        resultDiv.textContent = `O valor é o mesmo: ${amount.toFixed(2)} ${to}`;
        return;
    }

    // Se não temos taxas ainda, tentar carregar
    if (Object.keys(exchangeRates).length === 0) {
        resultDiv.textContent = 'Carregando taxas...';
        loadExchangeRates().then(() => convertCurrency());
        return;
    }

    // Converter via USD como moeda base
    const rate = (1 / exchangeRates[from]) * exchangeRates[to];
    const convertedValue = amount * rate;
    
    resultDiv.textContent = `${amount.toFixed(2)} ${from} = ${convertedValue.toFixed(2)} ${to}`;
}

// Event Listeners
convertBtn.addEventListener('click', convertCurrency);

amountInput.addEventListener('input', () => {
    if (amountInput.value === '') return;
    convertCurrency();
});

fromCurrency.addEventListener('change', convertCurrency);
toCurrency.addEventListener('change', convertCurrency);

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    initRequestCounter();
    loadExchangeRates().then(() => {
        amountInput.value = '1';
        convertCurrency();
    });
});