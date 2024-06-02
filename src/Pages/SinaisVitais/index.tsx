import React, { useState, useEffect } from 'react';
import { addDoc, getDocs, collection } from 'firebase/firestore';
import { db } from '../../services/firebaseConnection';
import Layout from '../../components/layout';
import './style.css';

interface VitalSignData {
  type: string;
  value: string;
}

export function VitalSigns() {
  const [vitalSigns, setVitalSigns] = useState<VitalSignData[]>([]);
  const [vitalSign, setVitalSign] = useState<VitalSignData>({ type: '', value: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addDoc(collection(db, 'vitalSigns'), { ...vitalSign });
    setVitalSign({ type: '', value: '' });
    fetchVitalSigns();
  };

  const fetchVitalSigns = async () => {
    const querySnapshot = await getDocs(collection(db, 'vitalSigns'));
    const data = querySnapshot.docs.map(doc => doc.data() as VitalSignData);
    setVitalSigns(data);
  };

  useEffect(() => {
    fetchVitalSigns();
  }, []);

  return (
    <Layout>
      <main className="container py-4">
        <h1>Monitoramento de Sinais Vitais</h1>
        <form onSubmit={handleSubmit} className="mb-4">
          <div className="mb-3">
            <input
              type="text"
              value={vitalSign.type}
              onChange={(e) => setVitalSign({ ...vitalSign, type: e.target.value })}
              placeholder="Tipo de sinal vital"
              className="form-control"
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="text"
              value={vitalSign.value}
              onChange={(e) => setVitalSign({ ...vitalSign, value: e.target.value })}
              placeholder="Valor do sinal vital"
              className="form-control"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">Registrar</button>
        </form>
        <section>
          <h2>Histórico de Sinais Vitais</h2>
          <ul className="list-group">
            {vitalSigns.map((item, index) => (
              <li key={index} className="list-group-item">{item.type}: {item.value}</li>
            ))}
          </ul>
        </section>
      </main>
    </Layout>
  );
}

export default VitalSigns;
