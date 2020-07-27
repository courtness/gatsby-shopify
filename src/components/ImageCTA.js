import React, { useContext } from "react";
import PropTypes from "prop-types";
import { Link } from "gatsby";
import { DocumentContext } from "~context/DocumentContext";
import Button from "~components/Button";

import wireframe from "~assets/images/wireframe.png";

const ImageCTA = ({ align, content, grid, heading, image, subheading }) => {
  const { device } = useContext(DocumentContext);

  const ctaJSX = (
    <>
      <h4 className="f5 text-center">{heading}</h4>
      <h4 className="mt-6 b1 text-center">{subheading}</h4>

      <Link to="/products">
        <Button className="w-48 mt-4" color="white" text="See products" />
      </Link>
    </>
  );

  return (
    <section className="w-full relative bg-purple text-white">
      {(grid && (
        <article className="grid">
          {((device && device === `mobile`) || align === `left`) && (
            <div className="grid-end-6 xs:grid-end-12">
              <img
                className="w-full h-full absolute transform-center"
                src={image || wireframe}
                alt="Source"
              />
            </div>
          )}

          <div className="grid-end-6 xs:grid-end-12 flex flex-col items-center justify-center pt-24 pb-24 px-12 sm:px-0">
            {ctaJSX}
          </div>

          {device !== `mobile` && align === `right` && (
            <div className="grid-end-6 xs:grid-end-12">
              <img
                className="w-full h-full absolute transform-center"
                src={image || wireframe}
                alt="Source"
              />
            </div>
          )}
        </article>
      )) || (
        <article className="w-full relative flex">
          {((device && device === `mobile`) || align === `left`) && (
            <div className="w-1/2 xs:w-full relative">
              <img
                className="w-full h-full absolute transform-center"
                src={image || wireframe}
                alt="Source"
              />
            </div>
          )}

          <div className="w-1/2 xs:w-full flex flex-col items-center justify-center pt-24 pb-24 px-12 sm:px-0">
            {ctaJSX}
          </div>

          {device !== `mobile` && align === `right` && (
            <div className="w-1/2 xs:w-full relative">
              <img
                className="w-full h-full absolute transform-center"
                src={image || wireframe}
                alt="Source"
              />
            </div>
          )}
        </article>
      )}
    </section>
  );
};

ImageCTA.defaultProps = {
  align: `left`,
  content: ``,
  grid: false,
  heading: ``,
  image: null,
  subheading: ``
};

ImageCTA.propTypes = {
  align: PropTypes.string,
  content: PropTypes.string,
  grid: PropTypes.bool,
  heading: PropTypes.string,
  image: PropTypes.shape({}),
  subheading: PropTypes.string
};

export default ImageCTA;
