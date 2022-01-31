import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { initializeApp } from "firebase/app";
import { getFirestore, enableIndexedDbPersistence, CACHE_SIZE_UNLIMITED } from "firebase/firestore"
import { disableNetwork } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAZQRdlE7NZ7Tws_sPkMyll8-dzVoj9kyE",
  authDomain: "coherent-ascent-311605.firebaseapp.com",
  projectId: "coherent-ascent-311605",
  storageBucket: "coherent-ascent-311605.appspot.com",
  messagingSenderId: "148310881329",
  appId: "1:148310881329:web:6b2cccf07a7ca0d7839110",
  measurementId: "G-L8XMFDZTJX"
};

window.firebase = initializeApp(firebaseConfig);
window.db = getFirestore(window.firebase
  , { cacheSizeBytes: CACHE_SIZE_UNLIMITED }
);

enableIndexedDbPersistence(window.db)
  .catch((err) => {
    if (err.code === 'failed-precondition') {
      throw new Error('failed-precondition')
    } else if (err.code === 'unimplemented') {
      throw new Error('unimplemented')
    }
  });


ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
