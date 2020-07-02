/* eslint-disable react/prop-types */
// import { PropTypes } from "prop-types";

import React, { useState } from "react";
import { graphql } from "gatsby";
import DummyImage from "~components/DummyImage";
import Footer from "~components/Footer";
import InstagramGrid from "~components/InstagramGrid";
import Layout from "~components/Layout";
import Newsletter from "~components/Newsletter";
import SEO from "~components/SEO";

const FaqPage = ({ data, location }) => {
  const [expanded, setExpanded] = useState(null);

  const { frontmatter } = data.markdownRemark;

  return (
    <>
      <SEO
        customTitle={frontmatter.title}
        customDescription={frontmatter.seoDescription}
        customKeywords={frontmatter.seoKeywords}
        path={location.pathname}
      />

      <Layout className="faq-page w-full relative">
        <DummyImage />

        <section className="w-full relative block py-24">
          <article className="grid">
            <h1 className="grid-end-12 f1 text-center">{frontmatter.title}</h1>
          </article>

          <article className="grid">
            <ul className="grid-end-6 grid-start-4">
              {frontmatter.questions.map((question, questionIndex) => {
                const key = `question-${questionIndex}`;

                return (
                  <li key={key}>
                    <button
                      type="button"
                      onClick={() =>
                        setExpanded(
                          expanded !== questionIndex ? questionIndex : null
                        )
                      }
                      className="w-full relative py-4 border-b-black f5 text-left"
                    >
                      {question.question}
                    </button>

                    {expanded === questionIndex && (
                      <p className="animation-appear-down pt-6 pb-8 f5">
                        {question.answer}
                      </p>
                    )}
                  </li>
                );
              })}
            </ul>
          </article>
        </section>

        <InstagramGrid />

        <Newsletter />
      </Layout>
      <Footer />
    </>
  );
};

export default FaqPage;

export const query = graphql`
  query FaqPage($id: String!) {
    markdownRemark(id: { eq: $id }) {
      frontmatter {
        title
        questions {
          question
          answer
        }
        seoDescription
        seoKeywords
      }
    }
  }
`;
