import React from "react";
import classNames from "classnames";

import styles from "./project.module.scss";

const titleise = (title) => {
  return title.charAt(0).toUpperCase() + title.slice(1);
};

export default ({ project, languages }) => {
  return (
    <div className="mr5">
      <h3
        className={classNames("pt5 mv0", {
          "f3-ns f2-m f1-l": project.primary,
          "f5-ns f4-m f3-l": !project.primary,
        })}
      >
        {project.name}
      </h3>
      <p className="pt2 mv0">
        <a
          className="link gray underline-hover"
          href={`https://github.com/${project.repo}`}
        >
          {project.repo}
        </a>
      </p>
      <h4 className="pt2 mv0 silver">
        {titleise(project.role)}, {project.status}
      </h4>
      <p className="pt2 mv0">{project.description}</p>
      <ul className={styles.languages}>
        {project.languages.map((languageName) =>
          languages
            .filter((language) => language.name === languageName)
            .map((language) => (
              <li key={language.id}>
                <span style={{ backgroundColor: language.colour }} />
                {language.name}
              </li>
            ))
        )}
      </ul>
    </div>
  );
};
