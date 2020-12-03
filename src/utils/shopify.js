/* eslint-disable import/prefer-default-export */
// import React from "react";

import { fancyWarning, shuffleArray } from "~utils/helpers";

//------------------------------------------------------------------------------
//
// graphql

export async function getCheckoutURL(cart, currencyCode) {
  let url = `${process.env.GATSBY_NETLIFY_FUNCTIONS}/shopify-storefront-graphql`;

  let lineItemsString = `[`;

  cart.forEach((cartItem, cartItemIndex) => {
    let prefix = ``;

    if (cartItemIndex !== 0) {
      prefix = `, `;
    }

    lineItemsString += `${prefix}{variantId: "${cartItem.variantId.replace(
      `Shopify__ProductVariant__`,
      ``
    )}", quantity: ${cartItem.quantity}}`;
  });

  lineItemsString += `]`;

  const query = `
    mutation {
      checkoutCreate(
        input: {
          lineItems: ${lineItemsString},
          presentmentCurrencyCode: ${currencyCode}
        }
      ) {
        checkout {
          id
          webUrl
        }
      }
    }
  `;

  const response = await fetch(url, {
    body: JSON.stringify(query),
    headers: new Headers({
      "Content-Type": `application/json`
    }),
    method: `POST`
  });

  return response;
}

//------------------------------------------------------------------------------
//
// inventory

export function getInventoryIdByVariantSku(adminProducts, variantSku) {
  let id;

  adminProducts.forEach(({ node }) => {
    if (id || !node?.products?.[0]) {
      return;
    }

    node.products.forEach(product => {
      if (id || !product?.variants?.[0]) {
        return;
      }

      product.variants.forEach(variant => {
        if (id) {
          return;
        }

        if (variant.sku === variantSku) {
          id = variant.inventory_item_id;
        }
      });
    });
  });

  return id;
}

export async function getInventoryLevelsByIds(ids) {
  let url = `${process.env.GATSBY_NETLIFY_FUNCTIONS}/get-shopify-inventory`;

  if (
    process.env.GATSBY_REGION_CODE &&
    process.env.GATSBY_REGION_CODE !== `` &&
    process.env.GATSBY_REGION_CODE.toLowerCase() !== `us`
  ) {
    url = `${
      process.env.GATSBY_NETLIFY_FUNCTIONS
    }/get-shopify-inventory-${process.env.GATSBY_REGION_CODE.toLowerCase()}`;
  }

  const response = await fetch(url, {
    body: JSON.stringify({
      ids
    }),
    headers: new Headers({
      "Content-Type": `application/json`
    }),
    method: `POST`
  });

  return response;
}

//------------------------------------------------------------------------------
//
// price

export function getPriceByCurrency(variant, currencyCode) {
  let price;

  if (!variant?.presentmentPrices?.edges?.[0]) {
    fancyWarning(`Presentment prices not found`);

    ({ price } = variant);
  } else {
    variant.presentmentPrices.edges.forEach(({ node }) => {
      if (price) {
        return;
      }

      if (node.price.currencyCode === currencyCode) {
        price = node.price.amount;
      }
    });
  }

  if (currencyCode === `JPY`) {
    return parseInt(price);
  }

  return parseFloat(price).toFixed(2);
}

//------------------------------------------------------------------------------
//
// products

export function parseProducts(data) {
  if (!data || !data.allShopifyProduct || !data.allShopifyProduct.edges) {
    return null;
  }

  const products = [];

  data.allShopifyProduct.edges.forEach(({ node }) => {
    data.allMarkdownRemark.edges.forEach(edge => {
      const { fields, frontmatter } = edge.node;

      if (frontmatter.shopifyHandle === node.handle) {
        node.frontmatter = frontmatter;
        node.slug = fields.slug;
      }
    });

    if (node.frontmatter) {
      products.push(node);
    }
  });

  if (products && products.length > 0) {
    products.sort((a, b) => {
      const priorityA = a.frontmatter.priority;
      const priorityB = b.frontmatter.priority;

      if (priorityA < priorityB) {
        return -1;
      }

      if (priorityA > priorityB) {
        return 1;
      }

      return 0;
    });
  }

  return products;
}

export function getProductByHandle(handle, products) {
  if (!products || products.length === 0) {
    return null;
  }

  let matchedProduct;

  products.forEach(product => {
    if (matchedProduct) {
      return;
    }

    if (product.handle === handle) {
      matchedProduct = product;
    }
  });

  if (matchedProduct && matchedProduct.variants.length > 1) {
    const selectedOptions = {};

    matchedProduct.variants.forEach(variant => {
      variant.selectedOptions.forEach(option => {
        if (!selectedOptions[option.name]) {
          selectedOptions[option.name] = [];
        }

        if (!selectedOptions[option.name].includes(option.value)) {
          selectedOptions[option.name].push(option.value);
        }
      });
    });

    matchedProduct.all_options = selectedOptions;
  }

  return matchedProduct;
}

export function getSelectableOptions(product) {
  const selectableOptions = {};

  product.variants.forEach(variant => {
    variant.selectedOptions.forEach(selectedOption => {
      if (!selectableOptions[selectedOption.name]) {
        selectableOptions[selectedOption.name] = [];
      }

      if (
        !selectableOptions[selectedOption.name].includes(selectedOption.value)
      ) {
        selectableOptions[selectedOption.name].push(selectedOption.value);
      }
    });
  });

  Object.keys(selectableOptions).forEach(selectableOptionKey => {
    if (selectableOptions[selectableOptionKey].length <= 1) {
      delete selectableOptions[selectableOptionKey];
    }
  });

  return selectableOptions;
}
