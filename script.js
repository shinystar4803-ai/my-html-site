// =========================================================
// 1. Firebase 라이브러리 불러오기 (수정 필요!)
// * Firebase 버전을 12.5.0으로 변경하고, getAnalytics 대신 getFirestore를 사용합니다.
// =========================================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js"; 
import { getFirestore, collection, addDoc, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js"; // ⬅️ Firestore 추가!

// =========================================================
// 2. Firebase 설정 (✅ 사용자님이 제공한 코드로 교체 완료)
// =========================================================
const firebaseConfig = {
    // ⬅️ 사용자님이 제공한 이 부분은 그대로 사용합니다.
    apiKey: "AIzaSyBcl5gwW4-eu2nuJju5DGqZeAI4MCvXvxY",
    authDomain: "review-41ca8.firebaseapp.com",
    projectId: "review-41ca8",
    storageBucket: "review-41ca8.firebasestorage.app",
    messagingSenderId: "1036465068852",
    appId: "1:1036465068852:web:8e261ad76f46a120e46361",
    measurementId: "G-QKJXNRSDWR"
};

// Firebase 앱 및 Firestore 초기화 (getAnalytics는 삭제하고 Firestore를 추가합니다)
const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // ⬅️ 이 줄이 데이터베이스 연결을 담당합니다!
const reviewsCollection = collection(db, "reviews"); // 리뷰 데이터를 저장할 컬렉션 이름

// =========================================================
// 3. 페이지 로드 시 Firebase에서 리뷰 불러오기 (이하 코드는 이전과 동일)
// =========================================================
document.addEventListener('DOMContentLoaded', function() {
    loadReviews();
});

async function loadReviews() {
    // ... (이전에 제공한 loadReviews 함수 내용 전체)
    const reviewList = document.getElementById('review-list');
    reviewList.innerHTML = ''; 
    
    try {
        const q = query(reviewsCollection, orderBy("timestamp", "desc"));
        const snapshot = await getDocs(q);
        
        if (snapshot.empty) {
            reviewList.innerHTML = '<p class="placeholder">아직 제출된 리뷰가 없습니다.</p>';
            return;
        }

        snapshot.forEach((doc) => {
            const review = doc.data();
            const starEmoji = '⭐'.repeat(parseInt(review.rating));
            
            const reviewItem = document.createElement('div');
            reviewItem.classList.add('review-item');

            reviewItem.innerHTML = `
                <div class="review-meta">
                    <strong>${review.name}</strong> 
                    <span>${starEmoji}</span>
                </div>
                <p>${review.reviewText.replace(/\n/g, '<br>')}</p>
            `;
            reviewList.appendChild(reviewItem);
        });
        
    } catch (e) {
        console.error("리뷰 불러오기 실패: ", e);
    }
}

// =========================================================
// 4. 폼 제출 시 Firebase에 리뷰 저장하기 (이하 코드는 이전과 동일)
// =========================================================
document.getElementById('review-form').addEventListener('submit', async function(e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const rating = document.getElementById('rating').value;
    const reviewText = document.getElementById('review-text').value;

    try {
        await addDoc(reviewsCollection, {
            name: name,
            rating: rating,
            reviewText: reviewText,
            timestamp: new Date()
        });
        
        loadReviews(); 
        this.reset();
        alert('리뷰가 성공적으로 제출되었습니다!');
        
    } catch (e) {
        console.error("리뷰 저장 실패: ", e);
        alert("리뷰 저장에 실패했습니다. Firebase 설정을 확인해주세요.");
    }
});