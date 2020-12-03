/* eslint-disable camelcase */
import React, { createContext, useEffect, useState } from "react";
import getSymbolFromCurrency from "currency-symbol-map";
import PropTypes from "prop-types";
// import axios from "axios";
import { useCookies } from "react-cookie";
import { globalHistory } from "@reach/router";
// import { clearAllBodyScrollLocks, disableBodyScroll } from "body-scroll-lock";
import { pushProductEvent } from "~utils/analytics";
import { fancyError, fancyWarning } from "~utils/helpers";
import { useTimeout } from "~utils/hooks";
import {
  getCheckoutURL,
  getInventoryIdByVariantSku,
  getInventoryLevelsByIds
} from "~utils/shopify";

export const AppContext = createContext({});

const AppProvider = ({ children }) => {
  const [activeCurrency, setActiveCurrency] = useState(null);
  const [activeCurrencySymbol, setActiveCurrencySymbol] = useState(null);
  const [cart, setCart] = useState([]);
  const [cartActive, setCartActive] = useState(false);
  const [cookies, setCookie] = useCookies(null);
  const [cookiesAccepted, setCookiesAccepted] = useState(false);
  const [cookieMessageActive, setCookieMessageActive] = useState(false);
  const [headerStyle, setHeaderStyle] = useState(null);
  const [inventoryCache, setInventoryCache] = useState(null);
  const [inventoryFetched, setInventoryFetched] = useState(null);
  const [menuActive, setMenuActive] = useState(false);
  const [pathname, setPathname] = useState(null);
  const [rendered, setRendered] = useState(false);
  const [skuPreselect, setSkuPreselect] = useState(null);
  const [wishlistActive, setWishlistActive] = useState(false);
  const [wishlist, setWishlist] = useState([]);

  //

  /*
  const setDefaultCurrency = () => {
    let defaultCurrency;

    switch (process.env.GATSBY_REGION_CODE.toLowerCase()) {
      case `au`:
        defaultCurrency = `AUD`;
        break;

      case `eu`:
        defaultCurrency = `EUR`;
        break;

      case `us`:
      default:
        defaultCurrency = `USD`;
        break;
    }

    setActiveCurrency(defaultCurrency);
    setActiveCurrencySymbol(getSymbolFromCurrency(defaultCurrency));
  };
  */

  //

  useTimeout(() => {
    setRendered(true);
  }, 1500);

  useEffect(() => {
    if (window) {
      setPathname(window.location.pathname);
    }

    //
    // location lookup

    /*
    axios
      .get(`https://ipapi.co/json/`)
      .then(response => {
        const { data } = response;

        const continent = data.continent_code.toLowerCase();

        switch (process.env.GATSBY_REGION_CODE) {
          case `au`:
            if (
              continent !== `an` &&
              continent !== `as` &&
              continent !== `oc` &&
              !cookies?.located
            ) {
              setGeolocatorActive(true);
            }

            break;

          case `eu`:
            if (continent !== `af` && continent !== `eu` && !cookies?.located) {
              setGeolocatorActive(true);
            }

            break;

          case `us`:
            if (continent !== `na` && continent !== `sa` && !cookies?.located) {
              setGeolocatorActive(true);
            }

            break;

          default:
            break;
        }

        const currentCookieCurrency =
          cookies?.[`${process.env.GATSBY_REGION_CODE}_currency`];

        if (
          currentCookieCurrency &&
          ![`null`, `undefined`, ``].includes(
            currentCookieCurrency.toLowerCase()
          )
        ) {
          // if there's a currency cookie, check whether its allowed to be set, as it might be outdated
          if (availableCurrencies.includes(currentCookieCurrency)) {
            setActiveCurrency(currentCookieCurrency);
          } else {
            // if not, clear that cookie and set default
            removeCookie(`${process.env.GATSBY_REGION_CODE}_currency`);
            setDefaultCurrency();
          }
        } else if (process.env.GATSBY_CURRENCIES) {
          if (
            Array.isArray(availableCurrencies) &&
            availableCurrencies?.[0] &&
            availableCurrencies.includes(data.currency) &&
            data.currency
          ) {
            setActiveCurrency(data.currency);
          } else {
            setDefaultCurrency();
          }
        } else {
          setDefaultCurrency();
        }
      })
      .catch(error => {
        fancyWarning(error.message);

        if (!cookies?.located) {
          setTimeout(() => {
            setGeolocatorActive(true);
          }, 1000);
        }

        setDefaultCurrency();
      });
      */

    //
    // [cookie] cart

    if (!cookies?.accepted) {
      setCookieMessageActive(true);
    } else {
      setCookiesAccepted(true);

      if (cookies?.[`${process.env.GATSBY_REGION_CODE}_cart`]) {
        const parsedCart = cookies[`${process.env.GATSBY_REGION_CODE}_cart`];

        let valid =
          Array.isArray(cookies[`${process.env.GATSBY_REGION_CODE}_cart`]) &&
          cookies?.[`${process.env.GATSBY_REGION_CODE}_cart`]?.[0];

        if (valid) {
          parsedCart.forEach(cookieCartItem => {
            if (!valid) {
              return;
            }

            if (
              typeof cookieCartItem === `undefined` ||
              cookieCartItem === null ||
              cookieCartItem === false ||
              cookieCartItem === `` ||
              !cookieCartItem?.variantId ||
              !cookieCartItem?.quantity
            ) {
              valid = false;
            }
          });
        }

        if (!valid || process.env.GATSBY_RESET_COOKIES) {
          fancyWarning(`Resetting cart data`);
          setCookie([`${process.env.GATSBY_REGION_CODE}_cart`], [], {
            path: `/`
          });
          setCart([]);
        } else {
          setCart(parsedCart);
        }
      }

      if (cookies?.currency) {
        setActiveCurrency(cookies.currency);
      }
    }

    // [cookie] wishlist

    if (cookies?.[`${process.env.GATSBY_REGION_CODE}_wishlist`]) {
      const parsedWishlist =
        cookies[`${process.env.GATSBY_REGION_CODE}_wishlist`];

      let valid = Array.isArray(parsedWishlist);

      parsedWishlist.forEach(wishlistItem => {
        if (!valid) {
          return;
        }

        if (
          typeof wishlistItem === `undefined` ||
          wishlistItem === null ||
          wishlistItem === false ||
          wishlistItem === `` ||
          !wishlistItem?.variantId
        ) {
          valid = false;
        }
      });

      if (!valid || process.env.GATSBY_RESET_COOKIES) {
        fancyWarning(`Resetting wishlist data`);
        setCookie([`${process.env.GATSBY_REGION_CODE}_wishlist`], [], {
          path: `/`
        });
        setWishlist([]);
      } else {
        setWishlist(parsedWishlist);
      }
    }

    return globalHistory.listen(({ location }) => {
      setPathname(location.pathname);
    });
  }, []);

  // [cookie] acceptance

  useEffect(() => {
    if (cookiesAccepted) {
      setCookie(`accepted`, true, { path: `/` });
    }
  }, [cookiesAccepted]);

  // [cookie] currency

  useEffect(() => {
    if (cookiesAccepted) {
      setCookie(`${process.env.GATSBY_REGION_CODE}_currency`, activeCurrency, {
        path: `/`
      });
    }

    setActiveCurrencySymbol(getSymbolFromCurrency(activeCurrency));
  }, [activeCurrency, cookiesAccepted]);

  //

  const addToCart = (productWithVariant, quantity = 1) => {
    if (!productWithVariant?.variant) {
      return;
    }

    let existingCartPosition = null;

    const cartClone = JSON.parse(JSON.stringify(cart));

    cartClone.forEach((cartItem, cartIndex) => {
      if (existingCartPosition !== null) {
        return;
      }

      if (cartItem.variantId === productWithVariant.variant.id) {
        existingCartPosition = cartIndex;
      }
    });

    if (existingCartPosition === null) {
      cartClone.push({
        quantity,
        variantId: productWithVariant.variant.id
      });
    } else {
      cartClone[existingCartPosition].quantity += quantity;
    }

    setCartActive(true);
    setCart(cartClone);

    if (cookiesAccepted) {
      setCookie(`${process.env.GATSBY_REGION_CODE}_cart`, cartClone, {
        path: `/`
      });

      pushProductEvent(
        productWithVariant,
        activeCurrency,
        `addToCart`,
        quantity
      );
    }
  };

  const checkout = () => {
    if (
      !process.env.GATSBY_SHOPIFY_STORE ||
      process.env.GATSBY_SHOPIFY_STORE === ``
    ) {
      fancyError(`Shopify environment variables have not been defined.`);

      return;
    }

    setCartActive(false);

    getCheckoutURL(cart, activeCurrency).then(response => {
      response.json().then(({ data }) => {
        if (data?.checkoutCreate?.checkout?.webUrl) {
          const { webUrl } = data.checkoutCreate.checkout;

          // prod check-in routing goes here

          window.location.href = webUrl;
        }
      });
    });
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

    if (cookiesAccepted) {
      setCookie([`${process.env.GATSBY_REGION_CODE}_cart`], cartClone, {
        path: `/`
      });

      pushProductEvent(cartClone[cartIndex], activeCurrency, `removeFromCart`);
    }
  };

  const increaseQuantityByCartIndex = cartIndex => {
    if (!cart?.[cartIndex]) {
      return;
    }

    const cartClone = JSON.parse(JSON.stringify(cart));

    cartClone[cartIndex].quantity += 1;

    setCart(cartClone);

    if (cookiesAccepted) {
      setCookie([`${process.env.GATSBY_REGION_CODE}_cart`], cartClone, {
        path: `/`
      });

      pushProductEvent(cartClone[cartIndex], activeCurrency, `addToCart`);
    }
  };

  const removeFromCartByIndex = cartIndex => {
    if (!cart?.[cartIndex]) {
      return;
    }

    const cartClone = JSON.parse(JSON.stringify(cart));

    cartClone.splice(cartIndex, 1);

    setCart(cartClone);

    if (cookiesAccepted) {
      setCookie([`${process.env.GATSBY_REGION_CODE}_cart`], cartClone, {
        path: `/`
      });

      pushProductEvent(
        cart[cartIndex],
        activeCurrency,
        `removeFromCart`,
        cart[cartIndex].quantity
      );
    }
  };

  const refreshInventoryCache = (products, adminProducts) => {
    if (
      typeof window === `undefined` ||
      typeof fetch === `undefined` ||
      window.location.href.includes(`localhost`)
    ) {
      setInventoryCache({});
      return;
    }

    const variantsByInventoryId = {};

    products.forEach(product => {
      product.variants.forEach(variant => {
        const inventoryId = getInventoryIdByVariantSku(
          adminProducts.edges,
          variant.sku
        );

        if (inventoryId && inventoryId !== ``) {
          variantsByInventoryId[inventoryId] = variant;
        }
      });
    });

    getInventoryLevelsByIds(Object.keys(variantsByInventoryId).join()).then(
      response => {
        response.json().then(inventory => {
          const newInventoryCache = {};

          if (!inventory?.inventory_levels?.[0]) {
            setInventoryCache(newInventoryCache);
            return;
          }

          inventory.inventory_levels.forEach(inventoryLevel => {
            const variant =
              variantsByInventoryId[inventoryLevel.inventory_item_id];

            if (typeof inventoryLevel.available === `undefined`) {
              newInventoryCache[variant.id] = 0;

              return;
            }

            newInventoryCache[variant.id] = inventoryLevel.available;
          });

          setInventoryCache(newInventoryCache);
        });
      }
    );
  };

  useEffect(() => {
    if (inventoryCache) {
      setInventoryFetched(true);
    }
  }, [inventoryCache]);

  return (
    <AppContext.Provider
      value={{
        cart,
        setCart,
        cartActive,
        setCartActive,
        activeCurrencySymbol,
        setActiveCurrencySymbol,
        activeCurrency,
        setActiveCurrency,
        cookiesAccepted,
        setCookiesAccepted,
        cookieMessageActive,
        setCookieMessageActive,
        headerStyle,
        setHeaderStyle,
        inventoryCache,
        setInventoryCache,
        refreshInventoryCache,
        inventoryFetched,
        setInventoryFetched,
        menuActive,
        setMenuActive,
        pathname,
        rendered,
        setRendered,
        skuPreselect,
        setSkuPreselect,
        wishlist,
        setWishlist,
        wishlistActive,
        setWishlistActive,
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
