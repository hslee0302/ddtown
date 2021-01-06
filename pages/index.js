import moment from "moment";
import Body from "../components/Body";
import Head from "../components/Head";

const R = require("rambda");

class Index extends React.Component {
  static async getInitialProps({ req }) {
    const baseUrl = req ? `${req.protocol}://${req.get("Host")}` : "";
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
    ])(R.range(0, 30));
    const days = R.concat(beforeDays, viewDays);

    return { startTitle, days, baseUrl };
  }

  render() {
    const { startTitle, days, baseUrl } = this.props;
    return (
      <div className="App">
        <Head title={startTitle} />
        <Body days={days} baseUrl={baseUrl} />
      </div>
    );
  }
}

export default Index;
