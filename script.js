// 1. 페이지 로드 시 localStorage에서 기존 리뷰 불러오기
document.addEventListener('DOMContentLoaded', function() {
    loadReviews();
});

// 리뷰 데이터를 저장하고 화면에 표시하는 함수
function loadReviews() {
    const reviewList = document.getElementById('review-list');
    reviewList.innerHTML = ''; // 기존 목록 초기화
    
    // localStorage에서 'reviews' 키로 저장된 JSON 문자열을 가져옴
    const reviews = JSON.parse(localStorage.getItem('reviews')) || [];
    
    if (reviews.length === 0) {
        reviewList.innerHTML = '<p class="placeholder">아직 제출된 리뷰가 없습니다.</p>';
        return;
    }
    
    // 배열의 각 리뷰 항목을 HTML로 만들어 화면에 추가
    reviews.forEach(review => {
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
        // 최신 리뷰를 맨 위에 추가 (prepend 사용)
        reviewList.prepend(reviewItem);
    });
}


document.getElementById('review-form').addEventListener('submit', function(e) {
    e.preventDefault();

    // 1. 입력 값 가져오기
    const name = document.getElementById('name').value;
    const rating = document.getElementById('rating').value;
    const reviewText = document.getElementById('review-text').value;

    // 2. localStorage에서 기존 리뷰 목록을 불러와 배열로 변환
    const existingReviews = JSON.parse(localStorage.getItem('reviews')) || [];

    // 3. 새 리뷰 객체 생성 및 배열에 추가
    const newReview = { name, rating, reviewText };
    existingReviews.push(newReview); // 새 리뷰를 배열에 추가
    
    // 4. 업데이트된 배열을 다시 JSON 문자열로 변환하여 localStorage에 저장
    localStorage.setItem('reviews', JSON.stringify(existingReviews));

    // 5. 화면 업데이트 및 폼 초기화
    loadReviews(); // 목록을 다시 불러와 화면에 표시
    this.reset();
    alert('리뷰가 성공적으로 제출되었습니다! 이벤트에 응모되셨습니다.');
});