import { useEffect, useState } from 'react';
import { getDocs, collection } from 'firebase/firestore';
import { db } from '../../services/firebaseConnection';
import Layout from '../../components/layout';


interface ReportData {
  title: string;
  description: string;
}

export function Reports() {
  const [reports, setReports] = useState<ReportData[]>([]);

  const fetchReports = async () => {
    const querySnapshot = await getDocs(collection(db, 'reports'));
    const data = querySnapshot.docs.map(doc => doc.data() as ReportData);
    setReports(data);
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return (
    <Layout>
      <main className="container py-4">
        <h1>Relatórios e Recomendações</h1>
        <ul className="list-group">
          {reports.map((item, index) => (
            <li key={index} className="list-group-item">{item.title}: {item.description}</li>
          ))}
        </ul>
      </main>
    </Layout>
  );
}

export default Reports;
