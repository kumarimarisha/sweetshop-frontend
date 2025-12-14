import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

// Save cart to user's Firestore document under `cart` field
export const saveCartForUser = async (uid, cart) => {
  if (!uid) return;
  try {
    const userRef = doc(db, 'users', uid);
    await setDoc(userRef, { cart: { items: cart.items || [], totalPrice: cart.totalPrice || 0 } }, { merge: true });
    return true;
  } catch (error) {
    console.error('Error saving cart to Firestore:', error);
    throw error;
  }
};

// Load cart for user (returns { items: [], totalPrice: 0 })
export const loadCartForUser = async (uid) => {
  if (!uid) return { items: [], totalPrice: 0 };
  try {
    const userRef = doc(db, 'users', uid);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      const data = snap.data();
      return data.cart || { items: [], totalPrice: 0 };
    }
    return { items: [], totalPrice: 0 };
  } catch (error) {
    console.error('Error loading cart from Firestore:', error);
    return { items: [], totalPrice: 0 };
  }
};
