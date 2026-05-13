import {deliveryOptions} from "./deliveryOptions.js";

export let cart = JSON.parse(localStorage.getItem('cart'))

if (!cart) {
  cart = [];
}


function saveInStorage() {
  localStorage.setItem('cart', JSON.stringify(cart));
}


export function addToCart(productId) {
  let matchingItem;

  cart.forEach((cartItem) => {
    if(cartItem.productId === productId) {
      matchingItem = cartItem;
    }
  })

  if(matchingItem) {
    matchingItem.quantity ++;
  }

  else {
    cart.push({
    productId: productId,
    quantity: 1,
    deliveryOptionId: '1'
  })}

  saveInStorage();
}


export function removeFromCart(productId) {

  let newCart = [];

  cart.forEach((cartItem) => {

    if(cartItem.productId !== productId) {
      newCart.push(cartItem);
    }

  })

  cart = newCart;
  saveInStorage();
}

export function totalCartQuantity () {
  let cartQuantity = 0;

  cart.forEach(cartItem => {
    cartQuantity += cartItem.quantity;
  })

  return cartQuantity;

}


export function updateDeliveryOption (productId, deliveryOptionId) {

  let matchingItem;

  cart.forEach((cartItem) => {
    if(productId === cartItem.productId) {
      matchingItem = cartItem;
    }
  })

  matchingItem.deliveryOptionId = deliveryOptionId;

  saveInStorage();
}