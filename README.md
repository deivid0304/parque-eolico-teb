# 📊 Dashboard de Manutenção de Parque Eólico

Este projeto é um dashboard interativo para monitoramento e análise de dados de turbinas de um parque eólico, com foco em manutenção preditiva e otimização operacional.
Ele integra dados em tempo real, análises de Machine Learning para previsão de falhas e um sistema de alertas automáticos.

## ✨ Funcionalidades

-   **Dashboard Interativo:** Visão geral com KPIs principais, gráficos de tendências e análises por classificação.
-   **Dados em Tempo Real:** Monitoramento contínuo das turbinas com atualização automática via API.
-   **Mapa de Turbinas:** Visualização da localização e status de criticidade de cada turbina.
-   **Análises Preditivas (Machine Learning):** Modelos de ML para prever a probabilidade de falhas e detectar anomalias, com recomendações de manutenção.
-   **Sistema de Alertas Automáticos:** Notificações em tempo real para situações críticas e anomalias detectadas.
-   **Filtros Temporais:** Análise de dados por diferentes períodos (mensal, trimestral, etc.).
-   **Benchmarking Interno:** Comparação de desempenho entre as turbinas.
-   **Exportação de Relatórios:** Funcionalidade para exportar dashboards e relatórios em PDF e Excel.
-   **Design Responsivo:** Interface otimizada para desktop e dispositivos móveis.

## 🚀 Tecnologias Utilizadas

### Frontend

-   **React:** Biblioteca JavaScript para construção da interface de usuário.
-   **Vite:** Ferramenta de build rápida para desenvolvimento frontend.
-   **Tailwind CSS:** Framework CSS para estilização rápida e responsiva.
-   **shadcn/ui:** Coleção de componentes de UI reusáveis e acessíveis.
-   **Gráficos e Visualizações:** Recharts
-   **Ícones:** Lucide React
-   **Gerenciamento de Pacotes:** `pnpm`

### Backend

-   **Flask:** Microframework Python para a construção da API RESTful.
-   **scikit-learn:** Biblioteca de Machine Learning para modelos preditivos.
-   **NumPy & Pandas:** Bibliotecas para computação numérica e manipulação de dados.
-   **Flask-CORS:** Extensão para habilitar Cross-Origin Resource Sharing (CORS).
-   **pip:** Gerenciador de pacotes para o backend.

### Banco de Dados

-   **SQLite:** Banco de dados leve e baseado em arquivo, utilizado para persistência básica de dados.
-   Os dados históricos e em tempo real são simulados ou gerados dinamicamente para demonstração e treinamento do modelo de ML.

## ⚙️ Como Rodar o Projeto Localmente

Para configurar e executar este projeto em sua máquina local, siga os passos abaixo:

### Pré-requisitos

Certifique-se de ter as seguintes ferramentas instaladas:

