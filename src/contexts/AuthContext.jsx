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
export const DEMO_PASSWORD = "demo123"

// Local storage key for bypass mode
const BYPASS_AUTH_KEY = "bypass_auth_enabled"

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [bypassMode, setBypassMode] = useState(false)

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
      let userCredential;
      
      try {
        // First try to sign in with demo credentials
        userCredential = await signInWithEmailAndPassword(auth, DEMO_EMAIL, DEMO_PASSWORD);
        console.log("Demo account exists, logging in");
        return userCredential;
      } catch (signInError) {
        console.log("Demo account doesn't exist, creating one", signInError);
        
        // If sign-in fails, create the demo account
        userCredential = await createUserWithEmailAndPassword(auth, DEMO_EMAIL, DEMO_PASSWORD);
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
        
        return userCredential;
      }
    } catch (error) {
      console.error("Error with demo login:", error);
      throw error;
    }
  }

  function logout() {
    if (bypassMode) {
      // If in bypass mode, just disable bypass mode
      disableBypassMode();
      return Promise.resolve();
    }
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

  // Function to enable bypass mode
  function enableBypassMode() {
    console.log("Enabling bypass mode");
    
    // Create a bypass user profile
    const bypassUserProfile = {
      uid: 'bypass-user',
      email: 'bypass@example.com',
      displayName: 'Workshop Guest',
      points: 100,
      tasksCompleted: 5,
      createdAt: new Date().toISOString(),
      progress: {
        day1: { completed: 2, total: 5 },
        day2: { completed: 1, total: 5 },
        day3: { completed: 0, total: 5 }
      },
      isBypass: true
    };
    
    // Set bypass mode in local storage
    localStorage.setItem(BYPASS_AUTH_KEY, 'true');
    
    // Update state
    setBypassMode(true);
    setCurrentUser({
      uid: 'bypass-user',
      email: 'bypass@example.com',
      displayName: 'Workshop Guest',
      isBypass: true
    });
    setUserProfile(bypassUserProfile);
    
    return Promise.resolve();
  }
  
  // Function to disable bypass mode
  function disableBypassMode() {
    console.log("Disabling bypass mode");
    localStorage.removeItem(BYPASS_AUTH_KEY);
    setBypassMode(false);
    setCurrentUser(null);
    setUserProfile(null);
  }
  
  // Check if bypass mode is enabled
  function isInBypassMode() {
    return bypassMode;
  }

  useEffect(() => {
    // Check if bypass mode is enabled in local storage
    const bypassEnabled = localStorage.getItem(BYPASS_AUTH_KEY) === 'true';
    
    if (bypassEnabled) {
      console.log("Found bypass mode in localStorage, activating");
      // If bypass mode is enabled, set up the bypass user
      enableBypassMode();
      setLoading(false);
      return () => {}; // No cleanup needed
    }
    
    // Normal Firebase auth listener
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
    DEMO_PASSWORD,
    enableBypassMode,
    disableBypassMode,
    isInBypassMode,
    bypassMode
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
