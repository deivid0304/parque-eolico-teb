import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Download, FileText, Table, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import KPICard from './components/KPICard';
import TurbineMap from './components/TurbineMap';
import Dashboard from './components/Dashboard';
import Recommendations from './components/Recommendations';
import Benchmarking from './components/Benchmarking';
import DateFilter from './components/DateFilter';
import RealTimeData from './components/RealTimeData';
import AlertSystem from './components/AlertSystem';
import MLInsights from './components/MLInsights';
import { getDadosPorPeriodo } from './data/turbineData';
import { exportToPDF, exportToExcel, exportDashboardToPDF } from './utils/exportUtils';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isExporting, setIsExporting] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [realtimeData, setRealtimeData] = useState(null);
  const [mlPredictions, setMlPredictions] = useState(null);
  const { toast } = useToast();

  // Obter dados filtrados pelo período selecionado ou dados em tempo real
  const dadosFiltrados = realtimeData || getDadosPorPeriodo(selectedPeriod);
  const kpisGerais = realtimeData ? realtimeData.kpis : dadosFiltrados.kpis;

  const handleFilterChange = (period) => {
    setSelectedPeriod(period);
    setRealtimeData(null); // Limpar dados em tempo real ao aplicar filtro
    toast({
      title: "Filtro aplicado",
      description: `Dados atualizados para o período selecionado.`,
    });
  };

  const handleRealtimeDataUpdate = (data) => {
    setRealtimeData(data);
    setSelectedPeriod('realtime'); // Indicar que estamos usando dados em tempo real
    
    // Buscar previsões ML quando dados em tempo real são atualizados
    fetchMLPredictions();
  };

  const fetchMLPredictions = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/ml/predict/all');
      if (response.ok) {
        const data = await response.json();
        setMlPredictions(data);
      }
    } catch (error) {
      console.error('Erro ao buscar previsões ML:', error);
    }
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      const success = await exportToPDF();
      if (success) {
        toast({
          title: "Exportação concluída",
          description: "Relatório PDF gerado com sucesso!",
        });
      } else {
        throw new Error('Falha na exportação');
      }
    } catch (error) {
      toast({
        title: "Erro na exportação",
        description: "Não foi possível gerar o PDF. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportExcel = async () => {
    setIsExporting(true);
    try {
      const success = exportToExcel();
      if (success) {
        toast({
          title: "Exportação concluída",
          description: "Planilha Excel gerada com sucesso!",
        });
      } else {
        throw new Error('Falha na exportação');
      }
    } catch (error) {
      toast({
        title: "Erro na exportação",
        description: "Não foi possível gerar o Excel. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportDashboard = async () => {
    setIsExporting(true);
    try {
      const success = await exportDashboardToPDF();
      if (success) {
        toast({
          title: "Exportação concluída",
          description: "Dashboard exportado para PDF com sucesso!",
        });
      } else {
        throw new Error('Falha na exportação');
      }
    } catch (error) {
      toast({
        title: "Erro na exportação",
        description: "Não foi possível exportar o dashboard. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Parque Eólico TEB
              </h1>
              <p className="text-gray-600 mt-1">
                Dashboard de Manutenção e Confiabilidade
              </p>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={handleExportPDF} 
                disabled={isExporting}
                className="flex items-center gap-2"
              >
                {isExporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
                Exportar PDF
              </Button>
              <Button 
                variant="outline" 
                onClick={handleExportExcel} 
                disabled={isExporting}
                className="flex items-center gap-2"
              >
                {isExporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Table className="h-4 w-4" />}
                Exportar Excel
              </Button>
              {activeTab === 'dashboard' && (
                <Button 
                  variant="outline" 
                  onClick={handleExportDashboard} 
                  disabled={isExporting}
                  className="flex items-center gap-2"
                >
                  {isExporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                  Exportar Dashboard
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Sistema de Alertas */}
        <AlertSystem />
        
        {/* Dados em Tempo Real */}
        <RealTimeData onDataUpdate={handleRealtimeDataUpdate} />
        
        {/* Insights de Machine Learning */}
        {mlPredictions && <MLInsights predictions={mlPredictions} />}
        
        {/* Filtros */}
        <div className="mb-6 flex justify-between items-center">
          <DateFilter 
            onFilterChange={handleFilterChange} 
            currentFilter={selectedPeriod}
          />
          {selectedPeriod === 'realtime' ? (
            <div className="text-sm text-green-600 flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              Mostrando dados em tempo real
            </div>
          ) : selectedPeriod !== 'all' && (
            <div className="text-sm text-gray-600">
              Mostrando dados filtrados para o período selecionado
            </div>
          )}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="map">Mapa do Parque</TabsTrigger>
            <TabsTrigger value="recommendations">Recomendações</TabsTrigger>
            <TabsTrigger value="benchmarking">Benchmarking</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* KPIs Principais */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <KPICard
                title="Total de Falhas"
                value={kpisGerais.totalFalhas}
                subtitle={selectedPeriod === 'realtime' ? 'Dados em tempo real' : selectedPeriod === 'all' ? 'Período: Jan-Jun 2025' : 'Período filtrado'}
                icon={() => <div className="w-4 h-4 bg-blue-600 rounded"></div>}
                color="blue"
              />
              <KPICard
                title="Tempo Total de Parada"
                value={`${kpisGerais.tempoTotalParada.toFixed(0)}h`}
                subtitle="Todas as turbinas"
                icon={() => <div className="w-4 h-4 bg-red-600 rounded"></div>}
                color="red"
              />
              <KPICard
                title="Turbina Crítica"
                value={kpisGerais.turbinaMaiorCriticidade}
                subtitle="Maior criticidade"
                icon={() => <div className="w-4 h-4 bg-orange-600 rounded"></div>}
                color="orange"
              />
              <KPICard
                title="Falhas Corretivas"
                value={kpisGerais.eventosPorClassificacao[1]}
                subtitle={`${((kpisGerais.eventosPorClassificacao[1] / kpisGerais.totalFalhas) * 100).toFixed(1)}% do total`}
                icon={() => <div className="w-4 h-4 bg-green-600 rounded"></div>}
                color="green"
              />
            </div>

            {/* Resumo Executivo */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  Resumo Executivo
                </CardTitle>
                <p className="text-gray-600">
                  {selectedPeriod === 'realtime' 
                    ? 'Análise baseada em dados atualizados em tempo real'
                    : selectedPeriod === 'all' 
                    ? 'Análise consolidada do período de janeiro a junho de 2025'
                    : 'Análise do período filtrado selecionado'
                  }
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <h4 className="font-semibold text-red-800 mb-2">🚨 Situação Crítica</h4>
                      <p className="text-sm text-red-700">
                        A turbina TEB001 continua apresentando a maior criticidade no período analisado, 
                        requerendo atenção prioritária da equipe de manutenção.
                      </p>
                    </div>
                    
                    <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                      <h4 className="font-semibold text-orange-800 mb-2">⚠️ Manutenção Reativa</h4>
                      <p className="text-sm text-orange-700">
                        Proporção de falhas corretivas vs preventivas indica necessidade de 
                        reforçar estratégias de manutenção preventiva no período.
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <h4 className="font-semibold text-green-800 mb-2">✅ Pontos Positivos</h4>
                      <p className="text-sm text-green-700">
                        Turbinas TEB003, TEB006, TEB007 e TEB008 mantêm performance consistente 
                        mesmo com filtros temporais aplicados.
                      </p>
                    </div>
                    
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h4 className="font-semibold text-blue-800 mb-2">📈 Oportunidades</h4>
                      <p className="text-sm text-blue-700">
                        Análise temporal revela padrões sazonais que podem orientar 
                        planejamento preventivo mais eficaz.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="dashboard">
            <div data-export="dashboard">
              <Dashboard dadosFiltrados={dadosFiltrados} />
            </div>
          </TabsContent>

          <TabsContent value="map">
            <TurbineMap dadosFiltrados={dadosFiltrados} />
          </TabsContent>

          <TabsContent value="recommendations">
            <Recommendations dadosFiltrados={dadosFiltrados} />
          </TabsContent>

          <TabsContent value="benchmarking">
            <Benchmarking dadosFiltrados={dadosFiltrados} />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-gray-500 text-sm">
            <p>© 2025 Parque Eólico Toda Energia do Brasil - Dashboard de Manutenção</p>
            <p className="mt-1">
              {selectedPeriod === 'realtime' 
                ? 'Dados atualizados em tempo real'
                : selectedPeriod === 'all' 
                ? 'Dados do período: 01/01/2025 a 16/06/2025'
                : 'Dados filtrados por período selecionado'
              }
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;

