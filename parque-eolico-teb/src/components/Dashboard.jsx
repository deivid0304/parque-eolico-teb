import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { kpisGerais, tendenciasMensais, classificacoes } from '../data/turbineData';

const Dashboard = () => {
  // Dados para o gráfico de pizza das classificações
  const classificacaoData = Object.entries(kpisGerais.eventosPorClassificacao).map(([key, value]) => ({
    name: classificacoes[key],
    value: value,
    key: key
  }));

  // Cores para o gráfico de pizza
  const COLORS = ['#ef4444', '#10b981', '#3b82f6', '#f59e0b', '#8b5cf6'];

  // Dados para o gráfico de tendências mensais
  const tendenciasData = tendenciasMensais.map(item => ({
    mes: item.mes.substring(5), // Pega apenas MM
    falhas: item.falhas
  }));

  return (
    <div className="space-y-6">
      {/* Gráfico de Tendências Mensais */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-900">
            Tendências Mensais de Falhas
          </CardTitle>
          <p className="text-sm text-gray-600">
            Evolução das ocorrências ao longo dos meses de 2025
          </p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={tendenciasData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip 
                formatter={(value) => [value, 'Falhas']}
                labelFormatter={(label) => `Mês ${label}/2025`}
              />
              <Line 
                type="monotone" 
                dataKey="falhas" 
                stroke="#3b82f6" 
                strokeWidth={3}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Insight:</strong> Março apresentou o pico de falhas (78), seguido por uma redução significativa em abril (22). 
              Maio mostrou um aumento para 46 falhas, indicando possível padrão sazonal.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Barras - Classificações */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-bold text-gray-900">
              Falhas por Classificação
            </CardTitle>
            <p className="text-sm text-gray-600">
              Distribuição dos tipos de eventos registrados
            </p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={classificacaoData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={120} />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Gráfico de Pizza - Proporções */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-bold text-gray-900">
              Proporção de Eventos
            </CardTitle>
            <p className="text-sm text-gray-600">
              Distribuição percentual por tipo de classificação
            </p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={classificacaoData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {classificacaoData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [value, name]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {classificacaoData.map((entry, index) => (
                <div key={entry.key} className="flex items-center gap-2 text-sm">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></div>
                  <span className="text-gray-700">{entry.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Insights e Análises */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-900">
            Análises e Insights Estratégicos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <h4 className="font-semibold text-red-800 mb-2">🚨 Alerta Crítico</h4>
                <p className="text-sm text-red-700">
                  A proporção de falhas corretivas vs preventivas é de 5,58:1, indicando 
                  manutenção reativa excessiva. Recomenda-se intensificar a manutenção preventiva.
                </p>
              </div>
              
              <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <h4 className="font-semibold text-orange-800 mb-2">⚠️ Condições Ambientais</h4>
                <p className="text-sm text-orange-700">
                  47 eventos relacionados a condições ambientais (18,7% do total). 
                  TEB001 é a mais afetada com 15,28h de parada por fatores ambientais.
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">📊 Padrão Temporal</h4>
                <p className="text-sm text-blue-700">
                  Março registrou o maior número de falhas (78), representando 31% das 
                  ocorrências do período. Sugere-se investigar fatores sazonais específicos.
                </p>
              </div>
              
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">✅ Oportunidade</h4>
                <p className="text-sm text-green-700">
                  TEB003, TEB006, TEB007 e TEB008 apresentam disponibilidade superior a 97%, 
                  servindo como benchmark para as demais turbinas.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;

