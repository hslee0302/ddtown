import React from "react";
import styles from "./Body.module.scss";
import Box from "./Box";

const R = require("rambda");
const heads = ["일", "월", "화", "수", "목", "금", "토"];

const Body = ({ days }) => {
  const splited = R.splitEvery(7, days);
  return (
    <>
      <div className={styles.body}>
        <div className={styles.row}>
          {heads.map((x) => (
            <Box key={x} isHead={true} headText={x} />
          ))}
        </div>

        {splited.map((row, i) => {
          return (
            <div className={styles.row} key={i}>
              {row.map((item) => {
                const [before, day] = item;
                const [year, month, date] = R.split("-", day);

                if (before) {
                  return <Box key={day} isBefore={true} date={date} />;
                }

                return <Box key={day} year={year} month={month} date={date} />;
              })}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Body;
