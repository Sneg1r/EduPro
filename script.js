// ==================== ОБЩАЯ ФУНКЦИЯ ЗАГРУЗКИ XML ====================
async function loadXML(file) {
    try {
        const response = await fetch(file);
        const xmlText = await response.text();
        const parser = new DOMParser();
        return parser.parseFromString(xmlText, 'text/xml');
    } catch (error) {
        console.error(`Ошибка загрузки ${file}:`, error);
        return null;
    }
}

// ==================== ЗАПОЛНЕНИЕ КАРТОЧЕК КУРСОВ ====================
async function loadAndFillCourses() {
    const xmlDoc = await loadXML('xml/teachers.xml');
    if (!xmlDoc) return;
    
    const courses = xmlDoc.getElementsByTagName('course');
    const cards = document.querySelectorAll('.course-card');
    
    for (let i = 0; i < cards.length && i < courses.length; i++) {
        const card = cards[i];
        const c = courses[i];
        
        const getTag = (tag) => c.getElementsByTagName(tag)[0]?.textContent || '';
        const title = getTag('title');
        const teacher = getTag('teacher');
        const price = getTag('price');
        
        // Заполняем основные поля
        const titleDiv = card.querySelector('.course-title');
        const priceDiv = card.querySelector('.price');
        if (titleDiv) titleDiv.textContent = title;
        if (priceDiv) priceDiv.textContent = `${price} BYN / занятие`;
        
        // Для каталога (дополнительные поля)
        const teacherDiv = card.querySelector('.teacher-name-small');
        const achievementDiv = card.querySelector('.achievement-small');
        const img = card.querySelector('.teacher-photo-small img');
        const btn = card.querySelector('.enrollBtn');
        const category = c.getAttribute('category') || '';
        
        if (teacherDiv) teacherDiv.textContent = teacher;
        if (achievementDiv) achievementDiv.textContent = getTag('achievement');
        if (img) img.src = getTag('teacherImage');
        if (btn) btn.setAttribute('data-course', title);
        card.setAttribute('data-category', category);
    }
    console.log('✅ Курсы загружены');
}

// ==================== ГЛАВНАЯ СТРАНИЦА ====================
async function fillHomePreview() {
    const previewDiv = document.getElementById("previewSubjects");
    if (!previewDiv) return;
    
    const xmlDoc = await loadXML('xml/teachers.xml');
    if (!xmlDoc) return;
    
    const courses = xmlDoc.getElementsByTagName('course');
    const cards = previewDiv.querySelectorAll('.course-card');
    
    for (let i = 0; i < cards.length && i < courses.length; i++) {
        const card = cards[i];
        const c = courses[i];
        
        const title = c.getElementsByTagName('title')[0]?.textContent || '';
        const teacher = c.getElementsByTagName('teacher')[0]?.textContent || '';
        const price = c.getElementsByTagName('price')[0]?.textContent || '';
        
        const titleDiv = card.querySelector('.course-title');
        const teacherDiv = card.querySelector('.teacher-name');
        const priceDiv = card.querySelector('.price');
        
        if (titleDiv) titleDiv.textContent = title;
        if (teacherDiv) teacherDiv.textContent = teacher;
        if (priceDiv) priceDiv.textContent = `${price} BYN / занятие`;
    }
    console.log('✅ Ключевые предметы загружены');
}

