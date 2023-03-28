import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBs3X6eX7DGd9vPhBVHzg0u-MGxlYsfHtg",
  authDomain: "project-3951610879920423539.firebaseapp.com",
  projectId: "project-3951610879920423539",
  storageBucket: "project-3951610879920423539.appspot.com",
  messagingSenderId: "1051906351964",
  appId: "1:1051906351964:web:5688282f4efa5e59e31799"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const storage = getStorage(app);

export default storage;

