/* eslint-disable import/prefer-default-export */

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