-   [Node.js](https://nodejs.org/) (versão LTS recomendada) com `npm` ou `pnpm`
-   [Python](https://www.python.org/) (versão 3.9+) com `pip`

### 1. Clone o Repositório

```bash
git clone https://github.com/deivid0304/parque-eolico-teb.git
cd <nome_do_diretorio_do_projeto>
```

### 2. Configurar e Iniciar o Backend (API Flask)

Navegue até o diretório `teb-api`:

```bash
cd teb-api
```

Crie e ative um ambiente virtual (recomendado):

```bash
python3 -m venv venv
source venv/bin/activate  # No Windows: .\venv\Scripts\activate
```

Instale as dependências do Python:

```bash
pip install -r requirements.txt
```

Inicie o servidor da API. Ele será executado na porta `5001`:

```bash
python src/main.py
```

Deixe este terminal aberto e rodando. A API estará acessível em `http://localhost:5001`.

### 3. Configurar e Iniciar o Frontend (Aplicação React)

Abra um **novo terminal** e navegue até o diretório `parque-eolico-teb`:

```bash
cd ../parque-eolico-teb
```

Instale as dependências do Node.js (usando `pnpm`):

```bash
pnpm install
```

Inicie o servidor de desenvolvimento do React. Ele será executado na porta `5173` (ou uma porta disponível próxima):

```bash
npm run dev
```

Deixe este terminal aberto e rodando. O frontend estará acessível em `http://localhost:5173/` (verifique a porta exata no seu terminal).

### 4. Acessar o Dashboard

Abra seu navegador e acesse a URL fornecida pelo `npm run dev` (geralmente `http://localhost:5173/`).

## 📂 Estrutura do Projeto

```
. # Raiz do Projeto
├── teb-api/             # Diretório do Backend (API Flask)
│   ├── src/
│   │   ├── main.py      # Ponto de entrada da aplicação Flask
│   │   ├── routes/      # Definição das rotas da API
│   │   │   ├── turbine_data.py # Rotas para dados de turbinas (realtime, history)
│   │   │   └── ml_predictions.py # Rotas para ML (treinamento, previsão, alertas)
│   │   └── ml_models/   # Modelos de Machine Learning
│   │       └── predictive_model.py # Lógica do modelo preditivo
│   ├── venv/            # Ambiente virtual Python
│   └── requirements.txt # Dependências do Python
├── parque-eolico-teb/   # Diretório do Frontend (Aplicação React)
│   ├── public/
│   ├── src/
│   │   ├── App.jsx      # Componente principal da aplicação
│   │   ├── App.css      # Estilos globais
│   │   ├── main.jsx     # Ponto de entrada do React
│   │   ├── components/  # Componentes React reutilizáveis
│   │   │   ├── AlertSystem.jsx # Sistema de Alertas
│   │   │   ├── Benchmarking.jsx # Análise de Benchmarking
│   │   │   ├── Dashboard.jsx    # Componente do Dashboard principal
│   │   │   ├── DateFilter.jsx   # Filtro de datas
│   │   │   ├── KPICard.jsx      # Cartões de KPI
│   │   │   ├── MLInsights.jsx   # Insights de Machine Learning
│   │   │   ├── RealTimeData.jsx # Dados em Tempo Real
│   │   │   └── TurbineMap.jsx   # Mapa de Turbinas
│   │   ├── data/        # Dados estáticos ou simulados
│   │   │   └── turbineData.js   # Dados de turbinas (simulados)
│   │   ├── hooks/       # Hooks React personalizados
│   │   │   └── use-toast.js     # Hook para notificações (toasts)
│   │   ├── lib/         # Utilitários e configurações (ex: cn, tailwind)
│   │   └── utils/       # Funções utilitárias
│   │       └── exportUtils.js   # Funções para exportação (PDF, Excel)
│   ├── index.html       # Arquivo HTML principal
│   ├── package.json     # Dependências e scripts do Node.js
│   ├── pnpm-lock.yaml   # Lockfile do pnpm
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js
├── README.md            # Este arquivo
├── Basededados-TEB_2025.xlsx # Exemplo de dataset (dados simulados)
└── ...                  # Outros arquivos de documentação ou suporte
```

## 🔌 Endpoints da API (Backend)

A API Flask oferece os seguintes endpoints:

-   **`GET /api/turbines/realtime`**: Retorna dados em tempo real simulados para todas as turbinas, incluindo KPIs gerais.
-   **`GET /api/turbines/<turbine_id>/history`**: Retorna dados históricos simulados para uma turbina específica.
-   **`GET /api/alerts`**: Retorna alertas ativos baseados em condições de dados simuladas e previsões de ML.
-   **`POST /api/ml/train`**: Inicia o treinamento dos modelos de Machine Learning. Retorna métricas de treinamento.
-   **`GET /api/ml/predict/all`**: Retorna previsões de falha e anomalias para todas as turbinas, com recomendações de ação.
-   **`GET /api/ml/predict/<turbine_id>`**: Retorna previsões de falha e anomalias para uma turbina específica.
-   **`GET /api/ml/feature-importance`**: Retorna a importância das features para os modelos de ML.
-   **`GET /api/ml/model-status`**: Verifica o status do modelo de ML (treinado/não treinado).

## 💡 Melhorias Futuras

-   **Integração com Banco de Dados Real:** Substituir o SQLite por um banco de dados mais robusto (ex: PostgreSQL, MySQL) para persistência de dados históricos e em tempo real.
-   **Streaming de Dados em Tempo Real:** Implementar WebSockets ou outras tecnologias de streaming para atualizações de dados mais eficientes.
-   **Autenticação e Autorização:** Adicionar um sistema de login e controle de acesso para diferentes perfis de usuário.
-   **Dashboards Personalizáveis:** Permitir que os usuários configurem seus próprios dashboards e visualizações.
-   **Expansão dos Modelos de ML:** Explorar modelos mais avançados e incorporar mais variáveis para previsões ainda mais precisas.
-   **Notificações Push:** Implementar notificações push para alertas críticos.
-   **Testes Automatizados:** Adicionar testes unitários e de integração para garantir a robustez do código.

---
