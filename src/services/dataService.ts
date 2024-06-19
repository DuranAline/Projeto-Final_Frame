// src/services/dataService.ts
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from './firebaseConnection';

export const fetchCollectionData = async (collectionName: string, userId: string | undefined, includeArchived = false) => {
  try {
    if (!userId) return [];
    const q = includeArchived
      ? query(collection(db, collectionName), where('userId', '==', userId))
      : query(collection(db, collectionName), where('userId', '==', userId), where('archived', '==', false));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error(`Error fetching data from collection ${collectionName}:`, error);
    return [];
  }
};

export const fetchReportsData = async (userId: string | undefined) => {
  const activities = await fetchCollectionData('activities', userId, true);
  const vitalSigns = await fetchCollectionData('vitalSigns', userId, true);
  const nutrition = await fetchCollectionData('nutrition', userId, true);

  return [
    { type: 'Atividades', data: activities },
    { type: 'Sinais Vitais', data: vitalSigns },
    { type: 'Alimentação', data: nutrition },
  ];
};
