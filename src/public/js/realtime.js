const socket = io();

const productForm = document.getElementById("productForm");
const productsUl = document.getElementById("products");

productForm.addEventListener("submit", e => {
  e.preventDefault();
  const title = document.getElementById("title").value;
  const id = document.getElementById("id").value;
  socket.emit("newProduct", { id, title });
  productForm.reset();
});

socket.on("productList", products => {
  productsUl.innerHTML = "";
  products.forEach(p => {
    const li = document.createElement("li");
    li.innerHTML = `${p.title} 
      <button onclick="deleteProduct('${p.id}')">Eliminar</button>`;
    productsUl.appendChild(li);
  });
});

function deleteProduct(id) {
  socket.emit("deleteProduct", id);
}
