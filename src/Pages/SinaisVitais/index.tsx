import React, { useState, useEffect } from 'react';
import { addDoc, getDocs, collection, updateDoc, query, where, doc, writeBatch } from 'firebase/firestore';
import { db } from '../../services/firebaseConnection';
import { useAuth } from '../../context/AuthContext';
import './style.css';

interface VitalSignData {
 id: string;
 type: 'Frequencia cardiaca' | 'Pressao Arterial' | 'Frequencia Respiratoria' | 'Qualidade do sono';
 value: string;
 userId: string;
 archived?: boolean;
}

export function VitalSigns() {
 const { user } = useAuth();
 const [vitalSigns, setVitalSigns] = useState<VitalSignData[]>([]);
 const [vitalSignType, setVitalSignType] = useState<VitalSignData['type'] | ''>('');
 const [value, setValue] = useState('');
 const [editingId, setEditingId] = useState<string | null>(null);

 const handleSubmit = async (e: React.FormEvent) => {
   e.preventDefault();
   if (!vitalSignType) return;
   if (editingId) {
     const docRef = doc(db, 'vitalSigns', editingId);
     await updateDoc(docRef, { type: vitalSignType, value });
     setEditingId(null);
   } else {
     await addDoc(collection(db, 'vitalSigns'), { type: vitalSignType, value, userId: user?.uid, archived: false });
   }
   setVitalSignType('');
   setValue('');
   fetchVitalSigns();
 };

 const handleEdit = (id: string, currentType: VitalSignData['type'], currentValue: string) => {
   setVitalSignType(currentType);
   setValue(currentValue);
   setEditingId(id);
 };

 const handleDelete = async (id: string) => {
   const docRef = doc(db, 'vitalSigns', id);
   await updateDoc(docRef, { archived: true });
   fetchVitalSigns();
 };

 const handleFinalize = async () => {
   if (!user) return;
   const q = query(collection(db, 'vitalSigns'), where('userId', '==', user.uid), where('archived', '==', false));
   const querySnapshot = await getDocs(q);
   const batch = writeBatch(db);
   querySnapshot.docs.forEach((doc) => {
     batch.update(doc.ref, { archived: true });
   });
   await batch.commit();
   setVitalSigns([]);
   setVitalSignType('');
   setValue('');
   setEditingId(null);
 };

 const fetchVitalSigns = async () => {
   if (!user) return;
   const q = query(collection(db, 'vitalSigns'), where('userId', '==', user.uid), where('archived', '==', false));
   const querySnapshot = await getDocs(q);
   const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as VitalSignData[];
   setVitalSigns(data);
 };

 useEffect(() => {
   fetchVitalSigns();
   return () => {
     setVitalSignType('');
     setValue('');
     setVitalSigns([]);
     setEditingId(null);
   };
 }, [user]);

 const vitalSignOptions: VitalSignData['type'][] = ['Frequencia cardiaca', 'Pressao Arterial', 'Frequencia Respiratoria', 'Qualidade do sono'];

 const getImageName = (type: VitalSignData['type']) => {
   switch (type) {
     case 'Frequencia cardiaca':
       return 'cardiaca.png';
     case 'Pressao Arterial':
       return 'pressao.png';
     case 'Frequencia Respiratoria':
       return 'respiracao.png';
     case 'Qualidade do sono':
       return 'sono.png';
     default:
       return '';
   }
 };

 return (
   <main className="container py-4">
     <h1>Monitoramento de Sinais Vitais</h1>
     <div className="card-container">
       {vitalSignOptions.map((option) => (
         <div key={option} className="vital-sign-card" onClick={() => setVitalSignType(option)}>
           <img src={`/images/${getImageName(option)}`} alt={option} className="vital-sign-image" />
           <h2>{option}</h2>
         </div>
       ))}
     </div>
     {vitalSignType && (
       <form onSubmit={handleSubmit} className="mb-4">
         <h2>{vitalSignType}</h2>
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
         <button type="button" className="btn btn-secondary ml-2" onClick={() => setVitalSignType('')}>
           Cancelar
         </button>
       </form>
     )}
     {vitalSigns.length > 0 && (
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
         <button type="button" className="btn btn-secondary mt-4" onClick={handleFinalize}>
           Finalizar
         </button>
       </section>
     )}
   </main>
 );
}

export default VitalSigns;
