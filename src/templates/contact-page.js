/* eslint-disable react/prop-types */
// import { PropTypes } from "prop-types";

import React from "react";
import { graphql } from "gatsby";
import DummyImage from "~components/DummyImage";
import Footer from "~components/Footer";
import InstagramGrid from "~components/InstagramGrid";
import Layout from "~components/Layout";
import Newsletter from "~components/Newsletter";
import SEO from "~components/SEO";

const ContactPage = ({ data, location }) => {
  const { frontmatter } = data.markdownRemark;

  return (
    <>
      <SEO
        customTitle={frontmatter.title}
        customDescription={frontmatter.seoDescription}
        customKeywords={frontmatter.seoKeywords}
        path={location.pathname}
      />

      <Layout className="contact-page w-full relative">
        <DummyImage />

        <section className="w-full relative block py-24">
          <article className="grid">
            <h1 className="grid-end-12 f1 text-center">{frontmatter.title}</h1>
          </article>
        </section>

        <InstagramGrid />

        <Newsletter />
      </Layout>

      <Footer />
    </>
  );
};

export default ContactPage;

export const query = graphql`
  query ContactPage($id: String!) {
    markdownRemark(id: { eq: $id }) {
      frontmatter {
        title
        seoDescription
        seoKeywords
      }
    }
  }
`;
