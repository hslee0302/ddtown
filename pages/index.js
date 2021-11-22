import React from 'react';
import moment from "moment";
import Body from "../components/Body";
import Head from "../components/Head";

const R = require("rambda");

class Index extends React.Component {
  static async getInitialProps() {
    const now = moment();
    const startTitle = now.format("YYYY-MM");

    const day = now.day();

    const beforeDays = [];
    if (day > 0) {
      for (let i = 0; i < day; i++) {
        beforeDays.push([
          true,
          moment(now)
            .add(i - day, "days")
            .format("YYYY-MM-DD"),
        ]);
      }
    }

    const viewDays = R.map((x) => [
      false,
      moment(now).add(x, "days").format("YYYY-MM-DD"),
    ])(R.range(0, 60));
    const days = R.concat(beforeDays, viewDays);

    return { startTitle, days };
  }

  render() {
    const { startTitle, days } = this.props;
    return (
      <div className="App">
        <Head title={startTitle} />
        <Body days={days} />
      </div>
    );
  }
}

export default Index;
