import React, { useContext, useRef, useState } from "react";
import PropTypes from "prop-types";
import { DocumentContext } from "~context/DocumentContext";

const AppearOnScroll = ({ children, delay, once }) => {
  const documentContext = useContext(DocumentContext);
  const containerRef = useRef();
  const [visible, setVisible] = useState(false);
  const { windowHeight } = documentContext;

  if (containerRef && containerRef.current) {
    const { height, top } = containerRef.current.getBoundingClientRect();

    if (top > -height && top < windowHeight) {
      if (!visible) {
        setVisible(true);
      }
    } else if (visible && !once) {
      setVisible(false);
    }
  }

  let computedChildren = children;

  if (typeof children === `function`) {
    computedChildren = children({ visible });
  }

  return (
    <div
      ref={containerRef}
      className={`${
        visible ? `animation-appear` : `invisible`
      } animation-delay-${delay}`}
    >
      {computedChildren}
    </div>
  );
};

AppearOnScroll.defaultProps = {
  delay: 2,
  once: false
};

AppearOnScroll.propTypes = {
  children: PropTypes.oneOfType([PropTypes.func, PropTypes.node]).isRequired,
  delay: PropTypes.number,
  once: PropTypes.bool
};

export default AppearOnScroll;
