// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getApps, getApp, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCUjIhYI42din9-eNfrEnZe91ESSJCo-kg",
    authDomain: "tier3-ecommerce-app.firebaseapp.com",
    projectId: "tier3-ecommerce-app",
    storageBucket: "tier3-ecommerce-app.appspot.com",
    messagingSenderId: "928284196206",
    appId: "1:928284196206:web:bf2606b256dc6e5d16157f",
    measurementId: "G-R553PE3NLD"
};

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
// const db = getFirestore(app);

// export { db }

export const initializeFirebase = async () => {
  const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  return getFirestore(app);
};