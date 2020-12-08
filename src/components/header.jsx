import React from 'react';
import { Link } from 'gatsby';

const Header = ({ siteTitle }) => (
  <>
    <nav
      className="db flex justify-between w-100 ph5-l"
      style={{ marginTop: '3rem' }}
    >
      <div className="dib w-25 v-mid">
        <Link to="/" className="link dim">
          <picture>
            <img
              className="dib w3 h3 br-100"
              alt={siteTitle || 'avatar'}
              src="https://geekpluxblog.oss-cn-hongkong.aliyuncs.com/avatar.jpg?x-oss-process=style/zip"
            />
          </picture>
        </Link>
      </div>
      <div className="dib w-75 v-mid tr">
        <a
          href="https://geekplux.com/"
          className="light-gray link dim f6 f5-l mr3 mr4-l"
        >
          Blog
        </a>
        <a
          href="https://geekplux.com/about"
          className="light-gray link dim f6 f5-l mr3 mr4-l"
        >
          About
        </a>
      </div>
    </nav>
  </>
);

export default Header;
