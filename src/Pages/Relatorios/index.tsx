// src/pages/Relatorios/index.tsx
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
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
  const { user } = useAuth();
  const [reports, setReports] = useState<ReportData[]>([]);
  const [selectedReport, setSelectedReport] = useState<string>(reportOptions[0].value);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSelectReport = async (report: string) => {
    setSelectedReport(report);
    if (report) {
      setLoading(true);
      try {
        const reportsData = await fetchReportsData(user?.uid);
        const formattedReports = reportsData.flatMap(reportData =>
          reportData.data.map(item => ({ id: item.id, type: reportData.type, details: item }))
        );
        setReports(formattedReports);
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
    <main className="reports-container py-4">
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
      {selectedReport && (
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
                <li className="list-group-item">Nenhum relatório encontrado.</li>
              )}
            </ul>
          )}
        </section>
      )}
      <section className="news-section">
        <h2>Notícias Relacionadas a Relatórios</h2>
        <div className="news-container">
          <div className="news-item">
            <img src="/images/img1.jpg" alt="A Importância de Ter Relatórios de Saúde" />
            <div className="news-content">
              <h3>A Importância de Ter Relatórios de Saúde</h3>
              <p>Ter relatórios detalhados de saúde é essencial para monitorar seu progresso e identificar áreas de melhoria. Eles ajudam a rastrear suas atividades físicas, nutrição e sinais vitais ao longo do tempo, fornecendo uma visão clara sobre seu estado de saúde geral. Com relatórios precisos, você pode ajustar suas rotinas de exercício e dieta para alcançar seus objetivos de saúde de maneira mais eficaz.</p>
            </div>
          </div>
          <div className="news-item">
            <img src="/images/img3.jpg" alt="Como Relatórios de Saúde Podem Ajudar Você" />
            <div className="news-content">
              <h3>Como Relatórios de Saúde Podem Ajudar Você</h3>
              <p>Relatórios de saúde bem organizados podem ajudar você a detectar padrões e tendências em seu bem-estar físico. Eles permitem que você veja o impacto de suas atividades e escolhas alimentares em sua saúde. Além disso, compartilhar esses relatórios com profissionais de saúde pode proporcionar insights valiosos para diagnósticos e recomendações personalizadas, melhorando assim a qualidade do seu tratamento e prevenção.</p>
            </div>
          </div>
          <div className="news-item">
            <img src="/images/img2.jpg" alt="Entendendo Seus Relatórios de Saúde" />
            <div className="news-content">
              <h3>Entendendo Seus Relatórios de Saúde</h3>
              <p>Compreender os dados em seus relatórios de saúde é crucial para fazer ajustes informados em seu estilo de vida. Aprenda a interpretar gráficos de progresso, índices de massa corporal (IMC), calorias queimadas e outros indicadores importantes. Conhecer o significado desses números permite que você tome decisões mais inteligentes sobre sua saúde e bem-estar.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Reports;
