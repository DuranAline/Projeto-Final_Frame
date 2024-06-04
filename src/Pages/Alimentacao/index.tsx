import { useState, useEffect } from 'react';
import { addDoc, getDocs, collection, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../services/firebaseConnection';
import Layout from '../../components/layout';
import './style.css'; 
interface NutritionData {
  id: string;
  meal: string;
  food: string;
}

export function Nutrition() {
  const [nutrition, setNutrition] = useState<NutritionData[]>([]);
  const [food, setFood] = useState('');
  const [meal, setMeal] = useState<'cafe_da_manha' | 'almoco' | 'cafe_da_tarde' | 'janta' | 'ceia' | 'lanche'>('cafe_da_manha');
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      const docRef = doc(db, 'nutrition', editingId);
      await updateDoc(docRef, { food, meal });
      setEditingId(null);
    } else {
      await addDoc(collection(db, 'nutrition'), { food, meal });
    }
    setFood('');
    fetchNutrition();
  };

  const handleEdit = (id: string, currentFood: string, currentMeal: string) => {
    setFood(currentFood);
    setMeal(currentMeal as 'cafe_da_manha' | 'almoco' | 'cafe_da_tarde' | 'janta' | 'ceia' | 'lanche');
    setEditingId(id);
  };

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, 'nutrition', id));
    fetchNutrition();
  };

  const handleFinalize = () => {
    setNutrition([]);
    setFood('');
    setMeal('cafe_da_manha');
    setEditingId(null);
  };

  const fetchNutrition = async () => {
    const querySnapshot = await getDocs(collection(db, 'nutrition'));
    const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as NutritionData[];
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
            <select
              value={meal}
              onChange={(e) => setMeal(e.target.value as any)}
              className="form-control"
              required
            >
              <option value="cafe_da_manha">Café da Manhã</option>
              <option value="almoco">Almoço</option>
              <option value="cafe_da_tarde">Café da Tarde</option>
              <option value="janta">Janta</option>
              <option value="ceia">Ceia</option>
              <option value="lanche">Lanche</option>
            </select>
          </div>
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
          <button type="submit" className="btn btn-primary">
            {editingId ? 'Atualizar' : 'Adicionar'}
          </button>
          <button type="button" className="btn btn-secondary ml-2" onClick={handleFinalize}>
            Finalizar
          </button>
        </form>
        <section>
          <h2>Histórico de Alimentação</h2>
          <ul className="list-group">
            {nutrition.map((item, index) => (
              <li key={index} className="list-group-item">
                {item.meal}: {item.food}
                <button
                  className="btn btn-sm btn-warning ml-2"
                  onClick={() => handleEdit(item.id, item.food, item.meal)}
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

export default Nutrition;
