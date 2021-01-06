import styles from "./Body.module.scss";
import classNames from "classnames";
import Item from "./Item2";

const Box = ({ isHead, headText, isBefore, year, month, date, baseUrl }) => {
  if (isHead) {
    return (
      <div
        className={classNames({
          [styles.box]: true,
        })}
      >
        <span className={styles.text}>{headText}</span>
      </div>
    );
  }

  if (isBefore) {
    return (
      <div
        className={classNames({
          [styles.box]: true,
          [styles.grayed]: true,
        })}
      >
        <span className={styles.text}>{date}</span>
      </div>
    );
  }

  return (
    <div
      className={classNames({
        [styles.box]: true,
      })}
    >
      <div>
        <span className={styles.text}>{date}</span>
      </div>

      <Item year={year} month={month} date={date} baseUrl={baseUrl} />
    </div>
  );
};

export default Box;
