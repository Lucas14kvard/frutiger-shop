const ADMIN_PASSWORD = 'frutiger2024';

let isLoggedIn = false;
let productCounter = 0;

if (sessionStorage.getItem('adminLoggedIn') === 'true') {
    showAdminScreen();
}

function login() {
    const password = document.getElementById('passwordInput').value;
    if (password === ADMIN_PASSWORD) {
        sessionStorage.setItem('adminLoggedIn', 'true');
        showAdminScreen();
    } else {
        document.getElementById('loginError').style.display = 'block';
    }
}

function showAdminScreen() {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('adminScreen').style.display = 'block';
    isLoggedIn = true;
}

function logout() {
    sessionStorage.removeItem('adminLoggedIn');
    document.getElementById('loginScreen').style.display = 'block';
    document.getElementById('adminScreen').style.display = 'none';
    isLoggedIn = false;
}

document.getElementById('productPhotos').addEventListener('change', function(e) {
    const preview = document.getElementById('photoPreview');
    preview.innerHTML = '';
    
    Array.from(e.target.files).forEach(file => {
        const reader = new FileReader();
        reader.onload = function(event) {
            const img = document.createElement('img');
            img.src = event.target.result;
            preview.appendChild(img);
        };
        reader.readAsDataURL(file);
    });
});

async function saveProduct() {
    const name = document.getElementById('productName').value.trim();
    const price = document.getElementById('productPrice').value.trim();
    const desc = document.getElementById('productDesc').value.trim();
    const photoFiles = document.getElementById('productPhotos').files;
    const status = document.getElementById('saveStatus');
    
    if (!name || !price || !desc || photoFiles.length === 0) {
        status.textContent = '❌ Заполни все поля и добавь хотя бы одно фото';
        status.style.color = '#ff6b6b';
        return;
    }
    
    status.textContent = '⏳ Обрабатываю фото...';
    status.style.color = '#6db3a0';
    
    const photos = [];
    for (let i = 0; i < photoFiles.length; i++) {
        const base64 = await fileToBase64(photoFiles[i]);
        photos.push(base64);
    }
    
    const newProduct = {
        name,
        price,
        description: desc,
        photos,
        date: new Date().toISOString()
    };
    
    productCounter++;
    const fileName = `product_${Date.now()}.json`;
    
    downloadFile(newProduct, fileName);
    
    status.innerHTML = `✅ Файл <b>${fileName}</b> скачан!<br><br>📁 Загрузи его в папку <b>products/</b> на GitHub.<br>Затем обнови файл <b>products/list.json</b> — добавь "${fileName}" в список.`;
    status.style.color = '#5bdfcd';
    
    document.getElementById('productName').value = '';
    document.getElementById('productPrice').value = '';
    document.getElementById('productDesc').value = '';
    document.getElementById('productPhotos').value = '';
    document.getElementById('photoPreview').innerHTML = '';
}

function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

function downloadFile(data, fileName) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}