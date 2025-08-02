// Dados do parque eólico TEB
export const turbineData = [
  {
    id: 'TEB001',
    name: 'TEB001',
    falhas: 40,
    duracaoTotal: 2938.42,
    criticidadeScore: 117536.67,
    mtbf: 26.14,
    mttr: 73.46,
    disponibilidade: 26.24,
    criticidade: 'alta',
    position: { x: 100, y: 100 }
  },
  {
    id: 'TEB002',
    name: 'TEB002',
    falhas: 33,
    duracaoTotal: 116.73,
    criticidadeScore: 3852.20,
    mtbf: 117.19,
    mttr: 3.54,
    disponibilidade: 97.07,
    criticidade: 'media',
    position: { x: 250, y: 150 }
  },
  {
    id: 'TEB003',
    name: 'TEB003',
    falhas: 27,
    duracaoTotal: 59.08,
    criticidadeScore: 1595.25,
    mtbf: 145.37,
    mttr: 2.19,
    disponibilidade: 98.52,
    criticidade: 'baixa',
    position: { x: 400, y: 100 }
  },
  {
    id: 'TEB004',
    name: 'TEB004',
    falhas: 46,
    duracaoTotal: 283.67,
    criticidadeScore: 13048.67,
    mtbf: 80.44,
    mttr: 6.17,
    disponibilidade: 92.88,
    criticidade: 'media',
    position: { x: 550, y: 150 }
  },
  {
    id: 'TEB005',
    name: 'TEB005',
    falhas: 24,
    duracaoTotal: 124.35,
    criticidadeScore: 2984.40,
    mtbf: 160.82,
    mttr: 5.18,
    disponibilidade: 96.88,
    criticidade: 'baixa',
    position: { x: 100, y: 300 }
  },
  {
    id: 'TEB006',
    name: 'TEB006',
    falhas: 30,
    duracaoTotal: 72.17,
    criticidadeScore: 2165.00,
    mtbf: 130.39,
    mttr: 2.41,
    disponibilidade: 98.19,
    criticidade: 'baixa',
    position: { x: 250, y: 350 }
  },
  {
    id: 'TEB007',
    name: 'TEB007',
    falhas: 25,
    duracaoTotal: 81.13,
    criticidadeScore: 2028.33,
    mtbf: 156.11,
    mttr: 3.25,
    disponibilidade: 97.96,
    criticidade: 'baixa',
    position: { x: 400, y: 300 }
  },
  {
    id: 'TEB008',
    name: 'TEB008',
    falhas: 26,
    duracaoTotal: 80.90,
    criticidadeScore: 2103.40,
    mtbf: 150.12,
    mttr: 3.11,
    disponibilidade: 97.97,
    criticidade: 'baixa',
    position: { x: 550, y: 350 }
  }
];

export const kpisGerais = {
  totalFalhas: 251,
  tempoTotalParada: 3756.45,
  turbinaMaiorCriticidade: 'TEB001',
  eventosPorClassificacao: {
    1: 134, // Atividades corretivas
    2: 24,  // Atividades preventivas
    3: 28,  // Atividades solicitadas pelo proprietário
    4: 47,  // Condição ambiental
    5: 16   // Atividades corretivas programadas
  }
};

export const tendenciasMensais = [
  { mes: '2025-01', falhas: 30 },
  { mes: '2025-02', falhas: 50 },
  { mes: '2025-03', falhas: 78 },
  { mes: '2025-04', falhas: 22 },
  { mes: '2025-05', falhas: 46 },
  { mes: '2025-06', falhas: 25 }
];

export const classificacoes = {
  1: 'Atividades corretivas',
  2: 'Atividades preventivas',
  3: 'Atividades solicitadas pelo proprietário',
  4: 'Condição ambiental',
  5: 'Atividades corretivas programadas'
};

