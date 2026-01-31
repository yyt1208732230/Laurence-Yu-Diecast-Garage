document.addEventListener('DOMContentLoaded', () => {
    
    // State
    let currentLang = 'en';
    let carData = [];
    let currentCategory = 'BMW'; 
    let currentTagFilter = null; 
    let showRealCar = false; // New State: Default to Model

    // Elements
    const gallery = document.getElementById('gallery');
    const toggleBtn = document.getElementById('view-toggle-btn'); // The Icon
    
    // ... (Other elements: dropdown, modal, etc.) ...
    const dropdownBtn = document.querySelector('.dropdown-btn');
    const dropdownContent = document.getElementById('tag-list');
    const currentTagLabel = document.getElementById('current-tag-label');
    const itemCountLabel = document.getElementById('item-count');
    const langBtns = document.querySelectorAll('.lang-switch button');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const modal = document.getElementById('modal');
    const closeBtn = document.querySelector('.close-btn');

    // 1. Fetch Data
    fetch('cars.json').then(res => res.json()).then(data => {
        carData = data;
        updateUI();
    });

    // 2. Real Car Toggle Logic
    toggleBtn.addEventListener('click', () => {
        showRealCar = !showRealCar; // Toggle State
        
        // Visual Feedback on Button
        if (showRealCar) {
            toggleBtn.classList.add('active');
        } else {
            toggleBtn.classList.remove('active');
        }

        // Re-render grid
        updateUI();
    });

    // 3. UI Update Master
    function updateUI() {
        let visibleCars = currentCategory === 'all' 
            ? carData.filter(c => c.visible)
            : carData.filter(c => c.category === currentCategory && c.visible);

        generateDropdownOptions(visibleCars);

        if (currentTagFilter) {
            visibleCars = visibleCars.filter(c => {
                const tags = c.tags ? c.tags.split(';') : [];
                return tags.includes(currentTagFilter);
            });
            currentTagLabel.textContent = currentTagFilter;
        } else {
            currentTagLabel.textContent = currentLang === 'en' ? 'Filter by Tag' : '标签筛选';
        }
        updateDropdownSelection();
        itemCountLabel.textContent = `${visibleCars.length} items`;

        renderGallery(visibleCars);
    }

    // 4. Render Gallery (With Image Logic)
    function renderGallery(cars) {
        gallery.innerHTML = '';
        if (cars.length === 0) {
            gallery.innerHTML = '<div style="grid-column:1/-1; text-align:center; padding:50px; color:#999;">No cars found.</div>';
            return;
        }

        cars.forEach((car, index) => {
            const card = document.createElement('div');
            card.className = 'card';
            // 即使有懒加载，保留这个交错动画也很棒
            card.style.animationDelay = `${Math.min(index * 0.05, 1.0)}s`; 
            card.onclick = () => openModal(car);

            const tagsList = (car.tags || '').split(';').filter(t => t.trim() !== '');
            const tagsHTML = tagsList.slice(0, 5).map(t => `<span class="mini-tag">${t}</span>`).join('');

            let imgSrc = car.imagePath || 'images/placeholder.jpg'; 
            if (showRealCar && car.realCarImage) imgSrc = car.realCarImage;

            const title = `${car.modelName || 'Unknown'}`;

            card.innerHTML = `
                <div class="card-image-wrapper">
                    <img 
                        src="${imgSrc}" 
                        alt="${title}" 
                        loading="lazy" 
                        decoding="async"
                        onload="this.classList.add('loaded')"
                        onerror="this.onerror=null; this.src='${car.imagePath || ''}'; if(this.src==window.location.href) this.style.display='none';" 
                    >
                </div>
                <div class="card-info">
                    <div class="card-brand">${car.modelBrand || ''}</div>
                    <h3 class="card-title">${title}</h3>
                    <div class="card-tags">${tagsHTML}</div>
                </div>
            `;
            gallery.appendChild(card);
        });
    }

    // ... (Keep GenerateDropdown, Tabs, Lang, Modal logic same as before) ...
    // Just ensure openModal also uses the currentLang for labels
    
    // (Helper functions from previous step omitted for brevity, ensure they are included)
    function generateDropdownOptions(cars) { /* ... same ... */ }
    function updateDropdownSelection() { /* ... same ... */ }
    function openModal(car) { /* ... same ... */ }

    // Dropdown toggle logic
    dropdownBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdownContent.classList.toggle('show');
    });
    window.addEventListener('click', (e) => {
        if (!e.target.closest('.dropdown-btn')) dropdownContent.classList.remove('show');
    });
    // Tabs Logic
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCategory = btn.getAttribute('data-filter');
            currentTagFilter = null;
            updateUI();
        });
    });
    // Lang Logic
    langBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const lang = e.target.id === 'lang-en' ? 'en' : 'cn';
            if(lang === currentLang) return;
            currentLang = lang;
            langBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            
            // Update static texts
            document.querySelectorAll('[data-en]').forEach(el => {
                el.textContent = currentLang === 'en' ? el.getAttribute('data-en') : el.getAttribute('data-cn');
            });
            updateUI();
        });
    });
    // Modal Close
    closeBtn.onclick = () => modal.style.display = 'none';
    window.onclick = (e) => { if(e.target == modal) modal.style.display = 'none'; };
});