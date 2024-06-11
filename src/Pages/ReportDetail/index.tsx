import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../services/firebaseConnection';
import Layout from '../../components/layout';

interface ReportDetailProps {
  title: string;
  description: string;
  tips: string[];
  references: string[];
}

export function ReportDetail() {
  const { id } = useParams<{ id: string }>();
  const [report, setReport] = useState<ReportDetailProps | null>(null);

  useEffect(() => {
    const fetchReportDetail = async () => {
      if (id) {
        const docRef = doc(db, 'reports', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setReport(docSnap.data() as ReportDetailProps);
        } else {
          console.log("No such document!");
        }
      }
    };
    fetchReportDetail();
  }, [id]);

  if (!report) {
    return <Layout><div>Loading...</div></Layout>;
  }

  return (
    <Layout>
      <main className="container py-4">
        <h1>{report.title}</h1>
        <p>{report.description}</p>
        <section>
          <h2>Dicas</h2>
          <ul>
            {report.tips.map((tip, index) => (
              <li key={index}>{tip}</li>
            ))}
          </ul>
        </section>
        <section>
          <h2>Referências</h2>
          <ul>
            {report.references.map((reference, index) => (
              <li key={index}>{reference}</li>
            ))}
          </ul>
        </section>
      </main>
    </Layout>
  );
}

export default ReportDetail;
