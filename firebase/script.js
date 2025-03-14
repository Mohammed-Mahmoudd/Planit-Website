// استيراد الوظائف المطلوبة من Firebase
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth"; // ✅ إضافة المصادقة

// تهيئة Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBZIWCKdAmFJXHaqn3JYRGW5UQPDb2hjRQ",
  authDomain: "planit-database-14179.firebaseapp.com",
  projectId: "planit-database-14179",
  storageBucket: "planit-database-14179.firebasestorage.app",
  messagingSenderId: "418277603414",
  appId: "1:418277603414:web:6611f9806d88cc2391e3f7",
  measurementId: "G-8E2M122K5X",
};

// تهيئة التطبيق والتحليلات
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
console.log("Firebase Initialized:", app); // ✅ تحقق من التهيئة

// تشغيل الكود بعد تحميل DOM بالكامل
window.onload = function () {
  const button = document.getElementById("Button");
  if (button) {
    button.addEventListener("click", function () {
      const email = "gamermada2@gmail.com";
      const password = "madamada";
      const auth = getAuth();

      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          alert("User created successfully!");
          console.log("User:", user);
        })
        .catch((error) => {
          alert(error.message);
          console.error("Error:", error);
        });
    });
  } else {
    console.error("Button element not found!");
  }
};
