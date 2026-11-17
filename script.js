// Número de WhatsApp para receber os pedidos (DDI + DDD + número, só dígitos)
const WHATSAPP_NUMBER = "5511999999999";

const img = (id) => `https://images.unsplash.com/${id}?w=600&q=80`;

// Catálogo de exemplo — nomes, preços e imagens são ilustrativos
const PRODUCTS = [
  { id: 1, name: "Perfume Floral Essencial 100ml", brand: "Natura", category: "Perfumaria", price: 189.9, oldPrice: 229.9, rating: 4.8, reviews: 312, image: img("photo-1541643600914-78b084683601") },
  { id: 2, name: "Óleo Trifásico Corporal Castanha", brand: "Natura", category: "Corpo e Banho", price: 69.9, oldPrice: 84.9, rating: 4.9, reviews: 540, image: img("photo-1608248597279-f99d160bfcbc") },
  { id: 3, name: "Hidratante Facial Vitamina C", brand: "Natura", category: "Skincare", price: 79.9, rating: 4.6, reviews: 198, image: img("photo-1620916566398-39f1143ab7be") },
  { id: 4, name: "Sabonete em Barra Kit 5 un.", brand: "Natura", category: "Corpo e Banho", price: 39.9, oldPrice: 49.9, rating: 4.7, reviews: 421, image: img("photo-1600857062241-98e5dba7f214") },
  { id: 5, name: "Shampoo Nutrição Murumuru", brand: "Natura", category: "Cabelos", price: 32.9, rating: 4.5, reviews: 154, image: img("photo-1535585209827-a15fcdbc4c2d") },
  { id: 6, name: "Base Líquida Matte Longa Duração", brand: "Mary Kay", category: "Maquiagem", price: 119.9, oldPrice: 139.9, rating: 4.8, reviews: 276, image: img("photo-1631729371254-42c2892f0e6e") },
  { id: 7, name: "Batom Cremoso Rosa Intenso", brand: "Mary Kay", category: "Maquiagem", price: 59.9, rating: 4.7, reviews: 389, image: img("photo-1586495777744-4413f21062fa") },
  { id: 8, name: "Sérum Antissinais Noturno", brand: "Mary Kay", category: "Skincare", price: 159.9, oldPrice: 189.9, rating: 4.9, reviews: 233, image: img("photo-1570172619644-dfd03ed5d881") },
  { id: 9, name: "Kit Pincéis Profissionais", brand: "Mary Kay", category: "Maquiagem", price: 99.9, rating: 4.6, reviews: 97, image: img("photo-1512496015851-a90fb38ba796") },
  { id: 10, name: "Máscara para Cílios Volume", brand: "Mary Kay", category: "Maquiagem", price: 64.9, oldPrice: 74.9, rating: 4.5, reviews: 211, image: img("photo-1631214540553-ff044a3ff1d4") },
  { id: 11, name: "Colônia Amadeirada Masculina 100ml", brand: "O Boticário", category: "Perfumaria", price: 169.9, oldPrice: 199.9, rating: 4.9, reviews: 612, image: img("photo-1594035910387-fea47794261f") },
  { id: 12, name: "Perfume Feminino Doce 75ml", brand: "O Boticário", category: "Perfumaria", price: 159.9, rating: 4.8, reviews: 488, image: img("photo-1592945403244-b3fbafd7f539") },
  { id: 13, name: "Loção Hidratante Corporal 400ml", brand: "O Boticário", category: "Corpo e Banho", price: 54.9, oldPrice: 64.9, rating: 4.7, reviews: 305, image: img("photo-1571781926291-c477ebfd024b") },
  { id: 14, name: "Paleta de Sombras Nude", brand: "O Boticário", category: "Maquiagem", price: 89.9, rating: 4.6, reviews: 142, image: img("photo-1583241800698-e8ab01830a07") },
  { id: 15, name: "Kit Presente Perfume + Hidratante", brand: "O Boticário", category: "Perfumaria", price: 219.9, oldPrice: 289.9, rating: 5.0, reviews: 128, image: img("photo-1607602132700-068258431c6c") },
  { id: 16, name: "Condicionador Reparação Intensa", brand: "O Boticário", category: "Cabelos", price: 36.9, rating: 4.5, reviews: 87, image: img("photo-1526947425960-945c6e72858f") },
];

const state = { brand: "Todas", category: "Todas", search: "", sort: "relevancia" };
let cart = loadCart();

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);
const brl = (v) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

function loadCart() {
  try { return JSON.parse(localStorage.getItem("bella-cart")) || []; } catch { return []; }
}
function saveCart() {
  try { localStorage.setItem("bella-cart", JSON.stringify(cart)); } catch {}
}

// Fallback visual caso alguma imagem externa não carregue
function attachFallback(scope = document) {
  scope.querySelectorAll("img").forEach((el) => {
    if (el.dataset.fb) return;
    el.dataset.fb = "1";
    el.addEventListener("error", () => {
      el.classList.add("img-fallback");
      el.removeAttribute("src");
    }, { once: true });
  });
}

function stars(r) {
  const full = Math.round(r);
  return "★".repeat(full) + "☆".repeat(5 - full);
}

