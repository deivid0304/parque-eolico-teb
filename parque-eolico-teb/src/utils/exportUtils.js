import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { turbineData, kpisGerais, tendenciasMensais, falhasPorTurbinaClassificacao, impactoAmbiental } from '../data/turbineData';

export const exportToPDF = async () => {
  try {
    // Criar um novo documento PDF
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    // Título do relatório
    pdf.setFontSize(20);
    pdf.text('Relatório de Manutenção - Parque Eólico TEB', 20, 20);
    
    pdf.setFontSize(12);
    pdf.text('Período: 01/01/2025 a 16/06/2025', 20, 30);
    
    // KPIs Principais
    pdf.setFontSize(16);
    pdf.text('KPIs Principais', 20, 45);
    
    pdf.setFontSize(12);
    pdf.text(`Total de Falhas: ${kpisGerais.totalFalhas}`, 20, 55);
    pdf.text(`Tempo Total de Parada: ${kpisGerais.tempoTotalParada.toFixed(2)}h`, 20, 65);
    pdf.text(`Turbina com Maior Criticidade: ${kpisGerais.turbinaMaiorCriticidade}`, 20, 75);
    
    // Dados das Turbinas
    pdf.setFontSize(16);
    pdf.text('Dados das Turbinas', 20, 95);
    
    let yPosition = 105;
    turbineData.forEach((turbine, index) => {
      if (yPosition > 250) {
        pdf.addPage();
        yPosition = 20;
      }
      
      pdf.setFontSize(12);
      pdf.text(`${turbine.name}:`, 20, yPosition);
      pdf.text(`  Falhas: ${turbine.falhas}`, 25, yPosition + 8);
      pdf.text(`  MTTR: ${turbine.mttr.toFixed(2)}h`, 25, yPosition + 16);
      pdf.text(`  Disponibilidade: ${turbine.disponibilidade.toFixed(2)}%`, 25, yPosition + 24);
      pdf.text(`  Criticidade: ${turbine.criticidade}`, 25, yPosition + 32);
      
      yPosition += 45;
    });
    
    // Nova página para tendências
    pdf.addPage();
    pdf.setFontSize(16);
    pdf.text('Tendências Mensais', 20, 20);
    
    yPosition = 30;
    tendenciasMensais.forEach(item => {
      pdf.setFontSize(12);
      pdf.text(`${item.mes}: ${item.falhas} falhas`, 20, yPosition);
      yPosition += 10;
    });
    
    // Recomendações
    pdf.setFontSize(16);
    pdf.text('Recomendações Principais', 20, yPosition + 20);
    
    pdf.setFontSize(12);
    pdf.text('1. Intervenção imediata na TEB001', 20, yPosition + 35);
    pdf.text('2. Intensificar manutenção preventiva', 20, yPosition + 45);
    pdf.text('3. Implementar manutenção preditiva', 20, yPosition + 55);
    pdf.text('4. Otimizar tempo de resposta', 20, yPosition + 65);
    
    // Salvar o PDF
    pdf.save('relatorio-parque-eolico-teb.pdf');
    
    return true;
  } catch (error) {
    console.error('Erro ao gerar PDF:', error);
    return false;
  }
};

