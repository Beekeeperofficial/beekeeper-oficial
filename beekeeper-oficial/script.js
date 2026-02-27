const products = [
  {
    id: 1,
    name: "Modelo Hive Silver",
    price: 289.90,
    image: "https://via.placeholder.com/300x200"
  },
  {
    id: 2,
    name: "Modelo Queen Black",
    price: 329.90,
    image: "https://via.placeholder.com/300x200"
  },
  {
    id: 3,
    name: "Modelo Royal Frame",
    price: 259.90,
    image: "https://via.placeholder.com/300x200"
  }
];

let cart = [];

function renderProducts() {
  const grid = document.getElementById("product-grid");
  grid.innerHTML = "";

  products.forEach(product => {
    grid.innerHTML += `
      <div class="product-card">
        <img src="${product.image}">
        <h3>${product.name}</h3>
        <p>R$ ${product.price.toFixed(2)}</p>
        <button onclick="addToCart(${product.id})">Adicionar</button>
      </div>
    `;
  });
}

function addToCart(id) {
  const product = products.find(p => p.id === id);
  cart.push(product);
  updateCart();
}

function updateCart() {
  const cartItems = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");
  const cartCount = document.getElementById("cart-count");

  cartItems.innerHTML = "";
  let total = 0;

  cart.forEach(item => {
    total += item.price;
    cartItems.innerHTML += `
      <div>
        ${item.name} - R$ ${item.price.toFixed(2)}
      </div>
    `;
  });

  cartTotal.innerText = total.toFixed(2);
  cartCount.innerText = cart.length;
}

function toggleCart() {
  document.getElementById("cart").classList.toggle("open");
}

function scrollToProducts() {
  document.getElementById("products").scrollIntoView({ behavior: "smooth" });
}

async function checkout() {
  if (cart.length === 0) {
    alert("Seu carrinho está vazio.");
    return;
  }

  const items = cart.map(product => ({
    title: product.name,
    quantity: 1,
    unit_price: product.price,
    currency_id: "BRL"
  }));

  try {
    const response = await fetch("/.netlify/functions/create-payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ items })
    });

    const data = await response.json();

    if (data.id) {
      window.location.href = `https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=${data.id}`;
    } else {
      alert("Erro ao criar pagamento.");
    }

  } catch (error) {
    alert("Erro ao conectar com o servidor.");
  }
}

renderProducts();