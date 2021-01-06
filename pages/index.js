const R = require("ramda");
// const request = require('request');
const cheerio = require("cheerio");
const iconv = require("iconv-lite");
import axios from "axios";
import moment from "moment";
import Item from "../components/item";

const url =
  "http://ddpension.mstay.co.kr/m_member/index.html?gn=&year=2019&month=07&day=26&style2=";
const moms_pensions = ["데이바이", "캐리비안", "프렌즈"];

const getUrl = (year, month, day) =>
  `http://ddpension.mstay.co.kr/m_member/index.html?gn=&year=${year}&month=${month}&day=${day}&style2=`;

const resurveUrl = (uri) => `https://ddpension.mstay.co.kr/${uri}`;

const parse = async (url) => {
  const response = await axios.request({
    method: "GET",
    url,
    responseType: "arraybuffer",
    responseEncoding: "binary",
  });
  const html = iconv.decode(response.data.toString("binary"), "euc-kr");

  const $ = cheerio.load(html, { decodeEntities: true });
  // const daybyd = $('td').filter(() => $(this).text().trim() === '데이바이D');
  const contents = $("body table tbody tr td table tbody tr td");
  const roomTable = $(contents).children("table").get(6);
  const roomTable2 = $(roomTable)
    .children("tbody")
    .children("tr")
    .children("td")
    .children("table")
    .children("tbody")
    .children("tr")
    .children("td")
    .children("table")
    .get(0);

  const rooms = $(roomTable2).children("tbody").children();

  const momsRooms = rooms.filter((i, room) => {
    const roomText = $(room).text();
    for (const name of moms_pensions) {
      const result = R.contains(name, roomText);
      if (result) return result;
    }
    return false;
  });

  const results = [];
  for (let i = 0; i < momsRooms.length; i++) {
    const room = momsRooms.get(i);
    const name = $(room).children("td").get(0);
    const info = $(room).children("td").get(5);

    const img = $(info).children("img");

    if (img.length > 0) {
      const onClick = $(img).attr("onclick");
      const uri = R.split("'", onClick)[1];
      results.push([$(name).text(), "btn", uri]);
    } else {
      results.push([$(name).text(), $(info).text()]);
    }
  }

  return results;
};

const getDates = () => {
  const now = moment();
  return R.map((x) => now.add(1, "days").format("YYYY-MM-DD"))(R.range(0, 30));
};

class Index extends React.Component {
  static async getInitialProps({ req }) {
    const dates = getDates();

    const results = await Promise.all(
      dates.map(async (date) => {
        const d = moment(date);
        const d_obj = d.toObject();
        const url = getUrl(d_obj.years, d_obj.months + 1, d_obj.date);
        const r = await parse(url);
        return [date, r];
      })
    );
    return { results };
  }

  render() {
    const { results } = this.props;
    return (
      <div>
        <Item />
        {results.map((result, j) => {
          const weekday = moment(result[0]).weekday();
          const bgColor =
            weekday === 0
              ? "#FFC0CB"
              : weekday === 6
              ? "#B0E0E6"
              : j % 2 === 1
              ? "#DCDCDC"
              : undefined;
          return (
            <div
              key={result[0]}
              style={{
                display: "flex",
                flexDirection: "row",
                backgroundColor: bgColor,
              }}
            >
              <div
                style={{
                  "-webkit-flex": "initial",
                  flex: "initial",
                  marginRight: "20px",
                }}
              >
                {result[0]}
              </div>
              <div
                style={{
                  "-webkit-flex": "initial",
                  flex: "initial",
                }}
              >
                {result[1].map((r, i) => {
                  if (r.length === 3) {
                    return (
                      <div key={`${result[0]}${i}`}>
                        {" "}
                        {r[0]}{" "}
                        <button type="button">
                          <a href={resurveUrl(r[2])} target="_blank">
                            예약하기
                          </a>
                        </button>
                      </div>
                    );
                  }
                  return <div key={`${result[0]}${i}`}> {r}</div>;
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}

export default Index;
