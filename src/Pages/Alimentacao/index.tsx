import React, { useState, useEffect } from 'react';
import { addDoc, getDocs, collection } from 'firebase/firestore';
import { db } from '../../services/firebaseConnection';
import Layout from '../../components/layout';


interface NutritionData {
  food: string;
}

export function Nutrition() {
  const [nutrition, setNutrition] = useState<NutritionData[]>([]);
  const [food, setFood] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addDoc(collection(db, 'nutrition'), { food });
    setFood('');
    fetchNutrition();
  };

  const fetchNutrition = async () => {
    const querySnapshot = await getDocs(collection(db, 'nutrition'));
    const data = querySnapshot.docs.map(doc => doc.data() as NutritionData);
    setNutrition(data);
  };

  useEffect(() => {
    fetchNutrition();
  }, []);

  return (
    <Layout>
      <main className="container py-4">
        <h1>Registro de Alimentação e Nutrição</h1>
        <form onSubmit={handleSubmit} className="mb-4">
          <div className="mb-3">
            <input
              type="text"
              value={food}
              onChange={(e) => setFood(e.target.value)}
              placeholder="Digite o alimento"
              className="form-control"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">Registrar</button>
        </form>
        <section>
          <h2>Histórico de Alimentação</h2>
          <ul className="list-group">
            {nutrition.map((item, index) => (
              <li key={index} className="list-group-item">{item.food}</li>
            ))}
          </ul>
        </section>
      </main>
    </Layout>
  );
}

export default Nutrition;
