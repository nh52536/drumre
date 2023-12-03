import { initializeApp } from "firebase/app";

import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyCnTLYY5ivcK5_RiUR8nDABdqKOf3nxJGo",
    authDomain: "drumre-a367f.firebaseapp.com",
    projectId: "drumre-a367f",
    storageBucket: "drumre-a367f.appspot.com",
    messagingSenderId: "371260683737",
    appId: "1:371260683737:web:17caab6f5bb6a5464055c8",
    measurementId: "G-SG762CNXKZ"
};


const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
