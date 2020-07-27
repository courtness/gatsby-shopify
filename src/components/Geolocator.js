/* eslint-disable react/prop-types */
// import PropTypes from "prop-types";

import React, { useContext, useEffect } from "react";
import { AppContext } from "~context/AppContext";
import Cross from "~components/svg/Cross";
import { useKeyPress } from "~utils/hooks";

import flagAUColor from "~assets/images/geolocator/flag-au.svg";
import flagEUColor from "~assets/images/geolocator/flag-eu.svg";
import flagUSAColor from "~assets/images/geolocator/flag-usa.svg";

const Geolocator = () => {
  const { geolocatorActive, setGeolocatorActive } = useContext(AppContext);

  const escKeyPressed = useKeyPress(`Escape`);

  const hide = () => {
    setGeolocatorActive(false);
  };

  //

  useEffect(() => {
    hide();
  }, [escKeyPressed]);

  //

  return (
    <>
      {geolocatorActive && (
        <div className="animation-fade-in animation-delay-3 geolocator w-full h-full fixed top-0 right-0 bottom-0 left-0 z-50 flex items-center justify-center">
          <div
            role="presentation"
            className="w-full h-full absolute top-0 right-0 bottom-0 left-0 bg-black opacity-50"
            onClick={hide}
          ></div>

          <div className="animation-appear-slow animation-delay-5 grid">
            <div className="geolocator__inner grid-end-6 xs:grid-end-12 grid-start-4 xs:grid-start-1 relative p-8 bg-black text-white">
              <button
                className="w-16 h-16 absolute top-0 right-0 p-4 flex items-center justify-center"
                type="button"
                onClick={hide}
              >
                <Cross className="w-full h-full" color="white"></Cross>
              </button>

              <h3 className="mb-8 f5">Select your location</h3>

              <ul className="w-full relative flex">
                <li className="geolocator__link relative block mr-2">
                  {(process.env.GATSBY_REGION_CODE === `eu` && (
                    <button
                      type="button"
                      className="w-full relative block text-left"
                      onClick={hide}
                    >
                      <img
                        className="transition-transform w-full relative block"
                        src={flagEUColor}
                        alt="Flag of EU"
                      />

                      <h4 className="geolocator__link__text mt-4 caption">
                        EU
                      </h4>
                    </button>
                  )) || (
                    <a href="https://SHOP_URL/">
                      <img
                        className="transition-transform w-full relative block"
                        src={flagEUColor}
                        alt="Flag of EU"
                      />

                      <h4 className="geolocator__link__text mt-4 caption">
                        EU
                      </h4>
                    </a>
                  )}
                </li>

                <li className="geolocator__link relative block mr-2">
                  {(process.env.GATSBY_REGION_CODE === `us` && (
                    <button
                      type="button"
                      className="w-full relative block text-left"
                      onClick={hide}
                    >
                      <img
                        className="transition-transform w-full relative block"
                        src={flagUSAColor}
                        alt="Flag of USA"
                      />

                      <h4 className="geolocator__link__text mt-4 caption">
                        US
                      </h4>
                    </button>
                  )) || (
                    <a href="https://SHOP_URL/us">
                      <img
                        className="transition-transform w-full relative block"
                        src={flagUSAColor}
                        alt="Flag of USA"
                      />

                      <h4 className="geolocator__link__text mt-4 caption">
                        US
                      </h4>
                    </a>
                  )}
                </li>
              </ul>

              <p className="mt-8 b1">
                Choosing the region closest to you will help reduce shipping
                times.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

Geolocator.defaultProps = {};

Geolocator.propTypes = {};

export default Geolocator;
