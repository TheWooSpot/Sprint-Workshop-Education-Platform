import React, { createContext, useContext, useState, useEffect } from 'react'
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '../firebase'

const AuthContext = createContext()

// Demo account credentials
export const DEMO_EMAIL = "demo@example.com"
export const DEMO_PASSWORD = "demo123456" // Increased password length to meet Firebase requirements

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  async function signup(email, password, displayName) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user
      
      // Update profile with display name
      await updateProfile(user, { displayName })
      
      // Create user document in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        displayName,
        points: 0,
        tasksCompleted: 0,
        createdAt: serverTimestamp(),
        progress: {
          day1: { completed: 0, total: 5 },
          day2: { completed: 0, total: 5 },
          day3: { completed: 0, total: 5 }
        }
      })
      
      return user
    } catch (error) {
      throw error
    }
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password)
  }

  async function loginWithDemo() {
    try {
      console.log("Starting demo login process");
      
      try {
        // First try to sign in with demo credentials
        console.log("Attempting to sign in with demo account");
        const userCredential = await signInWithEmailAndPassword(auth, DEMO_EMAIL, DEMO_PASSWORD);
        console.log("Demo account exists, logged in successfully");
        return userCredential;
      } catch (signInError) {
        console.log("Demo account sign-in failed:", signInError.code);
        
        if (signInError.code === 'auth/user-not-found') {
          console.log("Creating new demo account");
          // Create the demo account
          const userCredential = await createUserWithEmailAndPassword(auth, DEMO_EMAIL, DEMO_PASSWORD);
          const user = userCredential.user;
          
          // Update profile with display name
          await updateProfile(user, { displayName: "Demo User" });
          
          // Create user document in Firestore with demo data
          await setDoc(doc(db, 'users', user.uid), {
            uid: user.uid,
            email: DEMO_EMAIL,
            displayName: "Demo User",
            points: 150,
            tasksCompleted: 8,
            createdAt: serverTimestamp(),
            progress: {
              day1: { completed: 5, total: 5 },
              day2: { completed: 3, total: 5 },
              day3: { completed: 0, total: 5 }
            },
            isDemo: true
          });
          
          console.log("Demo account created successfully");
          return userCredential;
        } else {
          // If error is not user-not-found, rethrow it
          console.error("Demo login failed with error:", signInError);
          throw signInError;
        }
      }
    } catch (error) {
      console.error("Error in loginWithDemo function:", error);
      throw error;
    }
  }

  function logout() {
    return signOut(auth)
  }

  async function fetchUserProfile(uid) {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid))
      if (userDoc.exists()) {
        setUserProfile(userDoc.data())
        return userDoc.data()
      }
      return null
    } catch (error) {
      console.error("Error fetching user profile:", error)
      return null
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user)
      if (user) {
        await fetchUserProfile(user.uid)
      } else {
        setUserProfile(null)
      }
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const value = {
    currentUser,
    userProfile,
    signup,
    login,
    loginWithDemo,
    logout,
    fetchUserProfile,
    loading,
    DEMO_EMAIL,
    DEMO_PASSWORD
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