function renderProducts() {
  let list = PRODUCTS.filter((p) =>
    (state.brand === "Todas" || p.brand === state.brand) &&
    (state.category === "Todas" || p.category === state.category) &&
    p.name.toLowerCase().includes(state.search.toLowerCase())
  );
  if (state.sort === "menor") list.sort((a, b) => a.price - b.price);
  if (state.sort === "maior") list.sort((a, b) => b.price - a.price);

  $("#empty").hidden = list.length > 0;
  $("#products").innerHTML = list.map((p) => {
    const off = p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : 0;
    return `
      <article class="product">
        <div class="product__img">
          <img src="${p.image}" alt="${p.name}" loading="lazy" />
          <span class="badge badge--${p.brand.split(" ")[0]}">${p.brand}</span>
          ${off ? `<span class="discount">-${off}%</span>` : ""}
        </div>
        <div class="product__body">
          <span class="product__cat">${p.category}</span>
          <h3 class="product__name">${p.name}</h3>
          <div class="rating">${stars(p.rating)} <small>(${p.reviews})</small></div>
          <div class="price">
            ${p.oldPrice ? `<del>${brl(p.oldPrice)}</del>` : ""}<strong>${brl(p.price)}</strong>
            <small>ou 3x de ${brl(p.price / 3)} sem juros</small>
          </div>
          <button class="btn btn--primary" data-add="${p.id}">Adicionar à sacola</button>
        </div>
      </article>`;
  }).join("");
  attachFallback($("#products"));
}

function setBrand(brand) {
  state.brand = brand;
  $$("#brandFilters .chip").forEach((c) => c.classList.toggle("active", c.dataset.brand === brand));
  renderProducts();
}

// Carrinho
function addToCart(id) {
  const item = cart.find((i) => i.id === id);
  item ? item.qty++ : cart.push({ id, qty: 1 });
  saveCart();
  renderCart();
  toast("Produto adicionado à sacola 💖");
}
function changeQty(id, delta) {
  const item = cart.find((i) => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter((i) => i.id !== id);
  saveCart();
  renderCart();
}
function renderCart() {
  const items = cart.map((i) => ({ ...PRODUCTS.find((p) => p.id === i.id), qty: i.qty })).filter((i) => i.name);
  const count = items.reduce((s, i) => s + i.qty, 0);
  const total = items.reduce((s, i) => s + i.qty * i.price, 0);
  $("#cartCount").textContent = count;
  $("#cartTotal").textContent = brl(total);
  $("#cartItems").innerHTML = items.length
    ? items.map((i) => `
        <div class="cart-item">
          <img src="${i.image}" alt="${i.name}" />
          <div>
            <h5>${i.name}</h5>
            <small>${i.brand} · ${brl(i.price)}</small>
            <div class="qty">
              <button data-dec="${i.id}" aria-label="Diminuir">−</button>
              <span>${i.qty}</span>
              <button data-inc="${i.id}" aria-label="Aumentar">+</button>
            </div>
          </div>
          <button class="remove" data-remove="${i.id}">Remover</button>
        </div>`).join("")
    : `<p class="cart__empty">Sua sacola está vazia 🛍️</p>`;
  attachFallback($("#cartItems"));
}
function openCart(open) {
  $("#cart").classList.toggle("open", open);
  $("#overlay").classList.toggle("show", open);
}
function checkout() {
  if (!cart.length) return toast("Adicione produtos à sacola primeiro");
  const lines = cart.map((i) => {
    const p = PRODUCTS.find((x) => x.id === i.id);
    return `• ${i.qty}x ${p.name} (${p.brand}) - ${brl(p.price * i.qty)}`;
  });
  const total = cart.reduce((s, i) => s + i.qty * PRODUCTS.find((p) => p.id === i.id).price, 0);
  const msg = `Olá! Gostaria de fazer o pedido:\n\n${lines.join("\n")}\n\nTotal: ${brl(total)}`;
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");
}

let toastTimer;
function toast(text) {
  const t = $("#toast");
  t.textContent = text;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 2200);
}

// Eventos
document.addEventListener("click", (e) => {
  const t = e.target.closest("[data-add],[data-inc],[data-dec],[data-remove]");
  if (!t) return;
  if (t.dataset.add) addToCart(+t.dataset.add);
  if (t.dataset.inc) changeQty(+t.dataset.inc, 1);
  if (t.dataset.dec) changeQty(+t.dataset.dec, -1);
  if (t.dataset.remove) changeQty(+t.dataset.remove, -Infinity);
});

$$("#brandFilters .chip").forEach((c) => c.addEventListener("click", () => setBrand(c.dataset.brand)));
$$(".brand-card").forEach((c) => c.addEventListener("click", () => {
  setBrand(c.dataset.brand);
  $("#produtos").scrollIntoView();
}));
$$(".category").forEach((c) => c.addEventListener("click", () => {
  state.category = c.dataset.category;
  $("#categorySelect").value = c.dataset.category;
  renderProducts();
  $("#produtos").scrollIntoView();
}));
$("#categorySelect").addEventListener("change", (e) => { state.category = e.target.value; renderProducts(); });
$("#sortSelect").addEventListener("change", (e) => { state.sort = e.target.value; renderProducts(); });
$("#search").addEventListener("input", (e) => { state.search = e.target.value; renderProducts(); });

$("#cartBtn").addEventListener("click", () => openCart(true));
$("#closeCart").addEventListener("click", () => openCart(false));
$("#overlay").addEventListener("click", () => openCart(false));
$("#checkoutBtn").addEventListener("click", checkout);

$("#menuBtn").addEventListener("click", () => $("#nav").classList.toggle("open"));
$$("#nav a").forEach((a) => a.addEventListener("click", () => $("#nav").classList.remove("open")));

$("#newsletterForm").addEventListener("submit", (e) => {
  e.preventDefault();
  e.target.hidden = true;
  $("#newsletterMsg").hidden = false;
});

$("#year").textContent = new Date().getFullYear();

attachFallback();
renderProducts();
renderCart();