export const exportToExcel = () => {
  try {
    // Criar um novo workbook
    const wb = XLSX.utils.book_new();
    
    // Aba 1: KPIs Gerais
    const kpisData = [
      ['Métrica', 'Valor'],
      ['Total de Falhas', kpisGerais.totalFalhas],
      ['Tempo Total de Parada (h)', kpisGerais.tempoTotalParada.toFixed(2)],
      ['Turbina com Maior Criticidade', kpisGerais.turbinaMaiorCriticidade],
      ['', ''],
      ['Classificação', 'Quantidade'],
      ['Atividades Corretivas', kpisGerais.eventosPorClassificacao[1]],
      ['Atividades Preventivas', kpisGerais.eventosPorClassificacao[2]],
      ['Atividades Solicitadas', kpisGerais.eventosPorClassificacao[3]],
      ['Condição Ambiental', kpisGerais.eventosPorClassificacao[4]],
      ['Atividades Corretivas Programadas', kpisGerais.eventosPorClassificacao[5]]
    ];
    
    const ws1 = XLSX.utils.aoa_to_sheet(kpisData);
    XLSX.utils.book_append_sheet(wb, ws1, 'KPIs Gerais');
    
    // Aba 2: Dados das Turbinas
    const turbineDataFormatted = turbineData.map(turbine => ({
      'Turbina': turbine.name,
      'Falhas': turbine.falhas,
      'Duração Total (h)': turbine.duracaoTotal.toFixed(2),
      'Score de Criticidade': turbine.criticidadeScore.toFixed(2),
      'MTBF (h)': turbine.mtbf.toFixed(2),
      'MTTR (h)': turbine.mttr.toFixed(2),
      'Disponibilidade (%)': turbine.disponibilidade.toFixed(2),
      'Criticidade': turbine.criticidade
    }));
    
    const ws2 = XLSX.utils.json_to_sheet(turbineDataFormatted);
    XLSX.utils.book_append_sheet(wb, ws2, 'Dados das Turbinas');
    
    // Aba 3: Tendências Mensais
    const tendenciasFormatted = tendenciasMensais.map(item => ({
      'Mês': item.mes,
      'Falhas': item.falhas
    }));
    
    const ws3 = XLSX.utils.json_to_sheet(tendenciasFormatted);
    XLSX.utils.book_append_sheet(wb, ws3, 'Tendências Mensais');
    
    // Aba 4: Falhas por Turbina e Classificação
    const falhasDetalhadas = [];
    Object.entries(falhasPorTurbinaClassificacao).forEach(([turbina, classificacoes]) => {
      Object.entries(classificacoes).forEach(([classificacao, quantidade]) => {
        falhasDetalhadas.push({
          'Turbina': turbina,
          'Classificação': classificacao,
          'Quantidade': quantidade
        });
      });
    });
    
    const ws4 = XLSX.utils.json_to_sheet(falhasDetalhadas);
    XLSX.utils.book_append_sheet(wb, ws4, 'Falhas Detalhadas');
    
    // Aba 5: Impacto Ambiental
    const impactoFormatted = Object.entries(impactoAmbiental).map(([turbina, tempo]) => ({
      'Turbina': turbina,
      'Tempo de Parada por Condições Ambientais (h)': tempo.toFixed(2)
    }));
    
    const ws5 = XLSX.utils.json_to_sheet(impactoFormatted);
    XLSX.utils.book_append_sheet(wb, ws5, 'Impacto Ambiental');
    
    // Gerar e salvar o arquivo Excel
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(data, 'dados-parque-eolico-teb.xlsx');
    
    return true;
  } catch (error) {
    console.error('Erro ao gerar Excel:', error);
    return false;
  }
};

export const exportDashboardToPDF = async () => {
  try {
    // Capturar screenshot do dashboard
    const dashboardElement = document.querySelector('[data-export="dashboard"]');
    if (!dashboardElement) {
      throw new Error('Elemento do dashboard não encontrado');
    }
    
    const canvas = await html2canvas(dashboardElement, {
      scale: 2,
      useCORS: true,
      allowTaint: true
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('l', 'mm', 'a4'); // Landscape para melhor visualização
    
    const imgWidth = 297; // A4 landscape width
    const pageHeight = 210; // A4 landscape height
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    
    let position = 0;
    
    // Adicionar título
    pdf.setFontSize(16);
    pdf.text('Dashboard - Parque Eólico TEB', 20, 20);
    
    position = 30;
    
    // Adicionar imagem
    pdf.addImage(imgData, 'PNG', 10, position, imgWidth - 20, Math.min(imgHeight, pageHeight - position - 10));
    heightLeft -= (pageHeight - position - 10);
    
    // Se a imagem for maior que uma página, adicionar páginas extras
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight + 10;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 10, position, imgWidth - 20, imgHeight);
      heightLeft -= pageHeight;
    }
    
    pdf.save('dashboard-parque-eolico-teb.pdf');
    return true;
  } catch (error) {
    console.error('Erro ao exportar dashboard para PDF:', error);
    return false;
  }
};

