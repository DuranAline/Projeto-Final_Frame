// src/services/dataService.ts
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from './firebaseConnection';

export const fetchCollectionData = async (collectionName: string, userId: string | undefined) => {
  try {
    if (!userId) return [];
    const q = query(collection(db, collectionName), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error(`Error fetching data from collection ${collectionName}:`, error);
    return [];
  }
};

export const fetchReportsData = async (userId: string | undefined) => {
  const activities = await fetchCollectionData('activities', userId);
  const vitalSigns = await fetchCollectionData('vitalSigns', userId);
  const nutrition = await fetchCollectionData('nutrition', userId);

  return [
    { type: 'Atividades', data: activities },
    { type: 'Sinais Vitais', data: vitalSigns },
    { type: 'Alimentação', data: nutrition },
  ];
};
