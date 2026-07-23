importScripts(
"https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js"
);

importScripts(
"https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js"
);


firebase.initializeApp({

apiKey: "AIzaSyBHVN5f_BWnXmtzkE0Ypf2WKniedjkS0lg",

authDomain: "pronos-notifs.firebaseapp.com",

projectId: "pronos-notifs",

storageBucket: "pronos-notifs.firebasestorage.app",

messagingSenderId: "104081341140",

appId: "1:104081341140:web:4c0b14e0d3ffcd7072d941"

});


const messaging = firebase.messaging();