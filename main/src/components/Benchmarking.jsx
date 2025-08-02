import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { turbineData } from '../data/turbineData';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const Benchmarking = () => {
  // Ordenar turbinas por disponibilidade
  const turbinesByAvailability = [...turbineData].sort((a, b) => b.disponibilidade - a.disponibilidade);
  
  // Ordenar turbinas por MTBF
  const turbinesByMTBF = [...turbineData].sort((a, b) => b.mtbf - a.mtbf);
  
  // Ordenar turbinas por MTTR (menor é melhor)
  const turbinesByMTTR = [...turbineData].sort((a, b) => a.mttr - b.mttr);

  // Dados para gráfico comparativo
  const comparisonData = turbineData.map(turbine => ({
    name: turbine.name,
    disponibilidade: turbine.disponibilidade,
    mtbf: turbine.mtbf,
    mttr: turbine.mttr
  }));

  const getPerformanceIcon = (position, total) => {
    if (position <= total * 0.3) return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (position >= total * 0.7) return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <Minus className="h-4 w-4 text-orange-600" />;
  };

  const getPerformanceBadge = (position, total) => {
    if (position <= total * 0.3) return <Badge className="bg-green-100 text-green-800">Excelente</Badge>;
    if (position >= total * 0.7) return <Badge className="bg-red-100 text-red-800">Crítico</Badge>;
    return <Badge className="bg-orange-100 text-orange-800">Médio</Badge>;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Benchmarking Interno
          </CardTitle>
          <p className="text-gray-600">
            Comparativo de performance entre as turbinas do parque eólico TEB
          </p>
        </CardHeader>
      </Card>

      {/* Gráfico Comparativo */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-900">
            Comparativo de Disponibilidade
          </CardTitle>
          <p className="text-sm text-gray-600">
            Percentual de disponibilidade por turbina
          </p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={comparisonData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip 
                formatter={(value) => [`${value.toFixed(2)}%`, 'Disponibilidade']}
              />
              <Bar 
                dataKey="disponibilidade" 
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ranking por Disponibilidade */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-bold text-gray-900">
              Ranking - Disponibilidade
            </CardTitle>
            <p className="text-sm text-gray-600">
              Ordenado por maior disponibilidade
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {turbinesByAvailability.map((turbine, index) => (
                <div key={turbine.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-bold text-blue-800">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{turbine.name}</div>
                      <div className="text-sm text-gray-600">{turbine.disponibilidade.toFixed(2)}%</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getPerformanceIcon(index + 1, turbinesByAvailability.length)}
                    {getPerformanceBadge(index + 1, turbinesByAvailability.length)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Ranking por MTBF */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-bold text-gray-900">
              Ranking - MTBF
            </CardTitle>
            <p className="text-sm text-gray-600">
              Tempo médio entre falhas (horas)
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {turbinesByMTBF.map((turbine, index) => (
                <div key={turbine.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-sm font-bold text-green-800">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{turbine.name}</div>
                      <div className="text-sm text-gray-600">{turbine.mtbf.toFixed(2)}h</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getPerformanceIcon(index + 1, turbinesByMTBF.length)}
                    {getPerformanceBadge(index + 1, turbinesByMTBF.length)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Ranking por MTTR */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-bold text-gray-900">
              Ranking - MTTR
            </CardTitle>
            <p className="text-sm text-gray-600">
              Tempo médio de reparo (horas)
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {turbinesByMTTR.map((turbine, index) => (
                <div key={turbine.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-sm font-bold text-orange-800">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{turbine.name}</div>
                      <div className="text-sm text-gray-600">{turbine.mttr.toFixed(2)}h</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getPerformanceIcon(index + 1, turbinesByMTTR.length)}
                    {getPerformanceBadge(index + 1, turbinesByMTTR.length)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Análise Comparativa */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-900">
            Análise Comparativa de Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">🏆 Melhores Performers</h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li><strong>TEB003:</strong> Maior disponibilidade (98,52%) e menor MTTR (2,19h)</li>
                  <li><strong>TEB005:</strong> Maior MTBF (160,82h) - mais confiável</li>
                  <li><strong>TEB006:</strong> Segundo menor MTTR (2,41h) - reparo rápido</li>
                </ul>
              </div>
              
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">📊 Benchmarks Internos</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li><strong>Disponibilidade média:</strong> 88,59%</li>
                  <li><strong>MTBF médio:</strong> 108,20h</li>
                  <li><strong>MTTR médio:</strong> 12,43h</li>
                </ul>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <h4 className="font-semibold text-red-800 mb-2">⚠️ Necessitam Atenção</h4>
                <ul className="text-sm text-red-700 space-y-1">
                  <li><strong>TEB001:</strong> Disponibilidade crítica (26,24%) e MTTR extremo (73,46h)</li>
                  <li><strong>TEB004:</strong> Disponibilidade abaixo da média (92,88%)</li>
                  <li><strong>TEB002:</strong> Performance intermediária, mas com potencial de melhoria</li>
                </ul>
              </div>
              
              <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <h4 className="font-semibold text-orange-800 mb-2">🎯 Metas Sugeridas</h4>
                <ul className="text-sm text-orange-700 space-y-1">
                  <li><strong>Disponibilidade:</strong> Mínimo 97% para todas as turbinas</li>
                  <li><strong>MTBF:</strong> Aumentar para 150h+ (padrão das melhores)</li>
                  <li><strong>MTTR:</strong> Reduzir para máximo 5h (exceto casos críticos)</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Benchmarking;

