const R = require("ramda");
// const request = require('request');
const cheerio = require("cheerio");
const iconv = require("iconv-lite");
const axios = require("axios");

const moms_pensions = ["데이바이", "캐리비안", "프렌즈"];

const getUrl = (year, month, day) =>
  `http://ddpension.mstay.co.kr/m_member/index.html?gn=&year=${year}&month=${month}&day=${day}&style2=`;

const parse = async (url) => {
  const response = await axios.request({
    method: "GET",
    url,
    responseType: "arraybuffer",
    responseEncoding: "binary",
  });
  const html = iconv.decode(response.data, "euc-kr");

  const $ = cheerio.load(html, { decodeEntities: true });
  // const daybyd = $('td').filter(() => $(this).text().trim() === '데이바이D');
  const contents = $("body table tbody tr td table tbody tr td");
  const roomTable = $(contents).children("table").get(8);
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
      results.push({
        name: $(name).text(),
        hasReserv: false,
        reservUri: uri,
        reservState: "",
      });
    } else {
      results.push({
        name: $(name).text(),
        hasReserv: true,
        reservUri: "",
        reservState: $(info).text().trim(),
      });
    }
  }

  return results;
};

const getData = (year, month, date) => {
  const url = getUrl(year, month, date);
  return parse(url);
};

module.exports = {
  getData,
};
