import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, TrendingUp, Wrench, Clock } from 'lucide-react';

const Recommendations = () => {
  const recommendations = [
    {
      priority: 'alta',
      icon: AlertTriangle,
      title: 'Intervenção Imediata - TEB001',
      description: 'Turbina com criticidade extrema (disponibilidade de apenas 26,24%). Requer inspeção completa e plano de ação urgente.',
      actions: [
        'Inspeção técnica completa em 48h',
        'Análise de causa raiz das 40 falhas registradas',
        'Revisão do plano de manutenção preventiva',
        'Monitoramento contínuo por 30 dias'
      ],
      impact: 'Alto',
      timeframe: '48 horas'
    },
    {
      priority: 'media',
      icon: TrendingUp,
      title: 'Otimização - TEB004 e TEB002',
      description: 'Turbinas com criticidade média necessitam de atenção para melhorar performance e reduzir tempo de reparo.',
      actions: [
        'Revisão dos procedimentos de manutenção',
        'Treinamento da equipe técnica',
        'Implementação de manutenção preditiva',
        'Análise de peças de reposição críticas'
      ],
      impact: 'Médio',
      timeframe: '2 semanas'
    },
    {
      priority: 'baixa',
      icon: Wrench,
      title: 'Manutenção Preventiva Intensificada',
      description: 'Proporção atual de 5,58:1 (corretiva/preventiva) indica necessidade de reforçar ações preventivas.',
      actions: [
        'Aumentar frequência de inspeções preventivas',
        'Implementar cronograma de manutenção baseado em condição',
        'Capacitação em técnicas preditivas',
        'Revisão de intervalos de manutenção'
      ],
      impact: 'Alto',
      timeframe: '1 mês'
    },
    {
      priority: 'media',
      icon: Clock,
      title: 'Redução do Tempo de Resposta',
      description: 'MTTR médio de 73,46h na TEB001 é crítico. Outras turbinas também podem ser otimizadas.',
      actions: [
        'Análise de logística de peças sobressalentes',
        'Otimização de rotas de manutenção',
        'Implementação de sistema de priorização',
        'Treinamento em diagnóstico rápido'
      ],
      impact: 'Médio',
      timeframe: '3 semanas'
    }
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'alta': return 'bg-red-100 text-red-800 border-red-200';
      case 'media': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'baixa': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityLabel = (priority) => {
    switch (priority) {
      case 'alta': return 'Prioridade Alta';
      case 'media': return 'Prioridade Média';
      case 'baixa': return 'Prioridade Baixa';
      default: return 'Prioridade';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Recomendações Estratégicas
          </CardTitle>
          <p className="text-gray-600">
            Ações prioritárias baseadas na análise de dados de manutenção do parque eólico TEB
          </p>
        </CardHeader>
      </Card>

      <div className="grid gap-6">
        {recommendations.map((rec, index) => {
          const IconComponent = rec.icon;
          return (
            <Card key={index} className="border-l-4 border-l-blue-500">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <IconComponent className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-semibold text-gray-900">
                        {rec.title}
                      </CardTitle>
                      <p className="text-sm text-gray-600 mt-1">
                        {rec.description}
                      </p>
                    </div>
                  </div>
                  <Badge className={`${getPriorityColor(rec.priority)} border`}>
                    {getPriorityLabel(rec.priority)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Ações Recomendadas:</h4>
                    <ul className="space-y-2">
                      {rec.actions.map((action, actionIndex) => (
                        <li key={actionIndex} className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-sm text-gray-700">{action}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex gap-4">
                      <div>
                        <span className="text-xs text-gray-500">Impacto Esperado</span>
                        <div className="font-semibold text-sm text-gray-900">{rec.impact}</div>
                      </div>
                      <div>
                        <span className="text-xs text-gray-500">Prazo</span>
                        <div className="font-semibold text-sm text-gray-900">{rec.timeframe}</div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Criar Plano de Ação
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Resumo Executivo */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-blue-900">
            Resumo Executivo - Próximos Passos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4">
              <div className="text-2xl font-bold text-red-600">1</div>
              <div className="text-sm font-semibold text-gray-900">Intervenção Imediata</div>
              <div className="text-xs text-gray-600">TEB001 - 48h</div>
            </div>
            <div className="text-center p-4">
              <div className="text-2xl font-bold text-orange-600">3</div>
              <div className="text-sm font-semibold text-gray-900">Ações de Médio Prazo</div>
              <div className="text-xs text-gray-600">2-4 semanas</div>
            </div>
            <div className="text-center p-4">
              <div className="text-2xl font-bold text-green-600">97%</div>
              <div className="text-sm font-semibold text-gray-900">Meta de Disponibilidade</div>
              <div className="text-xs text-gray-600">Para todas as turbinas</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Recommendations;

