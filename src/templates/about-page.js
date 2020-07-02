/* eslint-disable react/prop-types */
// import { PropTypes } from "prop-types";

import React from "react";
import { graphql } from "gatsby";
import BlogCTA from "~components/BlogCTA";
import DummyImage from "~components/DummyImage";
import ImageCTA from "~components/ImageCTA";
import InstagramGrid from "~components/InstagramGrid";
import Footer from "~components/Footer";
import Layout from "~components/Layout";
import Newsletter from "~components/Newsletter";
import SEO from "~components/SEO";

const AboutPage = ({ data, location }) => {
  const { frontmatter } = data.markdownRemark;

  return (
    <>
      <SEO
        customTitle={frontmatter.title}
        customDescription={frontmatter.seoDescription}
        customKeywords={frontmatter.seoKeywords}
        path={location.pathname}
      />

      <Layout className="about-page w-full relative">
        <DummyImage />

        <ImageCTA content="very image" />
        <ImageCTA align="right" content="what a moment" />

        <BlogCTA content="blogs are still good right" />

        <InstagramGrid heading="Instagram" />

        <Newsletter heading="Instagram" />
      </Layout>

      <Footer />
    </>
  );
};

export default AboutPage;

export const query = graphql`
  query AboutPage($id: String!) {
    markdownRemark(id: { eq: $id }) {
      frontmatter {
        title
        seoDescription
        seoKeywords
      }
    }
  }
`;
