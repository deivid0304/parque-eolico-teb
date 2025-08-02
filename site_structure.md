# Planejamento da Estrutura do Site - Parque Eólico TEB

## Seções do Site

### 1. Página Inicial - KPIs Gerais
- **Total de falhas**: 251
- **Tempo total de parada**: 3.756,45 horas
- **Turbina com maior criticidade**: TEB001
- **Número de eventos por classificação**:
  - Atividades corretivas (1): 134
  - Atividades preventivas (2): 24
  - Atividades solicitadas pelo proprietário (3): 28
  - Condição ambiental (4): 47
  - Atividades corretivas programadas (5): 16

### 2. Dashboard por Classificação
- **Gráficos de tendências mensais** para cada classificação
- **Gráficos de proporções** (pizza/donut) para distribuição de falhas
- **Análise de causas principais** por classificação

### 3. Mapa Visual do Parque
- **Layout visual das 8 turbinas** (TEB001 a TEB008)
- **Cores baseadas na criticidade**:
  - Vermelho: Alta criticidade (TEB001)
  - Laranja: Média criticidade (TEB004, TEB002)
  - Verde: Baixa criticidade (demais turbinas)

### 4. Painel de Recomendações Estratégicas
- **Turbinas a serem priorizadas**: TEB001 (criticidade extrema), TEB004, TEB002
- **Ações preventivas a reforçar**: Aumentar frequência de manutenção preventiva (proporção atual 5.58:1 corretiva/preventiva)
- **Sugestões para otimizar tempo de resposta**: Focar na TEB001 (MTTR de 73,46 horas)

### 5. Seção de Benchmarking Interno
- **Comparativo de disponibilidade** entre turbinas
- **Análise de eficácia da manutenção** (MTBF, MTTR)
- **Ranking de performance** das turbinas

### 6. Exportação de Dados
- **Botões para download** em PDF e Excel
- **Relatórios personalizados** por período

## Layout e Design

### Cores e Tema
- **Cor primária**: Azul escuro (#1e3a8a) - representando confiabilidade
- **Cor secundária**: Verde (#10b981) - representando eficiência
- **Cor de alerta**: Vermelho (#ef4444) - para criticidade alta
- **Cor de aviso**: Laranja (#f59e0b) - para criticidade média
- **Fundo**: Branco/cinza claro (#f8fafc)

### Tipografia
- **Títulos**: Sans-serif moderna (Inter, Roboto)
- **Corpo do texto**: Sans-serif legível
- **Dados numéricos**: Fonte monospace para alinhamento

### Componentes Visuais
- **Cards** para KPIs principais
- **Gráficos interativos** usando Chart.js ou D3.js
- **Tabelas responsivas** para dados detalhados
- **Ícones** para representar diferentes tipos de falhas
- **Animações suaves** para transições

### Responsividade
- **Desktop**: Layout em grid com múltiplas colunas
- **Tablet**: Layout adaptado com 2 colunas
- **Mobile**: Layout em coluna única com navegação por abas

## Navegação
- **Menu principal** no topo com links para cada seção
- **Breadcrumbs** para navegação contextual
- **Botão "voltar ao topo"** em páginas longas
- **Menu lateral** para filtros e opções avançadas

