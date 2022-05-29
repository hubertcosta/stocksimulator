function formatDate(timeInS, type = "long") {
  let newTime = new Date(timeInS).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  });

  let day = new Date(timeInS).toLocaleString("default", { day: "numeric" });
  let month = new Date(timeInS).toLocaleString("default", {
    month: "short"
  });
  let year = new Date(timeInS).toLocaleString("default", {
    year: "2-digit"
  });

  let newDate = `${day} ${month} ${year}`;

  if (type === "long") {
    return `${newDate} ${newTime}`;
  } else {
    return `${newDate}`;
  }
}

/**
 *
 * @param {string} msg message text
 * @param {('success' | 'fail' | 'info')} status optional
 */
const notify = (msg, status) => {
  let icon = "";
  if (status && status === "success") {
    icon = "bell";
  } else if (status === "fail") {
    icon = "warning";
  } else {
    icon = "info";
  }
  let iconHTML = `
	<span uk-icon=\'icon: ${icon}\'
	  class="uk-text-${status} uk-margin-small-right"
	></span>
	`;
  // console.log(iconHTML)
  let message = `${iconHTML} ${msg}`;
  UIkit.notification({
    message: message,
    pos: "top-right",
    timeout: 4000
  });
};

/**
 *
 * @param {Array} arr array of objects to be sorted
 * @param {String} key key to sort by
 * @param {Boolean} sortAscending sort by ascending or descending
 * @returns
 */
const sortArrayOfObjects = (arr, key, sortAscending, type = "number") => {
  if (type === "number") {
    // console.log('sort by number', type);
    return arr.sort((a, b) => {
      if (sortAscending) {
        // console.log('a:b', a[key], b[key]);
        return a[key] - b[key];
      } else {
        // console.log('a:b', a[key], b[key]);
        return b[key] - a[key];
      }
    });
  } else {
    // console.log('sort by string', type);
    return arr.sort((a, b) => {
      if (sortAscending) {
        // console.log('a:b', a[key] > b[key]);
        return a[key] > b[key];
      } else {
        // console.log('b:a', a[key] > b[key]);
        return b[key] < a[key];
      }
    });
  }
};

// Diamond calculator
const diamondCalculator = timeInMs => {


  // for every 48 hours you hold a stock, you get 1 diamond per share
	// if you have 30 shares you'll get 30 diamonds
	// for every 10 diamonds you get 100
	let diff = Date.now() - timeInMs;
	let minutes = (diff/1000)/60;
	console.log(minutes/60)
};

const groupBySymbolHandler = () => {
  const cloneStonks = Array.from(props.stonks);
  let grouped = groupBy(cloneStonks, "symbol");

  let resultarr = [];

  let keys = Object.keys(grouped);
  // console.log("keys", keys, props.stonks);

  for (const key of keys) {
    const element = grouped[key];

    if (element.length > 1) {
      let avg_price = 0;
      let total_shares = 0;
      let total_market_price = 0;
      let total_bought_price = 0;

      for (let i = 0; i < element.length; i++) {
        const el = element[i];
        total_shares += el.shares;
        total_market_price += Number(el.market_price) * Number(el.shares);
        total_bought_price += Number(el.bought_price);
      }
      console.log("element", element);
      //   "total_shares",
      //   total_shares,
      //   total_market_price,
      //   total_bought_price / element.length
      // );

      element[0].isGrouped = true;
      element[0].shares = total_shares;
      element[0].buys = element.length;
      element[0].bought_price = (total_bought_price / element.length).toFixed(
        2
      );
      resultarr.push(element[0]);
    } else {
      console.log("element[0]", element);
      element[0].isGrouped = false;
      resultarr.push(element[0]);
    }
    // console.log(element.length);
  }
  console.log("resultarr", resultarr);
  // groupedStonks.value = resultarr;
  console.log("groupedStonks", groupedStonks.value);
  return resultarr;
};

const groupBy = (xs, key) => {
  return xs.reduce(function(rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};

/**
 * Log feedback on Google Sheets
 * @param {string} email User email
 * @param {string} feedback feedback text
 */
async function submitFeedback(email, feedback) {
  let url = `https://tinkr.api.stdlib.com/paperhand@dev/?email=${email}&feedback=${feedback}`;
  let res = await doFetch(url);
}

async function doFetch(url) {
  let res = await fetch(url);
  let result = await res.json();

  return result;
}

export { formatDate, submitFeedback, notify, sortArrayOfObjects };
