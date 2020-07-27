/* eslint-disable react/prop-types */

import React, { useContext } from "react";
import { Link } from "gatsby";
import { AppContext } from "~context/AppContext";
import CartIcon from "~components/svg/CartIcon";

const Header = () => {
  const { cartActive, setCartActive, menuActive, setMenuActive } = useContext(
    AppContext
  );

  const toggleCart = () => {
    setCartActive(!cartActive);
  };

  const toggleMenu = () => {
    setMenuActive(!menuActive);
  };

  return (
    <header
      className={`header ${cartActive ? ` cart-active` : ``} ${
        menuActive ? ` menu-active` : ``
      } transition-transform w-full fixed top-0 right-0 left-0 z-30 py-2`}
    >
      <nav className="grid">
        <div className="grid-end-12 flex items-center justify-between">
          <button
            type="button"
            className="header__menu w-5 h-3 relative flex flex-col items-center justify-between"
            onClick={toggleMenu}
          >
            <div className="header__menu__line transition-opacity-transform w-full border-b-2 border-black"></div>
            <div className="header__menu__line transition-opacity-transform w-full border-b-2 border-black"></div>
            <div className="header__menu__line transition-opacity-transform w-full border-b-2 border-black"></div>
          </button>

          <Link to="/" className="block text-black">
            <h2 className="b1">Shop Name</h2>
          </Link>

          <button type="button" onClick={toggleCart}>
            <CartIcon className="w-4" color="black" />
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Header;
