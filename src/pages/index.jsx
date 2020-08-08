import React, { Fragment } from "react";
import { Helmet } from "react-helmet";
import { Link, graphql } from "gatsby";

import Layout from "../components/layout";
import styles from "./running.module.scss";

const PostItem = ({ post }) => {
  return (
    <div className="pb1 cf">
      <Link to={post.fields.slug} className="link black no-underline">
        <h3 className="mb1">
          <span className="fl-l">
            {post.frontmatter.list_title || post.frontmatter.title}
          </span>
          <br className="dn-l" />
          <small className="normal f6 gray fr-l">{post.frontmatter.date}</small>
        </h3>
      </Link>
    </div>
  );
};

export default ({ data }) => {
  return (
    <Fragment>
      <Helmet bodyAttributes={{ class: styles.body }} />
      <Layout>
        <div>
          <div className="fl w-100 w-30-l pb5 pr5-l">
            <section>
              <h3>About</h3>
              <p>我是伊洪，常用名yihong0618</p>
              <p>
                2015年从机械行业转行互联网游戏行业，
                2018年从数据分析师正式转行成为程序员， 热爱编程，偏爱Python，
                热爱游戏，偏爱任天堂， 热爱跑步，跑龄23年，跑过几次马拉松，PB
                4小时1分钟
              </p>
              <ul className="list pl0 b pt3">
                <li className="fl mr3">
                  <a
                    className="link mid-gray no-underline"
                    href="https://github.com/yihong0618"
                  >
                    GitHub
                  </a>
                </li>
                <li className="fl mr3">
                  <a
                    className="link mid-gray no-underline"
                    href="https://twitter.com/yihong06181"
                  >
                    Twitter
                  </a>
                </li>
                <li className="fl mr3">
                  <a
                    className="link mid-gray no-underline"
                    href="mailto:zouzou0208@gmail.com"
                  >
                    Email
                  </a>
                </li>
              </ul>
            </section>
          </div>
          <div className="fl w-100 w-70-l">
            {data.featuredPosts.edges.map(({ node }) => (
              <PostItem post={node} key={node.id} />
            ))}
            <div className="pb5 pt4">
              <Link to="/blog" className="link no-underline mid-gray">
                View full archive
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    </Fragment>
  );
};

export const query = graphql`
  query {
    featuredPosts: allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { hidden: { ne: true }, featured: { eq: true } } }
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
          fields {
            slug
          }
        }
      }
    }
  }
`;
