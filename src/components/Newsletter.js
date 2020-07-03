import React, { useEffect, useState } from "react";
import Parallaxer from "~components/Parallaxer";
import { validateEmail } from "~utils/helpers";

import doge from "~assets/images/doge.jpg";

const Newsletter = () => {
  const [formData, setFormData] = useState({});
  const [interacted, setInteracted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [valid, setValid] = useState(false);

  useEffect(() => {
    if (!interacted) {
      return;
    }

    if (
      !formData.name ||
      formData.name === `` ||
      !formData.email ||
      !validateEmail(formData.email)
    ) {
      setValid(false);
    } else {
      setValid(true);
    }
  }, [formData]);

  //

  const onSubmit = e => {
    e.preventDefault();

    if (!valid || submitting || submitted) {
      return false;
    }

    setSubmitting(true);

    setTimeout(() => {
      setSubmitted(true);
    }, 2000);

    // TODO : add your Mailchimp, Klaviyo...

    return false;
  };

  //

  let buttonText = `Submit`;

  if (submitted) {
    buttonText = `Submitted`;
  } else if (submitting) {
    buttonText = `Submitting`;
  }

  return (
    <section className="w-full relative pt-8 pb-12 overflow-hidden bg-black text-white">
      <div className="w-full h-full absolute top-0 right-0 bottom-0 left-0">
        <img
          className="w-full xs:w-auto xs:h-full absolute opacity-50 transform-center"
          src={doge}
          alt="doge"
        />
      </div>

      <form className="grid" onSubmit={onSubmit}>
        <h2 className="grid-end-12 mb-4 f4">Newsletter</h2>
        <h2 className="grid-end-12 mb-8 b1">Sign up, or whatever.</h2>

        <input
          className="grid-end-3 xs:grid-end-12 h-12 relative block px-2 border-black bg-white b1 text-black"
          onChange={e => {
            setInteracted(true);
            setFormData({ ...formData, name: e.target.value });
          }}
          placeholder="Name"
          type="text"
        />

        <input
          className="grid-end-3 xs:grid-end-12 h-12 relative block px-2 border-black bg-white b1 text-black"
          onChange={e => {
            setInteracted(true);
            setFormData({ ...formData, email: e.target.value });
          }}
          placeholder="Email address"
          type="email"
        />

        <input
          className={`${
            valid && !submitting && !submitted
              ? ``
              : `opacity-50 pointer-events-none`
          } grid-end-2 xs:grid-end-12 grid-start-1 button button--white relative mt-4 xs:mt-1 py-4 cursor-pointer caption uppercase`}
          type="submit"
          value={buttonText}
        />
      </form>
    </section>
  );
};

export default Newsletter;
