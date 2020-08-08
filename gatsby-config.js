const path = require("path");

module.exports = {
  siteMetadata: {
    title: "Yi Hong",
    siteUrl: "https://yihong.run",
    description: "Personal site and blog",
  },
  plugins: [
    "gatsby-plugin-react-helmet",
    {
      resolve: "gatsby-transformer-remark",
      options: {
        plugins: [
          "gatsby-remark-responsive-iframe",
          "gatsby-remark-smartypants",
          "gatsby-remark-widows",
          "gatsby-remark-external-links",
          {
            resolve: "gatsby-remark-autolink-headers",
            options: {
              // offsetY: "100",
              // icon: "<svg aria-hidden="true" height="20" version="1.1" viewBox="0 0 16 16" width="20"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg>",
              className: "header-link",
              // maintainCase: true,
              // removeAccents: true,
              // isIconAfterHeader: true,
              // elements: ["h1", "h4"],
            },
          },
          {
            resolve: "gatsby-remark-images",
            options: {
              maxWidth: 600,
              quality: 80,
              withWebp: { quality: 80 },
            },
          },
        ],
      },
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "src",
        path: `${__dirname}/posts`,
      },
    },
    {
      resolve: "gatsby-plugin-sass",
      options: {
        precision: 8,
      },
    },
    "gatsby-transformer-yaml",
    "gatsby-transformer-json",
    {
      resolve: "gatsby-source-filesystem",
      options: {
        path: "./data/",
      },
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "images",
        path: `${__dirname}/posts/images`,
      },
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "static_images",
        path: `${__dirname}/src/images`,
        ignore: ["**/.(js|jsx|scss)"],
      },
    },
    "gatsby-transformer-sharp",
    "gatsby-plugin-sharp",
    //"gatsby-redirect-from",
    "gatsby-plugin-sitemap",
    {
      resolve: "gatsby-plugin-robots-txt",
      options: {
        policy: [{ userAgent: "*", allow: "/" }],
      },
    },
    {
      resolve: "gatsby-plugin-feed",
      options: {
        query: `
          query {
            site {
              siteMetadata {
                title
                description
                siteUrl
              }
            }
          }
        `,
        feeds: [
          {
            serialize: ({ query: { site, allMarkdownRemark } }) => {
              return allMarkdownRemark.edges.map((edge) => {
                return Object.assign({}, edge.node.frontmatter, {
                  description: edge.node.excerpt,
                  date: edge.node.frontmatter.date,
                  url: site.siteMetadata.siteUrl + edge.node.fields.slug,
                  guid: site.siteMetadata.siteUrl + edge.node.fields.slug,
                  custom_elements: [{ "content:encoded": edge.node.html }],
                });
              });
            },
            query: `
              query {
                allMarkdownRemark(
                  sort: { fields: [frontmatter___date], order: DESC },
                  filter: {frontmatter: {hidden: {ne: true}}}
                ) {
                  totalCount
                  edges {
                    node {
                      excerpt(pruneLength: 300)
                      html
                      fields { slug }
                      frontmatter {
                        title
                        date
                      }
                    }
                  }
                }
              }
            `,
            output: "/rss.xml",
            title: "Yi Hong",
          },
        ],
      },
    },
  ],
};
