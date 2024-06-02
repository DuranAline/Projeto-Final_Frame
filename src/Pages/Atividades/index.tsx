import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from '../../services/firebaseConnection';
import Layout from '../../components/layout';
import { useUser } from '../../context/UserContext';
import './style.css';

interface ActivityData {
  activity: string;
  time: string;
  calories: string;
}

export function Activities() {
  const { user } = useUser();
  const [activities, setActivities] = useState<ActivityData[]>([]);
  const [activity, setActivity] = useState<keyof typeof baseCalories | ''>('');
  const [time, setTime] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      console.error('User not found');
      return;
    }
    if (activity === '') {
      console.error('Activity not selected');
      return;
    }
    const calories = calculateCalories(activity, time, user.gender);
    await addDoc(collection(db, 'activities'), { activity, time, calories });
    setActivity('');
    setTime('');
    fetchActivities();
  };

  const fetchActivities = async () => {
    const querySnapshot = await getDocs(collection(db, 'activities'));
    const data = querySnapshot.docs.map(doc => doc.data() as ActivityData);
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

  const calculateCalories = (activity: keyof typeof baseCalories, time: string, gender: 'male' | 'female') => {
    const timeInMinutes = parseInt(time, 10);
    const multiplier = gender === 'male' ? 1.0 : 0.9; // Simplificação para o cálculo de calorias
    return (baseCalories[activity] * timeInMinutes * multiplier).toFixed(2);
  };

  return (
    <Layout>
      <main className="container py-4">
        <h1>Registro de Atividades Físicas</h1>
        <form onSubmit={handleSubmit} className="activity-form mb-4">
          <div className="mb-3">
            <select
              value={activity}
              onChange={(e) => setActivity(e.target.value as keyof typeof baseCalories)}
              className="form-control activity-input"
              required
            >
              <option value="" disabled>Selecione uma atividade</option>
              {activityOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <input
              type="text"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              placeholder="Tempo (em minutos)"
              className="form-control activity-input"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary activity-button">Registrar</button>
        </form>
        <section>
          <h2>Histórico de Atividades</h2>
          <ul className="list-group activity-list">
            {activities.map((item, index) => (
              <li key={index} className="list-group-item activity-item">
                {item.activity}: {item.time} min, {item.calories} kcal
              </li>
            ))}
          </ul>
        </section>
      </main>
    </Layout>
  );
}

export default Activities;