// ==================== ЗАПОЛНЕНИЕ ОТЗЫВОВ ====================
async function loadAndFillReviews() {
    const xmlDoc = await loadXML('xml/reviews.xml');
    if (!xmlDoc) return;
    
    const reviews = xmlDoc.getElementsByTagName('review');
    const cards = document.querySelectorAll('.testimonial-card');
    
    const months = {'01':'январь','02':'февраль','03':'март','04':'апрель','05':'май','06':'июнь','07':'июль','08':'август','09':'сентябрь','10':'октябрь','11':'ноябрь','12':'декабрь'};
    
    for (let i = 0; i < cards.length && i < reviews.length; i++) {
        const card = cards[i];
        const r = reviews[i];
        
        const author = r.getElementsByTagName('author')[0]?.textContent || '';
        const course = r.getElementsByTagName('course')[0]?.textContent || '';
        const rating = parseInt(r.getElementsByTagName('rating')[0]?.textContent) || 5;
        const text = r.getElementsByTagName('text')[0]?.textContent || '';
        const date = r.getElementsByTagName('date')[0]?.textContent || '';
        const photo = r.getElementsByTagName('photo')[0]?.textContent || '';
        
        const [year, month] = date.split('-');
        const formattedDate = date ? `${months[month] || 'июнь'} ${year}` : 'июнь 2025';
        const stars = '<img src="svg/star.svg" class="star-icon">'.repeat(rating); 
        const score = text.match(/(\d{2,3})\s*балл/)?.[1] || 'отлично';
        
        const nameHeader = card.querySelector('.testimonial-info h4');
        const dateDiv = card.querySelector('.testimonial-date');
        const starsDiv = card.querySelector('.testimonial-stars');
        const textDiv = card.querySelector('.testimonial-text');
        const subjectSpan = card.querySelector('.testimonial-subject');
        const photoImg = card.querySelector('.testimonial-photo');
        
        if (nameHeader) nameHeader.textContent = author;
        if (dateDiv) dateDiv.textContent = formattedDate;
        if (starsDiv) starsDiv.innerHTML = stars;
        if (textDiv) textDiv.textContent = `“${text}”`;
        if (subjectSpan) subjectSpan.textContent = `${course} — ${score} баллов`;
        if (photoImg && photo) photoImg.src = photo;
    }
    console.log('✅ Отзывы загружены');
}

