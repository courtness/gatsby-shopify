/* eslint-disable no-console */
/* eslint-disable import/prefer-default-export */

import { fancyWarning } from "~utils/helpers";
import { getPriceByCurrency } from "~utils/shopify";

export function pushProductEvent(
  product,
  currencyCode = `USD`,
  event,
  quantity = 1
) {
  if (
    typeof window === `undefined` ||
    !window ||
    !product?.variant?.sku ||
    !product?.variant?.title
  ) {
    return;
  }

  let location = `love-money-store`;

  if (process.env.GATSBY_SHOPIFY_STORE) {
    location = process.env.GATSBY_SHOPIFY_STORE;
  }

  const ecommerce = {
    currencyCode
  };

  const products = [
    {
      id: product.variant.sku,
      name: product.title,
      price: product.variant.price,
      quantity,
      variant: product.variant.title
    }
  ];

  switch (event) {
    case `addToCart`:
      ecommerce.add = {
        location,
        products
      };

      break;

    case `productView`:
      ecommerce.detail = {
        location,
        products
      };

      break;

    case `removeFromCart`:
      ecommerce.remove = {
        location,
        products
      };

      break;

    default:
      break;
  }

  const eventData = {
    event,
    ecommerce
  };

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(eventData);
}

export function fbqTrackCheckout(cart, products, currency) {
  if (
    process.env.NODE_ENV !== `production` ||
    typeof window === `undefined` ||
    !window?.fbq ||
    !cart?.[0]
  ) {
    fancyWarning(`fbq:warn | Required variable(s) undefined`);
    return;
  }

  const cartIds = [];
  let cartTotal = 0;

  cart.forEach(cartItem => {
    products.forEach(productItem => {
      productItem.variants.forEach(productItemVariant => {
        if (productItemVariant.id === cartItem.variantId) {
          cartIds.push(cartItem.variantId);
          cartTotal +=
            getPriceByCurrency(productItemVariant, currency) *
            cartItem.quantity;
        }
      });
    });
  });

  const fbqData = {
    content_name: `Checkout`,
    content_category: `snippets`,
    content_ids: cartIds,
    value: cartTotal,
    currency
  };

  window.fbq(`track`, `InitiateCheckout`, fbqData);
}

export function fbqTrackProduct(key, product, currency) {
  if (
    process.env.NODE_ENV !== `production` ||
    typeof window === `undefined` ||
    !window?.fbq ||
    !product?.variant
  ) {
    fancyWarning(`fbq:warn | Required variable(s) undefined`);
    return;
  }

  const fbqData = {
    content_name: product.frontmatter.title,
    content_category: product.frontmatter.collection,
    content_ids: [product.variant.id],
    content_type: `product`,
    value: product.variant.price,
    currency
  };

  window.fbq(`track`, key, fbqData);
}
