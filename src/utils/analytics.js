/* eslint-disable import/prefer-default-export */

export function pushProductEvent(product, event, quantity = 1) {
  if (
    typeof window === `undefined` ||
    !window ||
    !product?.variant?.sku ||
    !product?.variant?.title
  ) {
    return;
  }

  const products = [
    {
      id: product.variant.sku,
      name: product.title,
      price: product.variant.price,
      quantity,
      variant: product.variant.title
    }
  ];

  const ecommerce = {
    currencyCode: `AUD`
  };

  switch (event) {
    case `addToCart`:
      ecommerce.add = {
        products
      };

      break;

    case `productView`:
      ecommerce.detail = {
        products
      };

      break;

    case `removeFromCart`:
      ecommerce.remove = {
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

  // console.log(`Sending eventData: `, eventData);

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(eventData);
}
