import React, { Fragment } from "react";
import { Helmet } from "react-helmet";
import { graphql } from "gatsby";

import Layout from "../components/layout.jsx";
import Project from "../components/project/project.jsx";
import styles from "./running.module.scss";

export default ({ data }) => {
  return (
    <Fragment>
      <Helmet bodyAttributes={{ class: styles.body }} />
      <Layout>
        <div className="pb3 flex flex-wrap">
          {data.primaryProjects.edges.map(({ node }) => (
            <div key={node.id} className="w-100-m w-50-l">
              <Project
                project={node}
                languages={data.languages.edges.map((e) => e.node)}
              />
            </div>
          ))}
        </div>
        <hr className="bb b--black-20 mt5" />
        <div className="pv3 flex flex-wrap">
          {data.secondaryProjects.edges.map(({ node }) => (
            <div key={node.id} className="w-100-m w-50-l">
              <Project
                project={node}
                languages={data.languages.edges.map((e) => e.node)}
              />
            </div>
          ))}
        </div>
      </Layout>
    </Fragment>
  );
};

export const query = graphql`
  query {
    primaryProjects: allProjectsYaml(filter: { primary: { eq: true } }) {
      edges {
        node {
          ...ProjectFragment
        }
      }
    }

    secondaryProjects: allProjectsYaml(filter: { primary: { eq: false } }) {
      edges {
        node {
          ...ProjectFragment
        }
      }
    }

    languages: allLanguagesYaml {
      edges {
        node {
          id
          name
          colour
        }
      }
    }
  }

  fragment ProjectFragment on ProjectsYaml {
    id
    name
    repo
    role
    description
    languages
    status
    primary
  }
`;
