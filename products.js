// ===== Navbar =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => navbar.classList.toggle('scrolled', window.scrollY > 50));
document.getElementById('hamburger')?.addEventListener('click', () => {
  document.getElementById('mobileMenu').classList.toggle('open');
});

// ===== Products Data =====
// const products = [
//   { id: 1,  name: 'لوحة راتنج شخصية',         cat: 'babyshower',      price: 250, badge: 'الأكثر مبيعاً', desc: 'تحفة فنية مصنوعة يدوياً بألوان تناسب ذوقك',          img: 'Images/BabyShower/main1.jpeg' },
//   { id: 2,  name: 'إطار تخرج راتنج',           cat: 'babyshower', price: 180, badge: 'جديد',          desc: 'إطار فاخر يحفظ لحظة التخرج للأبد',                   img: 'Images/BabyShower/main2.jpeg' },
//   { id: 3,  name: 'طقم هدايا الأفراح',         cat: 'wedding',    price: 350, badge: '',              desc: 'مجموعة فاخرة مخصصة لأجمل ليالي العمر',               img: 'images/logo.jpeg' },
//   { id: 4,  name: 'بوكس سبوع البيبي',          cat: 'babyshower', price: 220, badge: 'عرض',           desc: 'مجموعة هدايا للاحتفال بقدوم المولود',                 img: 'Images/BabyShower/main3.jpeg' },
//   { id: 5,  name: 'شمعة عيد الراتنج',          cat: 'eid',        price: 120, badge: '',              desc: 'شمعة فنية مزخرفة بزخارف العيد',                       img: 'https://images.unsplash.com/photo-1544365558-35aa4afcf11f?w=500&q=80' },
//   { id: 6,  name: 'فانوس رمضان راتنج',         cat: 'ramadan',    price: 200, badge: 'جديد',          desc: 'فانوس تقليدي بلمسة عصرية فاخرة',                     img: 'https://images.unsplash.com/photo-1531251445707-1f000e1e87d0?w=500&q=80' },
//   { id: 7,  name: 'بوكس تخرج مميز',            cat: 'graduation', price: 280, badge: 'الأكثر مبيعاً', desc: 'طقم متكامل للاحتفال بيوم التخرج',                    img: 'https://images.unsplash.com/photo-1564419431703-ce4b0f4fe1b0?w=500&q=80' },
//   { id: 8,  name: 'ورد راتنج فاخر',            cat: 'babyshower',      price: 160, badge: '',              desc: 'زهرة راتنج دائمة الجمال لا تذبل أبداً',               img: 'Images/BabyShower/main5.jpeg' },
//   { id: 9,  name: 'طوق عروسة راتنج',           cat: 'wedding',    price: 300, badge: 'عرض',           desc: 'تاج العروسة المصنوع من الراتنج الفاخر',               img: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=500&q=80' },
//   { id: 10, name: 'بوكس العيد الذهبي',         cat: 'eid',        price: 380, badge: 'الأكثر مبيعاً', desc: 'مجموعة هدايا عيد فاخرة بلمسات ذهبية',               img: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500&q=80' },
//   { id: 11, name: 'إطار صورة سبوع',            cat: 'babyshower', price: 150, badge: '',              desc: 'إطار راتنج لحفظ أجمل صور المولود',                   img: 'Images/BabyShower/main4.jpeg' },
//   { id: 12, name: 'لوحة تخرج بالأسماء',        cat: 'graduation', price: 240, badge: 'جديد',          desc: 'لوحة مخصصة بالاسم وتاريخ التخرج',                    img: 'https://images.unsplash.com/photo-1616847688693-8cfe81b2b13e?w=500&q=80' },
//   { id: 13, name: 'إطار تخرج راتنج',           cat: 'babyshower', price: 180, badge: 'جديد',          desc: 'إطار فاخر يحفظ لحظة التخرج للأبد',                   img: 'Images/BabyShower/main2.jpeg' },

//];

let products = [];

async function fetchProducts() {
  try {
    const res = await fetch('https://6a1acf8dbc2f94475492ad5c.mockapi.io/aura/products');
    products = await res.json();

    updateCategoryCounts();
    render();
  } catch (error) {
    console.error('Error loading products:', error);
  }
}

function updateCategoryCounts() {
  document.getElementById('count-all').textContent = products.length;

  const categories = [
    'graduation',
    'eid',
    'babyshower',
    'wedding',
    'ramadan',
    'gifts'
  ];

  categories.forEach(cat => {
    const count = products.filter(product => product.cat === cat).length;

    document.getElementById(`count-${cat}`).textContent = count;
  });
}

// ===== State =====
let filtered = [...products];
let activeCategory = 'all';
let searchTerm = '';
let maxPrice = 1000;
let sortBy = 'default';

