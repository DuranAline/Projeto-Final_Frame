import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../services/firebaseConnection';
import Layout from '../../components/layout';
import { useUser } from '../../context/UserContext';
import './Style.css';

interface ActivityData {
  id: string;
  activity: string;
  time: string;
  calories: string;
}

export function Activities() {
  const { user } = useUser();
  const [activities, setActivities] = useState<ActivityData[]>([]);
  const [activity, setActivity] = useState<keyof typeof baseCalories | ''>('');
  const [time, setTime] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (activity === '') return;
    const calories = calculateCalories(activity, time, user?.gender);
    if (editingId) {
      const docRef = doc(db, 'activities', editingId);
      await updateDoc(docRef, { activity, time, calories });
      setEditingId(null);
    } else {
      await addDoc(collection(db, 'activities'), { activity, time, calories });
    }
    setActivity('');
    setTime('');
    fetchActivities();
  };

  const handleEdit = (id: string, currentActivity: string, currentTime: string, currentCalories: string) => {
    setActivity(currentActivity as keyof typeof baseCalories);
    setTime(currentTime);
    setEditingId(id);
  };

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, 'activities', id));
    fetchActivities();
  };

  const fetchActivities = async () => {
    const querySnapshot = await getDocs(collection(db, 'activities'));
    const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as ActivityData[];
    setActivities(data);
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const activityOptions = ['Caminhada', 'Corrida', 'Ciclismo', 'Natação', 'Musculação', 'Yoga'] as const;

  const baseCalories = {
    Caminhada: 3.8,
    Corrida: 8.0,
    Ciclismo: 7.5,
    Natação: 7.0,
    Musculação: 6.0,
    Yoga: 3.0,
  };

  const calculateCalories = (activity: keyof typeof baseCalories, time: string, gender?: 'male' | 'female') => {
    const timeInMinutes = parseInt(time, 10);
    const multiplier = gender === 'female' ? 0.9 : 1.0; // Simplificação para o cálculo de calorias
    return (baseCalories[activity] * timeInMinutes * multiplier).toFixed(2);
  };

  return (
    <Layout>
      <main className="container py-4">
        <h1>Registro de Atividades Físicas</h1>
        <div className="card-container">
          {activityOptions.map((option) => (
            <div key={option} className="card" onClick={() => setActivity(option)}>
              <img src={`/images/${option.toLowerCase()}.png`} alt={option} className="card-image" />
              <h2>{option}</h2>
            </div>
          ))}
        </div>
        {activity && (
          <form onSubmit={handleSubmit} className="mb-4">
            <h2>{activity}</h2>
            <div className="mb-3">
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="Tempo (em minutos)"
                className="form-control"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">
              {editingId ? 'Atualizar' : 'Registrar'}
            </button>
            <button type="button" className="btn btn-secondary ml-2" onClick={() => setActivity('')}>
              Cancelar
            </button>
          </form>
        )}
        {activities.length > 0 && (
          <section>
            <h2>Histórico de Atividades</h2>
            <ul className="list-group">
              {activities.map((item, index) => (
                <li key={index} className="list-group-item">
                  {item.activity}: {item.time} min, {item.calories} kcal
                  <button
                    className="btn btn-sm btn-warning ml-2"
                    onClick={() => handleEdit(item.id, item.activity, item.time, item.calories)}
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
      </main>
    </Layout>
  );
}

export default Activities;
