import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Bell, BellRing, X, AlertTriangle, AlertCircle, Info, CheckCircle } from 'lucide-react';

const AlertSystem = () => {
  const [alerts, setAlerts] = useState([]);
  const [isEnabled, setIsEnabled] = useState(true);
  const [lastCheck, setLastCheck] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  const API_BASE_URL = 'http://localhost:5001/api';

  const fetchAlerts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/alerts`);
      if (response.ok) {
        const data = await response.json();
        setAlerts(data.alerts || []);
        setLastCheck(new Date());
        
        // Contar alertas não lidos
        const unread = data.alerts.filter(alert => !alert.read).length;
        setUnreadCount(unread);
      }
    } catch (error) {
      console.error('Erro ao buscar alertas:', error);
    }
  };

  const fetchMLPredictions = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/ml/predict/all`);
      if (response.ok) {
        const data = await response.json();
        
        // Gerar alertas baseados nas previsões ML
        const mlAlerts = [];
        
        data.predictions.forEach(prediction => {
          if (prediction.failure_probability > 0.7) {
            mlAlerts.push({
              id: `ml_critical_${prediction.turbine_id}_${Date.now()}`,
              type: 'critical',
              source: 'ml_prediction',
              turbine_id: prediction.turbine_id,
              title: `Falha Iminente Detectada - ${prediction.turbine_id}`,
              message: `Probabilidade de falha: ${(prediction.failure_probability * 100).toFixed(1)}%. Ação imediata necessária.`,
              timestamp: new Date().toISOString(),
              priority: 'critical',
              read: false,
              actions: ['immediate_maintenance']
            });
          } else if (prediction.failure_probability > 0.4) {
            mlAlerts.push({
              id: `ml_warning_${prediction.turbine_id}_${Date.now()}`,
              type: 'warning',
              source: 'ml_prediction',
              turbine_id: prediction.turbine_id,
              title: `Risco Elevado - ${prediction.turbine_id}`,
              message: `Probabilidade de falha: ${(prediction.failure_probability * 100).toFixed(1)}%. Agendar manutenção preventiva.`,
              timestamp: new Date().toISOString(),
              priority: 'high',
              read: false,
              actions: ['schedule_maintenance']
            });
          }
          
          if (prediction.anomaly_detected) {
            mlAlerts.push({
              id: `ml_anomaly_${prediction.turbine_id}_${Date.now()}`,
              type: 'anomaly',
              source: 'ml_prediction',
              turbine_id: prediction.turbine_id,
              title: `Anomalia Detectada - ${prediction.turbine_id}`,
              message: `Comportamento anômalo identificado pelo sistema de ML. Investigação recomendada.`,
              timestamp: new Date().toISOString(),
              priority: 'medium',
              read: false,
              actions: ['investigate']
            });
          }
        });
        
        // Adicionar alertas ML aos alertas existentes
        if (mlAlerts.length > 0) {
          setAlerts(prev => {
            const existingIds = new Set(prev.map(a => a.id));
            const newAlerts = mlAlerts.filter(a => !existingIds.has(a.id));
            return [...prev, ...newAlerts];
          });
          
          setUnreadCount(prev => prev + mlAlerts.length);
        }
      }
    } catch (error) {
      console.error('Erro ao buscar previsões ML:', error);
    }
  };

  useEffect(() => {
    if (isEnabled) {
      // Buscar alertas iniciais
      fetchAlerts();
      fetchMLPredictions();

      // Configurar verificação periódica
      const interval = setInterval(() => {
        fetchAlerts();
        fetchMLPredictions();
      }, 60000); // Verificar a cada minuto

      return () => clearInterval(interval);
    }
  }, [isEnabled]);

  const markAsRead = (alertId) => {
    setAlerts(prev => 
      prev.map(alert => 
        alert.id === alertId ? { ...alert, read: true } : alert
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const dismissAlert = (alertId) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
    setUnreadCount(prev => {
      const alert = alerts.find(a => a.id === alertId);
      return alert && !alert.read ? Math.max(0, prev - 1) : prev;
    });
  };

  const clearAllAlerts = () => {
    setAlerts([]);
    setUnreadCount(0);
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'critical': return <AlertTriangle className="h-5 w-5 text-red-600" />;
      case 'warning': return <AlertCircle className="h-5 w-5 text-yellow-600" />;
      case 'anomaly': return <Info className="h-5 w-5 text-blue-600" />;
      case 'success': return <CheckCircle className="h-5 w-5 text-green-600" />;
      default: return <Info className="h-5 w-5 text-gray-600" />;
    }
  };

  const getAlertColor = (type) => {
    switch (type) {
      case 'critical': return 'bg-red-50 border-red-200 text-red-800';
      case 'warning': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'anomaly': return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'success': return 'bg-green-50 border-green-200 text-green-800';
      default: return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getPriorityBadge = (priority) => {
    const colors = {
      critical: 'bg-red-100 text-red-800 border-red-200',
      high: 'bg-orange-100 text-orange-800 border-orange-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      low: 'bg-green-100 text-green-800 border-green-200'
    };
    
    return (
      <Badge className={colors[priority] || colors.medium}>
        {priority?.toUpperCase()}
      </Badge>
    );
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Ordenar alertas por prioridade e timestamp
  const sortedAlerts = [...alerts].sort((a, b) => {
    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    const aPriority = priorityOrder[a.priority] || 2;
    const bPriority = priorityOrder[b.priority] || 2;
    
    if (aPriority !== bPriority) {
      return aPriority - bPriority;
    }
    
    return new Date(b.timestamp) - new Date(a.timestamp);
  });

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="relative">
              {isEnabled && unreadCount > 0 ? (
                <BellRing className="h-5 w-5 text-red-600" />
              ) : (
                <Bell className="h-5 w-5" />
              )}
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </div>
            <div>
              <CardTitle>Sistema de Alertas</CardTitle>
              <p className="text-sm text-gray-600">
                {lastCheck ? `Última verificação: ${formatTime(lastCheck)}` : 'Aguardando verificação...'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEnabled(!isEnabled)}
              className={isEnabled ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}
            >
              {isEnabled ? 'Ativo' : 'Inativo'}
            </Button>
            
            {alerts.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearAllAlerts}
              >
                Limpar Todos
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {!isEnabled && (
          <Alert className="mb-4">
            <Info className="h-4 w-4" />
            <AlertDescription>
              Sistema de alertas desativado. Ative para receber notificações em tempo real.
            </AlertDescription>
          </Alert>
        )}
        
        {alerts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <CheckCircle className="h-12 w-12 mx-auto mb-3 text-green-500" />
            <p className="text-lg font-medium">Nenhum alerta ativo</p>
            <p className="text-sm">Todas as turbinas estão operando normalmente</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {sortedAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 rounded-lg border ${getAlertColor(alert.type)} ${
                  !alert.read ? 'ring-2 ring-blue-200' : ''
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-3 flex-1">
                    {getAlertIcon(alert.type)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold">{alert.title}</h4>
                        {getPriorityBadge(alert.priority)}
                      </div>
                      <p className="text-sm mb-2">{alert.message}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-600">
                        <span>Turbina: {alert.turbine_id}</span>
                        <span>Hora: {formatTime(alert.timestamp)}</span>
                        <span>Fonte: {alert.source === 'ml_prediction' ? 'ML' : 'Sistema'}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1 ml-3">
                    {!alert.read && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => markAsRead(alert.id)}
                        className="h-8 w-8 p-0"
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => dismissAlert(alert.id)}
                      className="h-8 w-8 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AlertSystem;

