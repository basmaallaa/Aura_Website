// ===== Navbar =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () =>
  navbar.classList.toggle('scrolled', window.scrollY > 50)
);

document.getElementById('hamburger')?.addEventListener('click', () => {
  document.getElementById('mobileMenu').classList.toggle('open');
});

// ===== Helpers =====
const catLabels = {
  graduation: '🎓 تخرج',
  eid: '🌙 العيد',
  babyshower: '👶 سبوع البيبي',
  wedding: '💍 أفراح',
  ramadan: '☪️ رمضان',
  gifts: '🎁 هدايا'
};

function arabicPrice(p) {
  return Number(p).toLocaleString('ar-EG') +  ' ج.م';
}

function badgeClass(b) {
  if (b === 'جديد') return 'new';
  if (b === 'عرض') return 'sale';
  return '';
}

// ===== State =====
let products = [];
let product = null;
let currentImg = 0;
let currentImgs = [];

// ===== Load product id from URL =====
const urlParams = new URLSearchParams(window.location.search);
const id = parseInt(urlParams.get('id')) || 1;

// ===== Fetch Products =====
async function fetchProducts() {
  try {
    const res = await fetch(
      'https://6a1acf8dbc2f94475492ad5c.mockapi.io/aura/products'
    );

    products = await res.json();

    product = products.find(p => Number(p.id) === id) || products[0];

    renderProduct();
    renderGallery();
    renderFeatures();
    renderOptions();
    renderTags();
    renderRelated();
    setTitle();

  } catch (err) {
    console.error('Error loading products:', err);
  }
}

fetchProducts();

// ===== Set Main Image =====
function setMainImage(idx) {
  currentImg = idx;
  const main = document.getElementById('mainImage');

  main.style.opacity = '0';

  setTimeout(() => {
    main.src = currentImgs[idx];
    main.style.opacity = '1';
  }, 150);

  document.querySelectorAll('.thumb').forEach((t, i) => {
    t.classList.toggle('active', i === idx);
  });
}

// ===== Render Product Info =====
function renderProduct() {
  if (!product) return;

  document.getElementById('breadProduct').textContent = product.name;
  document.getElementById('productName').textContent = product.name;
  document.getElementById('productDesc').textContent = product.desc;
  document.getElementById('productPrice').textContent = arabicPrice(product.price);
  document.getElementById('productCat').textContent =
    catLabels[product.cat] || product.cat;

  // Badge
  const badge = document.getElementById('imgBadge');
  if (product.badge) {
    badge.textContent = product.badge;
    badge.className = `img-overlay-badge show ${badgeClass(product.badge)}`;
  }

  // WhatsApp
  const msg = encodeURIComponent(
    `مرحباً، أريد الاستفسار عن منتج: ${product.name} (${arabicPrice(product.price)})`
  );

  document.getElementById('whatsappOrder').href =
    `https://wa.me/201070282183?text=${msg}`;
}

// ===== Gallery =====
function renderGallery() {
  const thumbsEl = document.getElementById('thumbnails');

  // normalize imgs (API might send img or imgs)
  currentImgs = product.imgs || (product.img ? [product.img] : []);

  document.getElementById('mainImage').src = currentImgs[0];

  thumbsEl.innerHTML = '';

  currentImgs.forEach((src, i) => {
    const t = document.createElement('div');
    t.className = 'thumb' + (i === 0 ? ' active' : '');
    t.innerHTML = `<img src="${src}" alt="" loading="lazy" />`;

    t.addEventListener('click', () => setMainImage(i));
    thumbsEl.appendChild(t);
  });

  document.getElementById('prevBtn').onclick = () => {
    setMainImage((currentImg - 1 + currentImgs.length) % currentImgs.length);
  };

  document.getElementById('nextBtn').onclick = () => {
    setMainImage((currentImg + 1) % currentImgs.length);
  };
}

// ===== Features =====
function renderFeatures() {
  const featuresEl = document.getElementById('detailFeatures');
  featuresEl.innerHTML = '';

  if (!product.features) return;

  product.features.forEach(f => {
    const el = document.createElement('div');
    el.className = 'feature-item';
    el.innerHTML = `
      <span class="feature-icon-small">${f.icon || ''}</span>
      <div>
        <strong>${f.title}</strong>
        <span>${f.val}</span>
      </div>
    `;
    featuresEl.appendChild(el);
  });
}

//options
function renderOptions() {
  const optionsContainer = document.getElementById("productOptions");

  if (!product?.options?.length) {
    optionsContainer.innerHTML = "";
    return;
  }

  optionsContainer.innerHTML = `
    <h3 class="options-title">خيارات المنتج</h3>
    <div class="options-grid">
      ${product.options.map(option => `
        <div class="option-card">
          <span class="option-name">${option.name}</span>
          <span class="option-price">${arabicPrice(option.price)} </span>
        </div>
      `).join("")}
    </div>
  `;
}

// ===== Tags =====
function renderTags() {
  const tagsEl = document.getElementById('detailTags');
  tagsEl.innerHTML = '';

  if (!product.tags) return;

  product.tags.forEach(t => {
    const el = document.createElement('span');
    el.className = 'tag';
    el.textContent = '#' + t;
    tagsEl.appendChild(el);
  });
}

// ===== Related Products =====
function renderRelated() {
  const relatedGrid = document.getElementById('relatedGrid');
  relatedGrid.innerHTML = '';

  const related = products
    .filter(p =>
      p.id !== product.id &&
      (p.cat === product.cat || Math.random() > 0.5)
    )
    .slice(0, 4);

  related.forEach((p, i) => {
    const card = document.createElement('div');
    card.className = 'product-card reveal';

    const img = p.imgs?.[0] || p.img || '';

    card.innerHTML = `
      <div class="product-img-wrap">
        <img src="${img}" alt="${p.name}" loading="lazy" />
        ${p.badge ? `<div class="product-badge ${badgeClass(p.badge)}">${p.badge}</div>` : ''}
      </div>
      <div class="product-info">
        <span class="product-cat">${catLabels[p.cat] || p.cat}</span>
        <h3>${p.name}</h3>
        <div class="product-footer">
          <span class="product-price">${arabicPrice(p.price)}</span>
          <button class="view-btn">عرض</button>
        </div>
      </div>
    `;

    card.addEventListener('click', () => {
      window.location.href = `product-details.html?id=${p.id}`;
    });

    relatedGrid.appendChild(card);

    setTimeout(() => card.classList.add('visible'), 300 + i * 100);
  });
}

// ===== Title =====
function setTitle() {
  document.title = product.name + ' | Aura By So';
}