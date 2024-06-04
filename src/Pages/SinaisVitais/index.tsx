import React, { useState, useEffect } from 'react';
import { addDoc, getDocs, collection, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../services/firebaseConnection';
import Layout from '../../components/layout';
import './style.css'; // Certifique-se de criar o arquivo CSS

interface VitalSignData {
  id: string;
  type: 'Frequencia cardiaca' | 'Pressao Arterial' | 'Frequencia Respiratoria' | 'Qualidade do sono';
  value: string;
}

export function VitalSigns() {
  const [vitalSigns, setVitalSigns] = useState<VitalSignData[]>([]);
  const [vitalSignType, setVitalSignType] = useState<'Frequencia cardiaca' | 'Pressao Arterial' | 'Frequencia Respiratoria' | 'Qualidade do sono'>('Frequencia cardiaca');
  const [value, setValue] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      const docRef = doc(db, 'vitalSigns', editingId);
      await updateDoc(docRef, { type: vitalSignType, value });
      setEditingId(null);
    } else {
      await addDoc(collection(db, 'vitalSigns'), { type: vitalSignType, value });
    }
    setValue('');
    fetchVitalSigns();
  };

  const handleEdit = (id: string, currentType: VitalSignData['type'], currentValue: string) => {
    setVitalSignType(currentType);
    setValue(currentValue);
    setEditingId(id);
  };

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, 'vitalSigns', id));
    fetchVitalSigns();
  };

  const handleFinalize = () => {
    setVitalSigns([]);
    setVitalSignType('Frequencia cardiaca');
    setValue('');
    setEditingId(null);
  };

  const fetchVitalSigns = async () => {
    const querySnapshot = await getDocs(collection(db, 'vitalSigns'));
    const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as VitalSignData[];
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
            <select
              value={vitalSignType}
              onChange={(e) => setVitalSignType(e.target.value as any)}
              className="form-control"
              required
            >
              <option value="Frequencia cardiaca">Frequência Cardíaca</option>
              <option value="Pressao Arterial">Pressão Arterial</option>
              <option value="Frequencia Respiratoria">Frequência Respiratória</option>
              <option value="Qualidade do sono">Qualidade do Sono</option>
            </select>
          </div>
          <div className="mb-3">
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Digite o valor"
              className="form-control"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">
            {editingId ? 'Atualizar' : 'Adicionar'}
          </button>
          <button type="button" className="btn btn-secondary ml-2" onClick={handleFinalize}>
            Finalizar
          </button>
        </form>
        <section>
          <h2>Histórico de Sinais Vitais</h2>
          <ul className="list-group">
            {vitalSigns.map((item, index) => (
              <li key={index} className="list-group-item">
                {item.type}: {item.value}
                <button
                  className="btn btn-sm btn-warning ml-2"
                  onClick={() => handleEdit(item.id, item.type, item.value)}
                >
                  Editar
                </button>
                <button
                  className="btn btn-sm btn-danger ml-2"
                  onClick={() => handleDelete(item.id)}
                >
                  Excluir
                </button>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </Layout>
  );
}

export default VitalSigns;
