let products = [];
let currentGalleryIndex = 0;
let currentProductPhotos = [];
let touchStartX = 0;
let touchEndX = 0;

async function loadProducts() {
    try {
        const response = await fetch('products.json');
        if (!response.ok) throw new Error('Нет файла');
        const data = await response.json();
        products = data.products || [];
        renderProducts();
    } catch (e) {
        console.log('Файл products.json не найден, показываю пустую витрину');
        products = [];
        renderProducts();
    }
}

function renderProducts() {
    const grid = document.getElementById('productsGrid');
    
    if (products.length === 0) {
        grid.innerHTML = '<div class="loading">🌿 Товары скоро появятся...</div>';
        return;
    }
    
    grid.innerHTML = products.map((product, index) => `
        <div class="product-card" onclick="openProduct(${index})">
            <img src="${product.photos[0]}" alt="${product.name}" loading="lazy">
            <h3>${product.name}</h3>
            <p class="price">${product.price}</p>
        </div>
    `).join('');
}

function openProduct(index) {
    const product = products[index];
    currentProductPhotos = product.photos;
    currentGalleryIndex = 0;
    
    document.getElementById('modalTitle').textContent = product.name;
    document.getElementById('modalPrice').textContent = product.price;
    document.getElementById('modalDesc').textContent = product.description;
    
    renderGallery();
    document.getElementById('productModal').classList.add('active');
    
    document.querySelector('#productModal .modal-content').scrollTop = 0;
}

function renderGallery() {
    const slider = document.getElementById('gallerySlider');
    const dotsContainer = document.getElementById('galleryDots');
    
    slider.innerHTML = currentProductPhotos.map(photo => 
        `<img src="${photo}" alt="Фото товара">`
    ).join('');
    
    dotsContainer.innerHTML = currentProductPhotos.map((_, i) => 
        `<div class="gallery-dot ${i === currentGalleryIndex ? 'active' : ''}" onclick="goToSlide(${i})"></div>`
    ).join('');
    
    updateSliderPosition();
}

function updateSliderPosition() {
    const slider = document.getElementById('gallerySlider');
    slider.style.transform = `translateX(-${currentGalleryIndex * 100}%)`;
    
    document.querySelectorAll('.gallery-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === currentGalleryIndex);
    });
}

function slideGallery(direction) {
    if (currentProductPhotos.length <= 1) return;
    currentGalleryIndex += direction;
    if (currentGalleryIndex < 0) currentGalleryIndex = currentProductPhotos.length - 1;
    if (currentGalleryIndex >= currentProductPhotos.length) currentGalleryIndex = 0;
    updateSliderPosition();
}

function goToSlide(index) {
    currentGalleryIndex = index;
    updateSliderPosition();
}

function closeModal() {
    document.getElementById('productModal').classList.remove('active');
}

function openOrderModal() {
    document.getElementById('orderModal').classList.add('active');
}

function closeOrderModal() {
    document.getElementById('orderModal').classList.remove('active');
}

document.addEventListener('DOMContentLoaded', () => {
    const slider = document.getElementById('gallerySlider');
    
    slider.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, {passive: true});
    
    slider.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) slideGallery(1);
            else slideGallery(-1);
        }
    }
    
    document.getElementById('productModal').addEventListener('click', function(e) {
        if (e.target === this) closeModal();
    });
    
    document.getElementById('orderModal').addEventListener('click', function(e) {
        if (e.target === this) closeOrderModal();
    });
    
    loadProducts();
});