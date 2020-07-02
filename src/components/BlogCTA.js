import React from "react";
import { Link } from "gatsby";
import PropTypes from "prop-types";
import Button from "~components/Button";

import wireframe from "~assets/images/wireframe.png";

const BlogCTA = ({ align, content, image }) => {
  return (
    <section className="w-full relative">
      <article className="grid">
        {align === `left` && (
          <div className="grid-end-6">
            <figure className="square">
              <img
                className="w-full h-full absolute transform-center"
                src={wireframe}
                alt="Source"
              />
            </figure>
          </div>
        )}

        <div className="grid-end-6 flex flex-col items-center justify-center px-12">
          <h4 className="f2 text-center">{content}</h4>

          <Link to="/blog">
            <Button color="black" className="mt-12 px-24" text="View Blog" />
          </Link>
        </div>

        {align === `right` && (
          <div className="grid-end-6">
            <figure className="square">
              <img
                className="w-full h-full absolute transform-center"
                src={wireframe}
                alt="Source"
              />
            </figure>
          </div>
        )}
      </article>
    </section>
  );
};

BlogCTA.defaultProps = {
  align: `left`,
  content: ``,
  image: {}
};

BlogCTA.propTypes = {
  align: PropTypes.string,
  content: PropTypes.string,
  image: PropTypes.shape({})
};

export default BlogCTA;