// ===== Read URL param =====
const urlParams = new URLSearchParams(window.location.search);
const urlCat = urlParams.get('cat');
if (urlCat) {
  activeCategory = urlCat;
  const radio = document.querySelector(`input[name=category][value="${urlCat}"]`);
  if (radio) radio.checked = true;
}

// ===== Render =====
function badgeClass(badge) {
  if (!badge) return '';
  if (badge === 'جديد') return 'new';
  if (badge === 'عرض') return 'sale';
  return '';
}

function catLabel(cat) {
  const map = { graduation: '🎓 تخرج', eid: '🌙 العيد', babyshower: '👶 سبوع البيبي', wedding: '💍 أفراح', ramadan: '☪️ رمضان', gifts: '🎁 هدايا' };
  return map[cat] || cat;
}

function arabicPrice(p) {
  return p.toLocaleString('ar-EG') + ' جنيه';
}

function render() {
    if (!products.length) return;
  const grid = document.getElementById('productsGrid');
  const noResults = document.getElementById('noResults');
  const resultsNum = document.getElementById('resultsNum');

  // Filter
  filtered = products.filter(p => {
    const matchCat  = activeCategory === 'all' || p.cat === activeCategory;
    const matchSearch = p.name.includes(searchTerm) || p.desc.includes(searchTerm);
    const matchPrice = p.price <= maxPrice;
    return matchCat && matchSearch && matchPrice;
  });

  // Sort
  if (sortBy === 'price-asc')  filtered.sort((a,b) => a.price - b.price);
  if (sortBy === 'price-desc') filtered.sort((a,b) => b.price - a.price);
  if (sortBy === 'name')       filtered.sort((a,b) => a.name.localeCompare(b.name, 'ar'));

  resultsNum.textContent = filtered.length;
  grid.innerHTML = '';
  noResults.style.display = filtered.length ? 'none' : 'flex';

  filtered.forEach((p, i) => {
    const card = document.createElement('div');
    card.className = 'product-card reveal';
    card.innerHTML = `
      <div class="product-img-wrap">
        <img src="${p.img}" alt="${p.name}" loading="lazy" />
        ${p.badge ? `<div class="product-badge ${badgeClass(p.badge)}">${p.badge}</div>` : ''}
        <div class="product-overlay">
          <button class="overlay-btn" onclick="event.stopPropagation();goDetail(${p.id})">عرض التفاصيل</button>
        </div>
      </div>
      <div class="product-info">
        <span class="product-cat">${catLabel(p.cat)}</span>
        <h3>${p.name}</h3>
        <p>${p.desc}</p>
        <div class="product-footer">
          <span class="product-price">${arabicPrice(p.price)}</span>
          <button class="view-btn" onclick="event.stopPropagation();goDetail(${p.id})">اطلب الآن</button>
        </div>
      </div>
    `;
    card.addEventListener('click', () => goDetail(p.id));
    grid.appendChild(card);
    setTimeout(() => card.classList.add('visible'), i * 60);
  });
}

function goDetail(id) {
  window.location.href = `product-details.html?id=${id}`;
}

// ===== Event Listeners =====
document.getElementById('searchInput').addEventListener('input', e => {
  searchTerm = e.target.value.trim();
  render();
});

document.querySelectorAll('input[name=category]').forEach(r => {
  r.addEventListener('change', e => { activeCategory = e.target.value; render(); });
});

const priceSlider = document.getElementById('priceSlider');
const maxPriceInput = document.getElementById('maxPrice');
const maxPriceDisplay = document.getElementById('maxPriceDisplay');

priceSlider.addEventListener('input', e => {
  maxPrice = parseInt(e.target.value);
  maxPriceInput.value = maxPrice;
  maxPriceDisplay.textContent = arabicPrice(maxPrice);
  render();
});

maxPriceInput.addEventListener('change', e => {
  maxPrice = parseInt(e.target.value) || 1000;
  priceSlider.value = maxPrice;
  maxPriceDisplay.textContent = arabicPrice(maxPrice);
  render();
});

document.getElementById('sortSelect').addEventListener('change', e => {
  sortBy = e.target.value;
  render();
});

document.getElementById('resetFilters').addEventListener('click', () => {
  activeCategory = 'all';
  searchTerm = '';
  maxPrice = 1000;
  sortBy = 'default';
  document.getElementById('searchInput').value = '';
  document.querySelector('input[name=category][value=all]').checked = true;
  priceSlider.value = 1000;
  maxPriceInput.value = 1000;
  maxPriceDisplay.textContent = '١٠٠٠ جنيه';
  document.getElementById('sortSelect').value = 'default';
  render();
});

// ===== Init =====
// updateCategoryCounts();
// render();

fetchProducts();
