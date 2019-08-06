const R = require('ramda');
// const request = require('request');
const cheerio = require('cheerio');
const iconv = require('iconv-lite');
import axios from 'axios';
import moment from 'moment';

const url = 'http://ddpension.mstay.co.kr/m_member/index.html?gn=&year=2019&month=07&day=26&style2=';
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

const getDates = () => {
  const now = moment();
  return R.map(x => now.add(1, 'days').format('YYYY-MM-DD'))(R.range(0, 30));
}

class Index extends React.Component {

  static async getInitialProps ({req}) {
    const dates = getDates();

    const results = await Promise.all(dates.map(async (date) => {
      const d = moment(date);
      const d_obj = d.toObject();
      const url = getUrl(d_obj.years, d_obj.months + 1, d_obj.date);
      const r = await parse(url);
      return [date, r];
    }));
    return {results}
  }

  
  render() {

    const {results} = this.props;
    return (
      <div>
        {results.map((result, j) => {
          const weekday = moment(result[0]).weekday();
          const bgColor = weekday === 0 ? '#FFC0CB':
                          weekday === 6 ? '#B0E0E6': 
                          j % 2 === 1? '#DCDCDC': undefined;
          return (
            <div key={result[0]} style={{
              display: 'flex',
              flexDirection: "row",
              backgroundColor: bgColor,
            }}>
              <div style={{
                '-webkit-flex': 'initial',
                'flex': 'initial',
                marginRight: '20px',
              }}>
                {result[0]}
              </div>
              <div  style={{
                '-webkit-flex': 'initial',
                'flex': 'initial',
              }}>
                {result[1].map((r, i) => (
                  <div key={`${result[0]}${i}`}>    
                    {' '} {r}
                  </div>
                ))}
              </div>

            </div>
          )}
        )}
      </div>
    );
  }
}

export default Index;
