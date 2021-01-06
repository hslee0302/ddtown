import React from "react";
import styles from "./Head.module.scss";

const Head = ({ title }) => {
  return (
    <div className={styles.head}>
      <span className={styles.title}>{title}</span>
    </div>
  );
};

export default Head;
