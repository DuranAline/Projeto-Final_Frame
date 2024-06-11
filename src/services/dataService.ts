
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebaseConnection';

export const fetchCollectionData = async (collectionName: string) => {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error(`Error fetching data from collection ${collectionName}:`, error);
    return [];
  }
};

export const fetchReportsData = async () => {
  const activities = await fetchCollectionData('activities');
  const vitalSigns = await fetchCollectionData('vitalSigns');
  const nutrition = await fetchCollectionData('nutrition');

  return [
    { type: 'Atividades', data: activities },
    { type: 'Sinais Vitais', data: vitalSigns },
    { type: 'Alimentação', data: nutrition },
  ];
};
