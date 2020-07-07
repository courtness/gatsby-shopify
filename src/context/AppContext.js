import React, { createContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { globalHistory } from "@reach/router";
import { fancyError } from "~utils/helpers";

export const AppContext = createContext({});

const AppProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [cartActive, setCartActive] = useState(false);
  const [headerStyle, setHeaderStyle] = useState(null);
  const [menuActive, setMenuActive] = useState(false);
  const [pathname, setPathname] = useState(null);

  useEffect(() => {
    if (window) {
      setPathname(window.location.pathname);
    }

    return globalHistory.listen(({ location }) => {
      setPathname(location.pathname);
    });
  }, []);

  const addToCart = (productWithVariant, quantity = 1) => {
    if (!productWithVariant?.variant) {
      return;
    }

    delete productWithVariant.all_options;
    delete productWithVariant.description;
    delete productWithVariant.images;
    delete productWithVariant.variants;

    let existingCartPosition = null;

    cart.forEach((cartItem, cartIndex) => {
      if (existingCartPosition !== null) {
        return;
      }

      if (cartItem.variant.id === productWithVariant.variant.id) {
        existingCartPosition = cartIndex;
      }
    });

    if (existingCartPosition === null) {
      productWithVariant.quantity = quantity;

      cart.push(productWithVariant);
    } else {
      cart[existingCartPosition].quantity += quantity;
    }

    setCartActive(true);
    setCart(cart);
  };

  const checkout = () => {
    if (
      !process.env.GATSBY_SHOPIFY_STORE ||
      process.env.GATSBY_SHOPIFY_STORE === ``
    ) {
      fancyError(`Shopify environment variables have not been defined.`);

      return;
    }

    let cartString = ``;

    cart.forEach(cartItem => {
      let prefix = `,`;

      if (cartString === ``) {
        prefix = `/`;
      }

      cartString = `${cartString}${prefix}${cartItem.checkoutId}:${cartItem.quantity}`;
    });

    const checkoutUrl = `https://${process.env.GATSBY_SHOPIFY_STORE}.myshopify.com/cart${cartString}`;

    const win = window.open(checkoutUrl, `_blank`);

    win.focus();
  };

  const decreaseQuantityByCartIndex = cartIndex => {
    if (!cart?.[cartIndex]) {
      return;
    }

    const cartClone = JSON.parse(JSON.stringify(cart));

    if (cartClone[cartIndex].quantity <= 1) {
      cartClone.splice(cartIndex, 1);
    } else {
      cartClone[cartIndex].quantity -= 1;
    }

    setCart(cartClone);
  };

  const increaseQuantityByCartIndex = cartIndex => {
    if (!cart?.[cartIndex]) {
      return;
    }

    const cartClone = JSON.parse(JSON.stringify(cart));

    cartClone[cartIndex].quantity += 1;

    setCart(cartClone);
  };

  const removeFromCartByIndex = cartIndex => {
    if (!cart?.[cartIndex]) {
      return;
    }

    const cartClone = JSON.parse(JSON.stringify(cart));

    cartClone.splice(cartIndex, 1);

    setCart(cartClone);
  };

  return (
    <AppContext.Provider
      value={{
        cart,
        setCart,
        cartActive,
        setCartActive,
        headerStyle,
        setHeaderStyle,
        menuActive,
        setMenuActive,
        pathname,
        //
        addToCart,
        checkout,
        decreaseQuantityByCartIndex,
        increaseQuantityByCartIndex,
        removeFromCartByIndex
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

AppProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export default AppProvider;
