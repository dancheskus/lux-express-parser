const moment = require('moment');

const { departure, destination, isReturning, returningDayRange } = require('./components/settings.js');

const searchTickets = require('./components/searchTickets');

const startApp = async () => {
  const aToB = await searchTickets(departure, destination);
  if (!isReturning) return;
  const bToA = await searchTickets(destination, departure);

  aToB.forEach(aToBtrip => {
    const firstDate = moment(aToBtrip.date, 'MM-DD-YYYY');
    const firstReturnDate = moment(firstDate).add(returningDayRange.min, 'd');
    const lastReturnDate = moment(firstDate).add(returningDayRange.max, 'd');
    const firstReturnDateIndex = findFirstReturnDateIndex(bToA, firstReturnDate.format('MM-DD-YYYY'));
    if (firstReturnDateIndex === -1) return;

    for (
      let i = firstReturnDateIndex;
      bToA[i] && lastReturnDate.diff(moment(bToA[i].date, 'MM-DD-YYYY'), 'd') > 0;
      i++
    ) {
      console.log(`atob: ${firstDate} btoa: ${bToA[i].date}`);
    }
  });
};
startApp();

const findFirstReturnDateIndex = (arr, value) => {
  let high = arr.length - 1;
  let low = (mid = 0);

  while (low <= high) {
    mid = Math.floor((high + low) / 2);

    if (arr[mid].date == value) {
      return mid;
    } else if (value > arr[mid].date) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }
  return -1;
};

// Если в range указана одна дата, то она должна быть фиксированной
// Переодически при рабочем коде вылетают ошибки сервера
// Научится определять максимальное кол-во legs и concurrency, и умно их выставлять
// https://ticket.luxexpress.eu/ru/Stops/FindBy?stopName=riga - Запрос остановки --> slug - элементы ссылки
