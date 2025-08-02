import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Filter, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const DateFilter = ({ onFilterChange, currentFilter }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState(currentFilter || 'all');

  const periods = [
    { value: 'all', label: 'Todos os Períodos', description: 'Jan-Jun 2025' },
    { value: 'q1', label: '1º Trimestre', description: 'Jan-Mar 2025' },
    { value: 'q2', label: '2º Trimestre', description: 'Abr-Jun 2025' },
    { value: 'jan', label: 'Janeiro', description: 'Jan 2025' },
    { value: 'feb', label: 'Fevereiro', description: 'Fev 2025' },
    { value: 'mar', label: 'Março', description: 'Mar 2025' },
    { value: 'apr', label: 'Abril', description: 'Abr 2025' },
    { value: 'may', label: 'Maio', description: 'Mai 2025' },
    { value: 'jun', label: 'Junho', description: 'Jun 2025' },
    { value: 'recent', label: 'Últimos 30 dias', description: 'Período mais recente' },
    { value: 'peak', label: 'Período de Pico', description: 'Mar 2025 (78 falhas)' }
  ];

  const handlePeriodSelect = (period) => {
    setSelectedPeriod(period);
    onFilterChange(period);
    setIsOpen(false);
  };

  const clearFilter = () => {
    setSelectedPeriod('all');
    onFilterChange('all');
  };

  const getCurrentPeriodLabel = () => {
    const period = periods.find(p => p.value === selectedPeriod);
    return period ? period.label : 'Todos os Períodos';
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2"
        >
          <Calendar className="h-4 w-4" />
          <Filter className="h-4 w-4" />
          {getCurrentPeriodLabel()}
        </Button>
        
        {selectedPeriod !== 'all' && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilter}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Filtrar por Período</h3>
            <div className="space-y-2">
              {periods.map((period) => (
                <button
                  key={period.value}
                  onClick={() => handlePeriodSelect(period.value)}
                  className={`w-full text-left p-3 rounded-lg border transition-colors ${
                    selectedPeriod === period.value
                      ? 'bg-blue-50 border-blue-200 text-blue-900'
                      : 'bg-white border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="font-medium">{period.label}</div>
                  <div className="text-sm text-gray-500">{period.description}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Overlay para fechar o dropdown */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default DateFilter;

