import { cart } from '../data/cart.js';
import { products } from '../data/products.js';
// Import these to get the delivery days
import { deliveryOptions, getDeliveryOption } from '../data/deliveryOptions.js';

function renderTrackingPage() {
  const url = new URL(window.location.href);
  const productId = url.searchParams.get('productId');

  let matchingProduct;
  products.forEach((product) => {
    if (product.id === productId) {
      matchingProduct = product;
    }
  });

  if (!matchingProduct) {
    return;
  }

  // 1. Find the specific cart item to get its selected deliveryOptionId
  let cartItem;
  cart.forEach((item) => {
    if (item.productId === productId) {
      cartItem = item;
    }
  });

  // 2. Get the delivery option details (just like in orderSummary.js)
  const deliveryOptionId = cartItem.deliveryOptionId;
  const deliveryOption = getDeliveryOption(deliveryOptionId);

  // 3. Calculate the date using built-in new Date()
  const today = new Date();
  const deliveryDate = new Date(today);
  
  // Use the deliveryDays from the selected option instead of a hardcoded "3"
  deliveryDate.setDate(today.getDate() + deliveryOption.deliveryDays);

  const dateString = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  }).format(deliveryDate);

  // 4. Inject the data into the page
  document.querySelector('.js-delivery-date').innerHTML = `Arriving on ${dateString}`;
  document.querySelector('.js-product-name').innerHTML = matchingProduct.name;
  document.querySelector('.js-product-quantity').innerHTML = `Quantity: ${cartItem.quantity}`;
  document.querySelector('.js-product-image').src = matchingProduct.image;

  updateCartQuantity();
}

function updateCartQuantity() {
  let cartQuantity = 0;
  cart.forEach((item) => {
    cartQuantity += item.quantity;
  });
  const cartQuantityElement = document.querySelector('.js-cart-quantity');
  if (cartQuantityElement) {
    cartQuantityElement.innerHTML = cartQuantity;
  }
}

renderTrackingPage();