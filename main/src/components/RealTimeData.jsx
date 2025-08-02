import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw, Wifi, WifiOff, Activity } from 'lucide-react';

const RealTimeData = ({ onDataUpdate }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [realtimeData, setRealtimeData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const API_BASE_URL = 'http://localhost:5001/api';

  const fetchRealtimeData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/turbines/realtime`);
      if (response.ok) {
        const data = await response.json();
        setRealtimeData(data);
        setLastUpdate(new Date(data.timestamp));
        setIsConnected(true);
        
        // Notificar componente pai sobre os novos dados
        if (onDataUpdate) {
          onDataUpdate(data);
        }
      } else {
        throw new Error('Falha na conexão com a API');
      }
    } catch (error) {
      console.error('Erro ao buscar dados em tempo real:', error);
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Buscar dados iniciais
    fetchRealtimeData();

    // Configurar atualização automática
    let interval;
    if (autoRefresh) {
      interval = setInterval(fetchRealtimeData, 30000); // Atualizar a cada 30 segundos
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh]);

  const formatTime = (date) => {
    if (!date) return 'Nunca';
    return date.toLocaleTimeString('pt-BR');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'operational': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Dados em Tempo Real
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              Última atualização: {formatTime(lastUpdate)}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              {isConnected ? (
                <Wifi className="h-4 w-4 text-green-600" />
              ) : (
                <WifiOff className="h-4 w-4 text-red-600" />
              )}
              <span className="text-sm">
                {isConnected ? 'Conectado' : 'Desconectado'}
              </span>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={autoRefresh ? 'bg-green-50 border-green-200' : ''}
            >
              {autoRefresh ? 'Auto ON' : 'Auto OFF'}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={fetchRealtimeData}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      {realtimeData && (
        <CardContent>
          {/* KPIs em Tempo Real */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="text-2xl font-bold text-blue-900">
                {realtimeData.kpis.total_failures}
              </div>
              <div className="text-sm text-blue-700">Total de Falhas</div>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="text-2xl font-bold text-green-900">
                {realtimeData.kpis.avg_availability}%
              </div>
              <div className="text-sm text-green-700">Disponibilidade Média</div>
            </div>
            
            <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
              <div className="text-2xl font-bold text-orange-900">
                {realtimeData.kpis.critical_turbines.length}
              </div>
              <div className="text-sm text-orange-700">Turbinas Críticas</div>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <div className="text-2xl font-bold text-purple-900">
                {realtimeData.kpis.total_power_output} MW
              </div>
              <div className="text-sm text-purple-700">Potência Total</div>
            </div>
          </div>

          {/* Status das Turbinas */}
          <div>
            <h4 className="font-semibold mb-3">Status das Turbinas</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {realtimeData.turbines.map((turbine) => (
                <div key={turbine.id} className="border rounded-lg p-3 bg-white">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-medium">{turbine.name}</span>
                    <Badge className={getStatusColor(turbine.status)}>
                      {turbine.status}
                    </Badge>
                  </div>
                  
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Disponibilidade:</span>
                      <span className="font-medium">{turbine.availability}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Potência:</span>
                      <span className="font-medium">{turbine.power_output} MW</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Vento:</span>
                      <span className="font-medium">{turbine.wind_speed} m/s</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Temp:</span>
                      <span className="font-medium">{turbine.temperature}°C</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default RealTimeData;

