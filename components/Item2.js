import useSWR from "swr";
import styles from "./Body.module.scss";
import queryString from "querystring";

const R = require("ramda");
const fetcher = (...args) => fetch(...args).then((res) => res.json());
const resurveUrl = (uri) => `https://ddpension.mstay.co.kr/${uri}`;

const Item = ({ year, month, date, baseUrl }) => {
  const query = queryString.stringify({ year, month, date });
  const { data, error } = useSWR(`${baseUrl}/getData?${query}`, fetcher);

  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;

  const daybyd = R.find((x) => R.contains("데", x.name), data);
  const caribbean = R.find((x) => R.contains("캐", x.name), data);
  const friends = R.find((x) => R.contains("프", x.name), data);

  return (
    <>
      <div>
        <span className={styles.text}>
          데:
          {daybyd.hasReserv ? (
            R.split(":", daybyd.reservState)[1]
          ) : (
            <button type="button">
              <a href={resurveUrl(daybyd.reservUri)} target="_blank">
                예약
              </a>
            </button>
          )}
        </span>
      </div>
      <div>
        <span className={styles.text}>
          캐:
          {caribbean.hasReserv ? (
            R.split(":", caribbean.reservState)[1]
          ) : (
            <button type="button">
              <a href={resurveUrl(caribbean.reservUri)} target="_blank">
                예약
              </a>
            </button>
          )}
        </span>
      </div>
      <div>
        <span className={styles.text}>
          프:
          {friends.hasReserv ? (
            R.split(":", friends.reservState)[1]
          ) : (
            <button type="button">
              <a href={resurveUrl(friends.reservUri)} target="_blank">
                예약
              </a>
            </button>
          )}
        </span>
      </div>
    </>
  );
};

export default Item;
