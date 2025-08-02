import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { turbineData } from '../data/turbineData';

const TurbineMap = () => {
  const getCriticalityColor = (criticidade) => {
    switch (criticidade) {
      case 'alta': return 'bg-red-500 border-red-600';
      case 'media': return 'bg-orange-500 border-orange-600';
      case 'baixa': return 'bg-green-500 border-green-600';
      default: return 'bg-gray-500 border-gray-600';
    }
  };

  const getCriticalityLabel = (criticidade) => {
    switch (criticidade) {
      case 'alta': return 'Alta Criticidade';
      case 'media': return 'Média Criticidade';
      case 'baixa': return 'Baixa Criticidade';
      default: return 'Desconhecida';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-gray-900">
          Mapa Visual do Parque Eólico TEB
        </CardTitle>
        <p className="text-sm text-gray-600">
          Visualização das 8 turbinas com indicação de criticidade
        </p>
      </CardHeader>
      <CardContent>
        <div className="relative bg-gradient-to-br from-blue-50 to-green-50 rounded-lg p-8 min-h-[500px]">
          {/* Legenda */}
          <div className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-md">
            <h4 className="font-semibold text-sm mb-2">Legenda</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded-full border-2 border-red-600"></div>
                <span className="text-xs">Alta Criticidade</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-orange-500 rounded-full border-2 border-orange-600"></div>
                <span className="text-xs">Média Criticidade</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded-full border-2 border-green-600"></div>
                <span className="text-xs">Baixa Criticidade</span>
              </div>
            </div>
          </div>

          {/* Turbinas */}
          {turbineData.map((turbine) => (
            <div
              key={turbine.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
              style={{
                left: `${turbine.position.x}px`,
                top: `${turbine.position.y}px`
              }}
            >
              {/* Turbina */}
              <div className={`w-12 h-12 rounded-full border-4 ${getCriticalityColor(turbine.criticidade)} 
                             flex items-center justify-center text-white font-bold text-xs
                             shadow-lg hover:scale-110 transition-transform duration-200`}>
                {turbine.name.slice(-2)}
              </div>
              
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 
                            opacity-0 group-hover:opacity-100 transition-opacity duration-200
                            bg-gray-900 text-white p-3 rounded-lg shadow-lg min-w-[200px] z-10">
                <div className="text-sm font-semibold">{turbine.name}</div>
                <div className="text-xs mt-1 space-y-1">
                  <div>Falhas: {turbine.falhas}</div>
                  <div>MTTR: {turbine.mttr.toFixed(2)}h</div>
                  <div>Disponibilidade: {turbine.disponibilidade.toFixed(1)}%</div>
                  <Badge 
                    variant="secondary" 
                    className={`mt-1 ${
                      turbine.criticidade === 'alta' ? 'bg-red-100 text-red-800' :
                      turbine.criticidade === 'media' ? 'bg-orange-100 text-orange-800' :
                      'bg-green-100 text-green-800'
                    }`}
                  >
                    {getCriticalityLabel(turbine.criticidade)}
                  </Badge>
                </div>
                {/* Seta do tooltip */}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 
                              border-4 border-transparent border-t-gray-900"></div>
              </div>
            </div>
          ))}

          {/* Elementos decorativos do parque */}
          <div className="absolute bottom-4 left-4 text-xs text-gray-500">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span>Parque Eólico Toda Energia do Brasil</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TurbineMap;

