import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";


const firebaseConfig = {

  apiKey: "AIzaSyBHVN5f_BWnXmtzkE0Ypf2WKniedjkS0lg",

  authDomain: "pronos-notifs.firebaseapp.com",

  projectId: "pronos-notifs",

  storageBucket: "pronos-notifs.firebasestorage.app",

  messagingSenderId: "104081341140",

  appId: "1:104081341140:web:4c0b14e0d3ffcd7072d941",

  measurementId: "G-QBW92H84KX"

};



const app = initializeApp(firebaseConfig);



export const messaging = getMessaging(app);