/* eslint-disable react/prop-types */

import React, { useContext, useEffect } from "react";
import { graphql, Link, StaticQuery } from "gatsby";
import { select } from "underscore";
import { AppContext } from "~context/AppContext";
import { DocumentContext } from "~context/DocumentContext";
import Button from "~components/Button";
import Cross from "~components/svg/Cross";
import { getPriceByCurrency, parseProducts } from "~utils/shopify";
import { useKeyPress } from "~utils/hooks";

const query = graphql`
  query Nav {
    allMarkdownRemark(
      filter: { frontmatter: { templateKey: { eq: "product-page" } } }
    ) {
      edges {
        node {
          fields {
            slug
          }
          frontmatter {
            title
            shopifyHandle
            collection
            priority
          }
        }
      }
    }
    allShopifyProduct {
      edges {
        node {
          id
          title
          description
          handle
          images {
            originalSrc
          }
          productType
          vendor
          variants {
            id
            title
            image {
              originalSrc
            }
            price
            presentmentPrices {
              edges {
                node {
                  price {
                    amount
                    currencyCode
                  }
                }
              }
            }
            selectedOptions {
              name
              value
            }
          }
        }
      }
    }
    allShopifyAdminProduct {
      edges {
        node {
          products {
            handle
            variants {
              alternative_id
              title
            }
          }
        }
      }
    }
  }
`;

