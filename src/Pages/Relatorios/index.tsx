import { useState } from 'react';
import Layout from '../../components/layout';
import { fetchReportsData } from '../../services/dataService';
import './Style.css';

interface ReportData {
  id: string;
  type: string;
  details: any;
}

const reportOptions = [
  { label: 'Selecione um relatório', value: '' },
  { label: 'Atividades', value: 'Atividades' },
  { label: 'Corrida', value: 'Corrida' },
  { label: 'Caminhada', value: 'Caminhada' },
  { label: 'Ciclismo', value: 'Ciclismo' },
  { label: 'Natação', value: 'Natação' },
  { label: 'Musculação', value: 'Musculação' },
  { label: 'Yoga', value: 'Yoga' },
  { label: 'Sinais Vitais', value: 'Sinais Vitais' },
  { label: 'Alimentação', value: 'Alimentação' },
  { label: 'Café da Manhã', value: 'cafe_da_manha' },
  { label: 'Almoço', value: 'almoco' },
  { label: 'Café da Tarde', value: 'cafe_da_tarde' },
  { label: 'Janta', value: 'janta' },
  { label: 'Ceia', value: 'ceia' },
  { label: 'Lanche', value: 'lanche' },
];

export function Reports() {
  const [reports, setReports] = useState<ReportData[]>([]);
  const [selectedReport, setSelectedReport] = useState<string>(reportOptions[0].value);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSelectReport = async (report: string) => {
    setSelectedReport(report);
    if (report) {
      setLoading(true);
      try {
        const reportsData = await fetchReportsData();
        const formattedReports = reportsData.flatMap(reportData => 
          reportData.data.map(item => ({ id: item.id, type: reportData.type, details: item }))
        );
        setReports(formattedReports);
        console.log('Fetched reports:', formattedReports);
      } catch (error) {
        console.error('Error fetching reports:', error);
      } finally {
        setLoading(false);
      }
    } else {
      setReports([]);
    }
  };

  const filteredReports = reports.filter(report => {
    if (selectedReport && report.type === 'Atividades' && report.details.activity === selectedReport) return true;
    if (selectedReport && report.type === 'Alimentação' && report.details.meal === selectedReport) return true;
    return report.type === selectedReport;
  });

  const renderReportDetails = (report: ReportData) => {
    switch (report.type) {
      case 'Atividades':
        return (
          <div>
            <p><strong>Atividade:</strong> {report.details.activity}</p>
            <p><strong>Tempo:</strong> {report.details.time} minutos</p>
            <p><strong>Calorias:</strong> {report.details.calories} kcal</p>
          </div>
        );
      case 'Sinais Vitais':
        return (
          <div>
            <p><strong>Tipo:</strong> {report.details.type}</p>
            <p><strong>Valor:</strong> {report.details.value}</p>
          </div>
        );
      case 'Alimentação':
        return (
          <div>
            <p><strong>Refeição:</strong> {report.details.meal}</p>
            <p><strong>Alimento:</strong> {report.details.food}</p>
          </div>
        );
      default:
        return <div>Detalhes não disponíveis</div>;
    }
  };

  return (
    <Layout>
      <main className="container py-4">
        <h1>Seleção de Relatórios</h1>
        <form className="mb-4">
          <div className="mb-3">
            <select
              value={selectedReport}
              onChange={(e) => handleSelectReport(e.target.value)}
              className="form-control"
              required
            >
              {reportOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </form>
        <section>
          <h2>Relatórios de {selectedReport}</h2>
          {loading ? (
            <p>Carregando...</p>
          ) : (
            <ul className="list-group">
              {filteredReports.length > 0 ? (
                filteredReports.map((report, index) => (
                  <li key={index} className="list-group-item">
                    {renderReportDetails(report)}
                  </li>
                ))
              ) : (
                selectedReport && <li className="list-group-item">Nenhum relatório encontrado.</li>
              )}
            </ul>
          )}
        </section>
      </main>
    </Layout>
  );
}

export default Reports;
