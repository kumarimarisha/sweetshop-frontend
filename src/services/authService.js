import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

// Register user
export const registerUser = async (email, password, name) => {
  try {
    // Create user in Firebase Auth
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const user = result.user;
    
    // Get and store ID token for API calls
    const token = await user.getIdToken();
    localStorage.setItem('firebaseToken', token);

    // Store user data in Firestore
    try {
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: email,
        name: name,
        role: 'user', // 'user' or 'admin'
        createdAt: new Date(),
      });
      console.log('User profile created in Firestore');
    } catch (firestoreError) {
      console.error('Error creating user profile in Firestore:', firestoreError);
      // User is created in Auth but not in Firestore
      // This is not fatal, we can still use the app
    }

    return user;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

// Login user
export const loginUser = async (email, password) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    // Get and store ID token for API calls
    const token = await result.user.getIdToken();
    localStorage.setItem('firebaseToken', token);
    return result.user;
  } catch (error) {
    throw error;
  }
};

// Logout user
export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw error;
  }
};

// Get user role from Firestore
export const getUserRole = async (uid) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      return userDoc.data().role;
    }
    return 'user';
  } catch (error) {
    console.error('Error fetching user role:', error);
    return 'user';
  }
};

// Listen to auth state changes
export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};