const Nav = () => {
  const {
    activeCurrency,
    activeCurrencySymbol,
    cart,
    cartActive,
    setCartActive,
    menuActive,
    setMenuActive,
    wishlist,
    //
    checkout,
    decreaseQuantityByCartIndex,
    increaseQuantityByCartIndex,
    removeFromCartByIndex
  } = useContext(AppContext);
  const { scrollTop } = useContext(DocumentContext);

  //

  const close = () => {
    setCartActive(false);
    setMenuActive(false);
  };

  //

  const escKeyPressed = useKeyPress(`Escape`);

  useEffect(() => {
    close();
  }, [escKeyPressed]);

  useEffect(() => {
    close();
  }, [scrollTop]);

  //

  return (
    <StaticQuery
      query={query}
      render={data => {
        const products = parseProducts(data);
        const navCart = [];
        const navWishlist = [];

        let cartTotal = 0;

        cart.forEach(cartItem => {
          products.forEach(productItem => {
            productItem.variants.forEach(productItemVariant => {
              if (productItemVariant.id === cartItem.variantId) {
                const lineItemCost =
                  getPriceByCurrency(productItemVariant, activeCurrency) *
                  cartItem.quantity;

                cartTotal += lineItemCost;

                navCart.push({
                  id: cartItem.variantId,
                  image: cartItem.image || productItemVariant.image.originalSrc,
                  quantity: cartItem.quantity,
                  //
                  price: `${activeCurrencySymbol}${parseFloat(
                    lineItemCost
                  ).toFixed(2)}`,
                  slug: productItem.slug,
                  selectedOptions: productItemVariant.selectedOptions,
                  title: productItem.title,
                  variantTitle: productItemVariant.title
                });
              }
            });
          });
        });

        wishlist.forEach(wishlistItem => {
          products.forEach(productItem => {
            productItem.variants.forEach(productItemVariant => {
              if (productItemVariant.id === wishlistItem.id) {
                const addableProduct = productItem;

                addableProduct.variant = productItemVariant;

                navWishlist.push({
                  addableProduct,
                  id: wishlistItem.id,
                  image: wishlistItem.image,
                  //
                  price: productItemVariant.price,
                  slug: productItem.slug,
                  title: productItem.title,
                  variantTitle: productItemVariant.title
                });
              }
            });
          });
        });

        return (
          <div
            className={`nav ${cartActive ? `cart-active` : ``} ${
              menuActive ? `menu-active` : ``
            } w-screen h-screen fixed flex items-center justify-between z-40 pointer-events-none`}
          >
            <div
              role="presentation"
              className={`nav__background ${
                cartActive || menuActive
                  ? `opacity-50 pointer-events-auto`
                  : `opacity-0`
              } transition-opacity w-screen h-screen fixed top-0 right-0 bottom-0 left-0 z-10 bg-black`}
              onClick={close}
            ></div>

            <div
              className={`nav__menu ${
                menuActive ? `pointer-events-auto` : ``
              } transition-transform h-full absolute top-0 left-0 pt-16 px-8 z-20 bg-black text-white`}
            >
              <button
                className="w-12 h-12 absolute top-0 left-0 flex items-center justify-center ml-2"
                onClick={close}
                type="button"
              >
                <Cross className="w-5 h-5" color="white" />
              </button>

              {menuActive && (
                <ul>
                  <li className="animation-appear-right animation-delay-3 hover-underline f3">
                    <Link to="/" className="block py-2" onClick={close}>
                      Home
                    </Link>
                  </li>

                  <li className="animation-appear-right animation-delay-3 hover-underline f3">
                    <Link to="/products" className="block py-2" onClick={close}>
                      Products
                    </Link>
                  </li>

                  <li className="animation-appear-right animation-delay-3 hover-underline f3">
                    <Link to="/about" className="block py-2" onClick={close}>
                      About
                    </Link>
                  </li>

                  <li className="animation-appear-right animation-delay-3 hover-underline f3">
                    <Link to="/blog" className="block py-2" onClick={close}>
                      Blog
                    </Link>
                  </li>

                  <li className="animation-appear-right animation-delay-3 hover-underline f3">
                    <Link to="/contact" className="block py-2" onClick={close}>
                      Contact
                    </Link>
                  </li>

                  <li className="animation-appear-right animation-delay-3 hover-underline f3">
                    <Link to="/shipping" className="block py-2" onClick={close}>
                      Shipping
                    </Link>
                  </li>

                  <li className="animation-appear-right animation-delay-3 hover-underline f3">
                    <Link to="/privacy" className="block py-2" onClick={close}>
                      Privacy
                    </Link>
                  </li>

                  <li className="animation-appear-right animation-delay-3 hover-underline f3">
                    <Link to="/terms" className="block py-2" onClick={close}>
                      Terms
                    </Link>
                  </li>
                </ul>
              )}
            </div>

            <div
              className={`nav__cart  ${
                cartActive ? `pointer-events-auto` : ``
              } transition-transform h-full absolute top-0 right-0 pt-16 px-8 z-20 bg-black text-white`}
            >
              <button
                className="w-12 h-12 absolute top-0 right-0 flex items-center justify-center mr-2"
                onClick={close}
                type="button"
              >
                <Cross className="w-5 h-5" color="white" />
              </button>

              {(cartActive && navCart?.[0] && (
                <>
                  <ul className="nav__cart__list relative overflow-y-scroll">
                    {navCart.map((cartItem, cartItemIndex) => {
                      return (
                        <li key={cartItem.id} className="relative flex mb-8">
                          <button
                            type="button"
                            className="w-6 h-6 absolute top-0 right-0 z-10 -mr-1"
                            onClick={() => removeFromCartByIndex(cartItemIndex)}
                          >
                            <Cross className="w-full h-full" color="white" />
                          </button>

                          <div className="w-1/3 relative block">
                            <figure className="square border-white">
                              <img
                                className="w-full absolute transform-center"
                                src={cartItem.image}
                                alt={cartItem.title}
                              />
                            </figure>
                          </div>

                          <div className="w-2/3 relative px-4">
                            <h2 className="f5">{cartItem.title}</h2>

                            <h2 className="mt-2 b2">
                              {cartItem.selectedOptions.map(selectedOption => {
                                return (
                                  <span key={selectedOption.name}>
                                    {selectedOption.value}
                                  </span>
                                );
                              })}
                            </h2>

                            <h3 className="mt-2 f5">{cartItem.price}</h3>

                            <div className="w-full relative flex justify-between mt-4">
                              <h4 className="b1">Quantity: </h4>

                              <div className="flex">
                                <button
                                  type="button"
                                  className="px-4 b1"
                                  onClick={() =>
                                    decreaseQuantityByCartIndex(cartItemIndex)
                                  }
                                >
                                  -
                                </button>

                                <h4 className="b1">{cartItem.quantity}</h4>

                                <button
                                  type="button"
                                  className="px-4 b1"
                                  onClick={() =>
                                    increaseQuantityByCartIndex(cartItemIndex)
                                  }
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>

                  <div className="w-full absolute right-0 bottom-0 left-0 z-10 px-8 pb-8">
                    <h3 className="mb-4 f5">
                      Total: ${parseFloat(cartTotal).toFixed(2)}
                    </h3>

                    <Button
                      className="w-full"
                      color="white"
                      onClick={checkout}
                      text="Checkout"
                    />
                  </div>
                </>
              )) || (
                <h3 className="f5 text-center text-white">
                  Your cart is empty
                </h3>
              )}
            </div>
          </div>
        );
      }}
    />
  );
};

export default Nav;
