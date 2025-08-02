import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Brain, TrendingUp, AlertTriangle, Target, Zap } from 'lucide-react';

const MLInsights = ({ predictions }) => {
  if (!predictions || !predictions.predictions) {
    return null;
  }

  const { predictions: turbinePredictions, summary } = predictions;

  // Encontrar turbinas com maior risco
  const highRiskTurbines = turbinePredictions
    .filter(p => p.failure_probability > 0.4)
    .sort((a, b) => b.failure_probability - a.failure_probability);

  // Calcular insights
  const avgFailureProbability = turbinePredictions.reduce((sum, p) => sum + p.failure_probability, 0) / turbinePredictions.length;
  const turbinesNeedingAction = turbinePredictions.filter(p => p.priority === 'critical' || p.priority === 'high').length;

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-purple-600" />
          Insights de Machine Learning
        </CardTitle>
        <p className="text-sm text-gray-600">
          Análises preditivas baseadas em algoritmos de Random Forest e detecção de anomalias
        </p>
      </CardHeader>
      
      <CardContent>
        {/* Resumo Geral */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-800">Risco Médio</span>
            </div>
            <div className="text-2xl font-bold text-purple-900">
              {(avgFailureProbability * 100).toFixed(1)}%
            </div>
          </div>
          
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <span className="text-sm font-medium text-red-800">Ação Necessária</span>
            </div>
            <div className="text-2xl font-bold text-red-900">
              {turbinesNeedingAction}
            </div>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">Anomalias</span>
            </div>
            <div className="text-2xl font-bold text-blue-900">
              {summary.anomalies_detected}
            </div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-800">Disponibilidade</span>
            </div>
            <div className="text-2xl font-bold text-green-900">
              {summary.avg_predicted_availability}%
            </div>
          </div>
        </div>

        {/* Turbinas de Alto Risco */}
        {highRiskTurbines.length > 0 && (
          <div className="mb-6">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              Turbinas de Alto Risco
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {highRiskTurbines.slice(0, 4).map((turbine) => (
                <div key={turbine.turbine_id} className="border rounded-lg p-4 bg-white">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-medium">{turbine.turbine_id}</span>
                    <Badge className={
                      turbine.priority === 'critical' 
                        ? 'bg-red-100 text-red-800 border-red-200'
                        : 'bg-orange-100 text-orange-800 border-orange-200'
                    }>
                      {turbine.priority.toUpperCase()}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Prob. Falha:</span>
                      <span className="font-medium text-red-600">
                        {(turbine.failure_probability * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Dias p/ Falha:</span>
                      <span className="font-medium">
                        {turbine.estimated_days_to_failure} dias
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Ação:</span>
                      <span className="font-medium text-blue-600">
                        {turbine.recommended_action === 'immediate_maintenance' ? 'Manutenção Imediata' :
                         turbine.recommended_action === 'schedule_maintenance' ? 'Agendar Manutenção' :
                         turbine.recommended_action === 'monitor_closely' ? 'Monitorar' : 'Rotina'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Confiança:</span>
                      <span className="font-medium">
                        {(turbine.confidence * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                  
                  {turbine.anomaly_detected && (
                    <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-800">
                      ⚠️ Anomalia detectada - Investigação recomendada
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recomendações Estratégicas */}
        <div>
          <h4 className="font-semibold mb-3">Recomendações Estratégicas</h4>
          <div className="space-y-3">
            {summary.critical_actions_needed > 0 && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <h5 className="font-medium text-red-800 mb-2">🚨 Ação Crítica Necessária</h5>
                <p className="text-sm text-red-700">
                  {summary.critical_actions_needed} turbina(s) requerem manutenção imediata. 
                  Priorize a intervenção para evitar paradas não programadas.
                </p>
              </div>
            )}
            
            {summary.anomalies_detected > 0 && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h5 className="font-medium text-blue-800 mb-2">🔍 Anomalias Detectadas</h5>
                <p className="text-sm text-blue-700">
                  {summary.anomalies_detected} turbina(s) apresentam comportamento anômalo. 
                  Investigação técnica recomendada para identificar causas.
                </p>
              </div>
            )}
            
            {summary.avg_predicted_availability < 90 && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h5 className="font-medium text-yellow-800 mb-2">📈 Oportunidade de Melhoria</h5>
                <p className="text-sm text-yellow-700">
                  Disponibilidade média prevista de {summary.avg_predicted_availability}% está abaixo do ideal. 
                  Considere intensificar manutenção preventiva.
                </p>
              </div>
            )}
            
            {summary.avg_predicted_availability >= 95 && summary.critical_actions_needed === 0 && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h5 className="font-medium text-green-800 mb-2">✅ Performance Excelente</h5>
                <p className="text-sm text-green-700">
                  Parque operando com alta disponibilidade prevista. 
                  Manter estratégia atual de manutenção.
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MLInsights;

