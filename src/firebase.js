import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";


const firebaseConfig = {

  // colle ici les infos Firebase

};


const app = initializeApp(firebaseConfig);


export const messaging = getMessaging(app);