// ==================== ГРАФИК ====================
window.drawProgressChart = () => {
    const canvas = document.getElementById('progressChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const labels = ['Сен', 'Окт', 'Ноя', 'Дек', 'Янв', 'Фев', 'Мар', 'Апр', 'Май'];
    const data = [62, 68, 73, 78, 81, 84, 87, 89, 92];
    const pixelRatio = window.devicePixelRatio || 1;
    const container = canvas.parentElement;
    const w = container ? container.clientWidth - 32 : 800;
    const h = 250;
    
    canvas.width = w * pixelRatio;
    canvas.height = h * pixelRatio;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(pixelRatio, pixelRatio);
    ctx.clearRect(0, 0, w, h);
    
    const barW = (w - 50) / data.length - 8;
    const maxH = 170;
    const bottomY = h - 30;
    
    data.forEach((val, i) => {
        const x = 25 + i * (barW + 8);
        const height = (val / 100) * maxH;
        const y = bottomY - height;
        
        ctx.fillStyle = '#2c5f8a';
        ctx.fillRect(x, y, barW, height);
        
        ctx.fillStyle = '#64748b';
        ctx.font = '700 12px system-ui, "Segoe UI", "Roboto", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(labels[i], x + barW / 2, bottomY + 18);
        
        ctx.fillStyle = '#2c5f8a';
        ctx.fillText(val, x + barW / 2, y - 8);
    });
};

// ==================== БУРГЕР ====================
document.querySelectorAll('.burger').forEach(burger => {
    burger.addEventListener('click', function() {
        const menu = this.closest('.navbar')?.querySelector('.nav-menu');
        if (menu) menu.classList.toggle('show');
    });
});

// ==================== МОДАЛЬНОЕ ОКНО ====================
function bindEnrollButtons() {
    document.querySelectorAll('.enrollBtn').forEach(btn => {
        btn.removeEventListener('click', enrollHandler);
        btn.addEventListener('click', enrollHandler);
    });
}

function enrollHandler(e) {
    const modal = document.getElementById('enrollModal');
    const courseTitle = document.getElementById('modalCourse');
    if (modal && courseTitle) {
        courseTitle.textContent = `Запись: ${this.getAttribute('data-course')}`;
        modal.style.display = 'flex';
    }
}

// ==================== ИНИЦИАЛИЗАЦИЯ ====================
document.addEventListener('DOMContentLoaded', async () => {
    // Каталог курсов
    if (document.querySelector('.course-card')) {
        await loadAndFillCourses();
        bindEnrollButtons();
    }
    
    // Главная страница
    if (document.getElementById('previewSubjects')) {
        await fillHomePreview();
    }
    
    // Отзывы
    if (document.querySelector('.testimonial-card')) {
        await loadAndFillReviews();
    }
    
    // График
    if (document.getElementById('progressChart')) {
        window.drawProgressChart();
        window.addEventListener('resize', () => window.drawProgressChart());
    }
    
    // Фильтры
    const filterBtns = document.querySelectorAll('.filter-btn');
    if (filterBtns.length) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const filter = btn.dataset.filter;
                document.querySelectorAll('.course-card').forEach(card => {
                    card.style.display = (filter === 'all' || card.dataset.category === filter) ? 'block' : 'none';
                });
            });
        });
    }
    
    // Калькулятор
    const priceInput = document.getElementById('lessonPrice');
    const lessonsSelect = document.getElementById('lessonsCount');
    const calcBtn = document.getElementById('calcBtn');
    const resultDiv = document.getElementById('calcResult');
    
    if (calcBtn && priceInput && lessonsSelect && resultDiv) {
        const update = () => {
            let price = Math.min(99, Math.max(10, parseFloat(priceInput.value) || 23));
            priceInput.value = price;
            const total = price * parseInt(lessonsSelect.value, 10);
            resultDiv.innerHTML = `💰 Стоимость <strong>${lessonsSelect.value} занятий</strong>: <span style="color:#f4a261; font-size:1.6rem;">${total} BYN</span><br><small>* Пробное занятие — возврат до 2-го урока</small>`;
        };
        calcBtn.addEventListener('click', update);
        priceInput.addEventListener('input', update);
        lessonsSelect.addEventListener('change', update);
        update();
    }
    
    // Модальное окно (создаём один раз)
    if (!document.getElementById('enrollModal')) {
        const modal = document.createElement('div');
        modal.id = 'enrollModal';
        modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);display:none;justify-content:center;align-items:center;z-index:9999';
        modal.innerHTML = '<div style="background:white;padding:30px;border-radius:16px;width:280px;text-align:center"><h3 id="modalCourse"></h3><input id="studentName" placeholder="Ваше имя" style="width:100%;padding:10px;margin:10px 0;border:1px solid #ccc;border-radius:8px"><input id="studentPhone" placeholder="Телефон" style="width:100%;padding:10px;margin:10px 0;border:1px solid #ccc;border-radius:8px"><button id="submitEnroll" style="background:#2c5f8a;color:white;padding:10px;border:none;border-radius:8px;width:100%;cursor:pointer">Записаться</button><button id="closeModal" style="margin-top:10px;background:#e74c3c;color:white;padding:10px;border:none;border-radius:8px;width:100%;cursor:pointer">Отмена</button></div>';
        document.body.appendChild(modal);
        
        const modalEl = document.getElementById('enrollModal');
        document.getElementById('closeModal').onclick = () => modalEl.style.display = 'none';
        document.getElementById('submitEnroll').onclick = () => {
            const name = document.getElementById('studentName').value.trim();
            const phone = document.getElementById('studentPhone').value.trim();
            if (!name || !phone) return alert('Заполните имя и телефон');
            alert(`✅ ${name}, вы записаны! Мы позвоним вам на ${phone}`);
            modalEl.style.display = 'none';
            document.getElementById('studentName').value = '';
            document.getElementById('studentPhone').value = '';
        };
        modalEl.onclick = (e) => { if (e.target === modalEl) modalEl.style.display = 'none'; };
    }
});