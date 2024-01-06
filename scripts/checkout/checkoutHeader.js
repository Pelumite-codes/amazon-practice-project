import { calculateCartQuantity } from "../../data/cart.js";

const checkoutHeader = document.querySelector('.js-checkout-header');

export function renderCheckoutHeader() {
  const checkoutHtml = `
    <div class="header-content">
      <div class="checkout-header-left-section">
        <a href="index.html">
          <img class="amazon-logo" src="images/amazon-logo.png">
          <img class="amazon-mobile-logo" src="images/amazon-mobile-logo.png">
        </a>
      </div>

      <div class="checkout-header-middle-section">
        Checkout (<a class="return-to-home-link js-home-link"
          href="amazon.html">${calculateCartQuantity()} Items</a>)
      </div>

      <div class="checkout-header-right-section">
        <img src="images/icons/checkout-lock-icon.png">
      </div>
    </div>
  `;

  checkoutHeader.innerHTML = checkoutHtml;
};