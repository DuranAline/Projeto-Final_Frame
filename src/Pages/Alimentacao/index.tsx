import React, { useState, useEffect } from 'react';
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
        {nutrition.length > 0 && (
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
        )}
        <section className="news-section">
          <h2>Notícias sobre Alimentação Saudável</h2>
          <div className="news-container">
            <div className="news-item">
              <img src="/images/fruta.png" alt="Benefícios de Comer Frutas" className="news-image" />
              <div className="news-content">
                <h3>Benefícios de Comer Frutas</h3>
                <p>As frutas são ricas em vitaminas, minerais e antioxidantes. Elas ajudam a melhorar a saúde do coração, reduzir o risco de doenças crônicas e promover a digestão saudável. Além disso, as frutas são uma excelente fonte de fibras e podem ajudar a manter um peso saudável.</p>
              </div>
            </div>
            <div className="news-item">
              <img src="/images/leg.png" alt="Importância das Leguminosas na Dieta" className="news-image" />
              <div className="news-content">
                <h3>Importância das Leguminosas na Dieta</h3>
                <p>As leguminosas, como feijões, lentilhas e grão-de-bico, são uma ótima fonte de proteínas, fibras e vitaminas. Elas ajudam a manter a saúde do coração, controlar os níveis de açúcar no sangue e promover a sensação de saciedade. Incluí-las na dieta pode trazer muitos benefícios à saúde.</p>
              </div>
            </div>
            <div className="news-item">
              <img src="/images/cha.png" alt="Os Benefícios do Chá Verde" className="news-image" />
              <div className="news-content">
                <h3>Os Benefícios do Chá Verde</h3>
                <p>O chá verde é conhecido por suas propriedades antioxidantes e anti-inflamatórias. Ele pode ajudar a melhorar a função cerebral, aumentar a queima de gordura e reduzir o risco de vários tipos de câncer. Beber chá verde regularmente pode contribuir para uma saúde melhor.</p>
              </div>
            </div>
            <div className="news-item">
              <img src="/images/quinoa.png" alt="Por que Comer Quinoa" className="news-image" />
              <div className="news-content">
                <h3>Por que Comer Quinoa</h3>
                <p>A quinoa é um superalimento rico em proteínas, fibras e nutrientes essenciais. Ela é uma excelente opção para substituir grãos refinados, ajudando a melhorar a digestão, controlar o peso e fornecer energia sustentável. Incluir quinoa na dieta pode trazer muitos benefícios à saúde.</p>
              </div>
            </div>
            <div className="news-item">
              <img src="/images/verde.png" alt="Benefícios dos Vegetais Verdes" className="news-image" />
              <div className="news-content">
                <h3>Benefícios dos Vegetais Verdes</h3>
                <p>Os vegetais verdes, como espinafre, couve e brócolis, são ricos em vitaminas, minerais e antioxidantes. Eles ajudam a fortalecer o sistema imunológico, melhorar a saúde dos ossos e reduzir o risco de doenças crônicas. Consumir vegetais verdes regularmente é essencial para uma dieta equilibrada e saudável.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}

export default Nutrition;
