import React, { useState, useEffect } from 'react';
import { addDoc, getDocs, collection, updateDoc, query, where, doc, writeBatch } from 'firebase/firestore';
import { db } from '../../services/firebaseConnection';
import { useAuth } from '../../context/AuthContext';
import './Style.css';

interface ActivityData {
 id: string;
 activity: string;
 time: string;
 calories: string;
 userId: string;
 archived?: boolean;
}

export function Activities() {
 const { user } = useAuth();
 const [activities, setActivities] = useState<ActivityData[]>([]);
 const [activity, setActivity] = useState('');
 const [time, setTime] = useState('');
 const [editingId, setEditingId] = useState<string | null>(null);

 const handleSubmit = async (e: React.FormEvent) => {
   e.preventDefault();
   if (editingId) {
     const docRef = doc(db, 'activities', editingId);
     await updateDoc(docRef, { activity, time, calories: calculateCalories(activity, time, user?.gender) });
     setEditingId(null);
   } else {
     await addDoc(collection(db, 'activities'), { activity, time, calories: calculateCalories(activity, time, user?.gender), userId: user?.uid, archived: false });
   }
   setActivity('');
   setTime('');
   fetchActivities();
 };

 const handleEdit = (id: string, currentActivity: string, currentTime: string) => {
   setActivity(currentActivity);
   setTime(currentTime);
   setEditingId(id);
 };

 const handleDelete = async (id: string) => {
   const docRef = doc(db, 'activities', id);
   await updateDoc(docRef, { archived: true });
   fetchActivities();
 };

 const handleFinalize = async () => {
   if (!user) return;
   const q = query(collection(db, 'activities'), where('userId', '==', user.uid), where('archived', '==', false));
   const querySnapshot = await getDocs(q);
   const batch = writeBatch(db);
   querySnapshot.docs.forEach((doc) => {
     batch.update(doc.ref, { archived: true });
   });
   await batch.commit();
   setActivities([]);
   setActivity('');
   setTime('');
   setEditingId(null);
 };

 const fetchActivities = async () => {
   if (!user) return;
   const q = query(collection(db, 'activities'), where('userId', '==', user.uid), where('archived', '==', false));
   const querySnapshot = await getDocs(q);
   const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as ActivityData[];
   setActivities(data);
 };

 useEffect(() => {
   fetchActivities();
   return () => {
     setActivities([]);
     setActivity('');
     setTime('');
     setEditingId(null);
   };
 }, [user]);

 const calculateCalories = (activity: string, time: string, gender?: 'male' | 'female') => {
   const timeInMinutes = parseInt(time, 10);
   const baseCalories = {
     Caminhada: 3.8,
     Corrida: 8.0,
     Ciclismo: 7.5,
     Natação: 7.0,
     Musculação: 6.0,
     Yoga: 3.0,
   };
   const multiplier = gender === 'female' ? 0.9 : 1.0;
   return (baseCalories[activity as keyof typeof baseCalories] * timeInMinutes * multiplier).toFixed(2);
 };

 return (
   <main className="container py-4">
     <h1>Registro de Atividades Físicas</h1>
     <div className="card-container">
       {['Caminhada', 'Corrida', 'Ciclismo', 'Natação', 'Musculação', 'Yoga'].map((option) => (
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
                 onClick={() => handleEdit(item.id, item.activity, item.time)}
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
         <button type="button" className="btn btn-secondary mt-4" onClick={handleFinalize}>
           Finalizar
         </button>
       </section>
     )}
   </main>
 );
}

export default Activities;