export const falhasPorTurbinaClassificacao = {
  'TEB001': { 1: 10, 2: 3, 3: 0, 4: 25, 5: 0 },
  'TEB002': { 1: 25, 2: 3, 3: 3, 4: 1, 5: 1 },
  'TEB003': { 1: 17, 2: 3, 3: 5, 4: 1, 5: 1 },
  'TEB004': { 1: 28, 2: 3, 3: 3, 4: 6, 5: 6 },
  'TEB005': { 1: 10, 2: 3, 3: 3, 4: 5, 5: 3 },
  'TEB006': { 1: 20, 2: 2, 3: 4, 4: 1, 5: 3 },
  'TEB007': { 1: 11, 2: 4, 3: 6, 4: 3, 5: 1 },
  'TEB008': { 1: 13, 2: 3, 3: 4, 4: 5, 5: 1 }
};

export const impactoAmbiental = {
  'TEB001': 15.28,
  'TEB002': 1.40,
  'TEB003': 0.17,
  'TEB004': 10.25,
  'TEB005': 3.13,
  'TEB006': 0.17,
  'TEB007': 0.43,
  'TEB008': 3.10
};

// Dados detalhados por período para filtros temporais
export const dadosPorPeriodo = {
  all: {
    kpis: kpisGerais,
    tendencias: tendenciasMensais,
    turbinas: turbineData
  },
  q1: {
    kpis: {
      totalFalhas: 158,
      tempoTotalParada: 2456.30,
      turbinaMaiorCriticidade: 'TEB001',
      eventosPorClassificacao: { 1: 85, 2: 15, 3: 18, 4: 30, 5: 10 }
    },
    tendencias: [
      { mes: '2025-01', falhas: 30 },
      { mes: '2025-02', falhas: 50 },
      { mes: '2025-03', falhas: 78 }
    ],
    turbinas: turbineData.map(t => ({
      ...t,
      falhas: Math.round(t.falhas * 0.63), // 63% das falhas no Q1
      duracaoTotal: t.duracaoTotal * 0.65,
      disponibilidade: t.disponibilidade + (t.disponibilidade < 50 ? 5 : 1)
    }))
  },
  q2: {
    kpis: {
      totalFalhas: 93,
      tempoTotalParada: 1300.15,
      turbinaMaiorCriticidade: 'TEB001',
      eventosPorClassificacao: { 1: 49, 2: 9, 3: 10, 4: 17, 5: 6 }
    },
    tendencias: [
      { mes: '2025-04', falhas: 22 },
      { mes: '2025-05', falhas: 46 },
      { mes: '2025-06', falhas: 25 }
    ],
    turbinas: turbineData.map(t => ({
      ...t,
      falhas: Math.round(t.falhas * 0.37), // 37% das falhas no Q2
      duracaoTotal: t.duracaoTotal * 0.35,
      disponibilidade: Math.min(99.5, t.disponibilidade + (t.disponibilidade < 50 ? 10 : 2))
    }))
  },
  jan: {
    kpis: {
      totalFalhas: 30,
      tempoTotalParada: 890.25,
      turbinaMaiorCriticidade: 'TEB001',
      eventosPorClassificacao: { 1: 18, 2: 3, 3: 2, 4: 5, 5: 2 }
    },
    tendencias: [{ mes: '2025-01', falhas: 30 }],
    turbinas: turbineData.map(t => ({
      ...t,
      falhas: Math.round(t.falhas * 0.12),
      duracaoTotal: t.duracaoTotal * 0.24,
      disponibilidade: t.disponibilidade + (t.disponibilidade < 50 ? 8 : 1.5)
    }))
  },
  feb: {
    kpis: {
      totalFalhas: 50,
      tempoTotalParada: 1245.80,
      turbinaMaiorCriticidade: 'TEB001',
      eventosPorClassificacao: { 1: 32, 2: 5, 3: 6, 4: 5, 5: 2 }
    },
    tendencias: [{ mes: '2025-02', falhas: 50 }],
    turbinas: turbineData.map(t => ({
      ...t,
      falhas: Math.round(t.falhas * 0.20),
      duracaoTotal: t.duracaoTotal * 0.33,
      disponibilidade: t.disponibilidade + (t.disponibilidade < 50 ? 6 : 1)
    }))
  },
  mar: {
    kpis: {
      totalFalhas: 78,
      tempoTotalParada: 1890.45,
      turbinaMaiorCriticidade: 'TEB001',
      eventosPorClassificacao: { 1: 48, 2: 8, 3: 12, 4: 8, 5: 2 }
    },
    tendencias: [{ mes: '2025-03', falhas: 78 }],
    turbinas: turbineData.map(t => ({
      ...t,
      falhas: Math.round(t.falhas * 0.31),
      duracaoTotal: t.duracaoTotal * 0.50,
      disponibilidade: t.disponibilidade - (t.disponibilidade < 50 ? 5 : 2)
    }))
  },
  apr: {
    kpis: {
      totalFalhas: 22,
      tempoTotalParada: 456.30,
      turbinaMaiorCriticidade: 'TEB001',
      eventosPorClassificacao: { 1: 12, 2: 3, 3: 2, 4: 4, 5: 1 }
    },
    tendencias: [{ mes: '2025-04', falhas: 22 }],
    turbinas: turbineData.map(t => ({
      ...t,
      falhas: Math.round(t.falhas * 0.09),
      duracaoTotal: t.duracaoTotal * 0.12,
      disponibilidade: Math.min(99.5, t.disponibilidade + (t.disponibilidade < 50 ? 12 : 2))
    }))
  },
  may: {
    kpis: {
      totalFalhas: 46,
      tempoTotalParada: 678.90,
      turbinaMaiorCriticidade: 'TEB001',
      eventosPorClassificacao: { 1: 28, 2: 4, 3: 6, 4: 6, 5: 2 }
    },
    tendencias: [{ mes: '2025-05', falhas: 46 }],
    turbinas: turbineData.map(t => ({
      ...t,
      falhas: Math.round(t.falhas * 0.18),
      duracaoTotal: t.duracaoTotal * 0.18,
      disponibilidade: t.disponibilidade + (t.disponibilidade < 50 ? 8 : 1)
    }))
  },
  jun: {
    kpis: {
      totalFalhas: 25,
      tempoTotalParada: 345.60,
      turbinaMaiorCriticidade: 'TEB001',
      eventosPorClassificacao: { 1: 15, 2: 2, 3: 3, 4: 4, 5: 1 }
    },
    tendencias: [{ mes: '2025-06', falhas: 25 }],
    turbinas: turbineData.map(t => ({
      ...t,
      falhas: Math.round(t.falhas * 0.10),
      duracaoTotal: t.duracaoTotal * 0.09,
      disponibilidade: Math.min(99.8, t.disponibilidade + (t.disponibilidade < 50 ? 15 : 2.5))
    }))
  },
  recent: {
    kpis: {
      totalFalhas: 18,
      tempoTotalParada: 234.50,
      turbinaMaiorCriticidade: 'TEB001',
      eventosPorClassificacao: { 1: 11, 2: 2, 3: 2, 4: 2, 5: 1 }
    },
    tendencias: [{ mes: 'Últimos 30 dias', falhas: 18 }],
    turbinas: turbineData.map(t => ({
      ...t,
      falhas: Math.round(t.falhas * 0.07),
      duracaoTotal: t.duracaoTotal * 0.06,
      disponibilidade: Math.min(99.9, t.disponibilidade + (t.disponibilidade < 50 ? 18 : 3))
    }))
  },
  peak: {
    kpis: {
      totalFalhas: 78,
      tempoTotalParada: 1890.45,
      turbinaMaiorCriticidade: 'TEB001',
      eventosPorClassificacao: { 1: 48, 2: 8, 3: 12, 4: 8, 5: 2 }
    },
    tendencias: [{ mes: '2025-03', falhas: 78 }],
    turbinas: turbineData.map(t => ({
      ...t,
      falhas: Math.round(t.falhas * 0.31),
      duracaoTotal: t.duracaoTotal * 0.50,
      disponibilidade: t.disponibilidade - (t.disponibilidade < 50 ? 5 : 2)
    }))
  }
};

// Função para obter dados filtrados por período
export const getDadosPorPeriodo = (periodo) => {
  return dadosPorPeriodo[periodo] || dadosPorPeriodo.all;
};

