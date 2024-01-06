import { cart, removeFromCart, calculateCartQuantity, updateQuantity, updateCartDeliveryOption } from "../../data/cart.js";
import { getProduct } from "../../data/products.js";
import { formatCurrency } from "../utils/money.js";
import { calculateDeliveryOption, deliveryOptions, getDeliveryOption } from "../../data/deliveryOptions.js";
import { renderPaymentSummary } from "./paymentSummary.js";
import { renderCheckoutHeader } from "./checkoutHeader.js";

const orderSummaryHtml = document.querySelector('.js-order-summary');

export function renderOrderSummary() {
  let cartSummaryHTML = '';

  cart.forEach((cartItem) => {
    const { productId, quantity, deliveryOptionId } = cartItem;

    const matchingProduct = getProduct(productId);

    const { image, name, priceCents, id } = matchingProduct;

    const deliveryOption = getDeliveryOption(deliveryOptionId);
    
    const cartHtml = `
      <div class="cart-item-container js-cart-item-container-${id}">
        <div class="delivery-date">
          Delivery date: ${calculateDeliveryOption(deliveryOption)}
        </div>

        <div class="cart-item-details-grid">
          <img class="product-image"
            src="${image}">

          <div class="cart-item-details">
            <div class="product-name">
              ${name}
            </div>
            <div class="product-price">
              $${formatCurrency(priceCents)}
            </div>
            <div class="product-quantity">
              <span>
                Quantity: <span class="quantity-label js-quantity-label-${id}">${quantity}</span>
              </span>
              <span class="update-quantity-link link-primary js-update-link" data-product-id="${id}">
                Update
              </span>
              <input class="quantity-input js-quantity-input-${id}">
              <span class="save-quantity-link link-primary js-save-link" data-product-id="${id}">
                Save
              </span>
              <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${id}">
                Delete
              </span>
            </div>
          </div>

          <div class="delivery-options">
            <div class="delivery-options-title">
              Choose a delivery option:
            </div>
            ${deliveryOptionsHTML(matchingProduct, cartItem)}
          </div>
        </div>
      </div>
    `;

    cartSummaryHTML += cartHtml;
  })

  orderSummaryHtml.innerHTML = cartSummaryHTML;

  function deliveryOptionsHTML(matchingProduct, cartItem) {
    let deliveryOptionHtml = '';

    deliveryOptions.forEach((deliveryOption) => {
      const { priceCents, id } = deliveryOption;

      const priceString = priceCents === 0 ? 'FREE' : `$${formatCurrency(priceCents)} -`;

      const isChecked = id === cartItem.deliveryOptionId;

      const optionHtml = `
      <div class="delivery-option js-delivery-option" data-product-id="${matchingProduct.id}" data-delivery-option-id="${id}"> 
        <input type="radio"
          ${isChecked ? 'checked' : ''}
          class="delivery-option-input"
          name="delivery-option-${matchingProduct.id}">
        <div>
          <div class="delivery-option-date">
            ${calculateDeliveryOption(deliveryOption)}
          </div>
          <div class="delivery-option-price">
            ${priceString} Shipping
          </div>
        </div>
      </div>
      `

      deliveryOptionHtml += optionHtml;
    })

    return deliveryOptionHtml;
  }

  document.querySelectorAll('.js-delete-link')
    .forEach((deleteLink) => {
      deleteLink.addEventListener('click', () => {
        const productId = deleteLink.dataset.productId;
        removeFromCart(productId);

        renderCheckoutHeader();
        renderOrderSummary();
        renderPaymentSummary();
      })
    });

  document.querySelectorAll('.js-update-link')
    .forEach((updateLink) => {
      updateLink.addEventListener('click', () => {
        const { productId } = updateLink.dataset;
        
        const container = document.querySelector(`.js-cart-item-container-${productId}`);
        container.classList.add('is-editing-quantity');
      })
    });
  
  document.querySelectorAll('.js-save-link') 
    .forEach((saveLink) => {
      saveLink.addEventListener('click', () => {
        const { productId } = saveLink.dataset;

        const inputQuantity  = document.querySelector(`.js-quantity-input-${productId}`);
        const newQuantity = Number(inputQuantity.value);

        if (newQuantity < 0 || newQuantity >= 1000) {
          alert('Quantity cannot be less than 0 0r greater than 1000');
          return;
        }

        updateQuantity(productId, newQuantity);

        inputQuantity.value = '';

        const container = document.querySelector(`.js-cart-item-container-${productId}`);
        container.classList.remove('is-editing-quantity');

        const labelQuantity = document.querySelector(`.js-quantity-label-${productId}`);
        labelQuantity.innerHTML = newQuantity;

        renderCheckoutHeader();
        renderPaymentSummary();
      })
    });

  document.querySelectorAll('.js-delivery-option')
  .forEach((element) => {
      element.addEventListener('click', () => {
        const { productId, deliveryOptionId } = element.dataset;

        updateCartDeliveryOption(productId, deliveryOptionId);

        renderOrderSummary();
        renderPaymentSummary();
      })
    });
};