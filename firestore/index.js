import database from '@react-native-firebase/database';
import firestore from '@react-native-firebase/firestore';

let _firestore;
export const initializeFirestore = async () => {
  await database().setPersistenceEnabled(true);
  _firestore = firestore();
};
export default function firestoreInstance() {
  return _firestore;
}