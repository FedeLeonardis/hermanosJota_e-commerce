const cartCount = document.getElementById("cart-count");
let cartItems = 0;

function addToCart() {
  cartItems++;
  if (cartCount) cartCount.textContent = cartItems;
}
