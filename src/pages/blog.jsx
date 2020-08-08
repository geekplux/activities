import React from "react";
import { Link, graphql } from "gatsby";

import Layout from "../components/layout";

const PostItem = ({ post }) => {
  return (
    <div className="pb5">
      <Link to={post.fields.slug} className="link black no-underline">
        <h3 className="mb1">
          {post.frontmatter.list_title || post.frontmatter.title}
          <br />
        </h3>
        <small className="f6 gray">{post.frontmatter.date}</small>
        <p>{post.excerpt}</p>
      </Link>
    </div>
  );
};

export default ({ data }) => {
  return (
    <Layout>
      <div>
        <div className="fl w-100 w-70-l">
          {data.allPosts.edges.map(({ node }) => (
            <PostItem post={node} key={node.id} />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export const query = graphql`
  query {
    allPosts: allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { hidden: { ne: true } } }
    ) {
      totalCount
      edges {
        node {
          id
          frontmatter {
            title
            list_title
            date(formatString: "DD MMMM, YYYY")
          }
          excerpt(pruneLength: 300)
          fields {
            slug
          }
        }
      }
    }
  }
`;
