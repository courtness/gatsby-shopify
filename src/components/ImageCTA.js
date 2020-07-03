import React, { useContext } from "react";
import PropTypes from "prop-types";
import { DocumentContext } from "~context/DocumentContext";

import wireframe from "~assets/images/wireframe.png";

const ImageCTA = ({ align, content, image }) => {
  const { device } = useContext(DocumentContext);

  return (
    <section className="w-full relative">
      <article className="grid">
        {((device && device === `mobile`) || align === `left`) && (
          <div className="grid-end-6 xs:grid-end-12">
            <figure className="square">
              <img
                className="w-full h-full absolute transform-center"
                src={image || wireframe}
                alt="Source"
              />
            </figure>
          </div>
        )}

        <div className="grid-end-6 xs:grid-end-12 flex items-center justify-center pt-24 pb-24 px-12 sm:px-0">
          <h4 className="f2 text-center">{content}</h4>
        </div>

        {device !== `mobile` && align === `right` && (
          <div className="grid-end-6 xs:grid-end-12">
            <figure className="square">
              <img
                className="w-full h-full absolute transform-center"
                src={image || wireframe}
                alt="Source"
              />
            </figure>
          </div>
        )}
      </article>
    </section>
  );
};

ImageCTA.defaultProps = {
  align: `left`,
  content: ``,
  image: null
};

ImageCTA.propTypes = {
  align: PropTypes.string,
  content: PropTypes.string,
  image: PropTypes.shape({})
};

export default ImageCTA;
