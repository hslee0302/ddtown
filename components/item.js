const R = require('ramda');
// const request = require('request');
const cheerio = require('cheerio');
const iconv = require('iconv-lite');

import axios from 'axios';
import moment from 'moment';

const moms_pensions = ['데이바이D', '캐리비안'];

const getUrl = (year, month, day) => `http://ddpension.mstay.co.kr/m_member/index.html?gn=&year=${year}&month=${month}&day=${day}&style2=`;
const parse = async (url) => {
  const response = await axios.request({
    method: 'GET',
    url,
    responseType: 'arraybuffer',
    responseEncoding: 'binary'});
  const html = iconv.decode(response.data.toString('binary'), 'euc-kr');

  const $ = cheerio.load(html, { decodeEntities: true });
  // const daybyd = $('td').filter(() => $(this).text().trim() === '데이바이D');
  const allLines = $('tr[height=25]');
  const momsLines = allLines.filter((i, el) => {
    const name = $(el).children('td').get(0);
    return R.contains($(name).text(), moms_pensions);
  })

  const results = [];

  for(let i=0; i<momsLines.length; i++) {
    const p = momsLines.get(i);

    const name = $(p).children('td').get(0);
    const info = $(p).children('td').get(5);

    results.push([
      $(name).text(),
      $(info).text()
    ]);
  }

  return results;
}

const getdata = async (date) => {
  console.log(1111);
  console.log(date);
  const now = moment(date);
  const now_obj = now.toObject();

  const url = getUrl(now_obj.years, now_obj.months + 1, now_obj.date);
  const result = await parse(url);

  return { result }
}

class Item extends React.Component {
  
  

  render() {
    const {result} = await getdata(this.props.date);

    return (
      <div style={{
        '-webkit-flex': 'initial',
        'flex': 'initial',
      }}>
        {result}
      </div>
    )
  }
}

export default Item;