const socket = io();

const list = document.getElementById('productsList');
const form = document.getElementById('productForm');

function render(products) {
  list.innerHTML = '';
  products.forEach(p => {
    const li = document.createElement('li');
    li.dataset.id = p.id;
    li.innerHTML = `
      <img src="${p.thumbnail}" alt="${p.title}" />
      <strong>${p.title}</strong> — $${p.price}
      <button class="btn-delete" data-id="${p.id}">Eliminar</button>
    `;
    list.appendChild(li);
  });
}

socket.on('productsUpdated', products => {
  render(products);
});

form.addEventListener('submit', e => {
  e.preventDefault();
  const data = new FormData(form);
  fetch('/api/products', { method: 'POST', body: data });
  form.reset();
});

list.addEventListener('click', e => {
  if (!e.target.matches('.btn-delete')) return;
  const id = e.target.dataset.id;
  fetch(`/api/products/${id}`, { method: 'DELETE' });
});