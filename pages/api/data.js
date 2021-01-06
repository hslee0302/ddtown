const { getData } = require("../../getdata");

export default async function handler(req, res) {
  const query = req.query;
  const data = await getData(query.year, query.month, query.date);
  return res.json(data);
}
