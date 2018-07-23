const moment = require('moment');

const { departure, destination, isReturning, returningDayRange } = require('./components/settings.js');

const searchTickets = require('./components/searchTickets');

const startApp = async () => {
  const aToB = await searchTickets(departure, destination);
  // console.log(aToB);
  if (!isReturning) return;
  const bToA = await searchTickets(destination, departure);
  // console.log(bToA);

  aToB.forEach(aToBtrip => {
    const firstDate = moment(aToBtrip.date, 'MM-DD-YYYY');

    bToA.forEach(bToAtrip => {
      const secondDate = moment(bToAtrip.date, 'MM-DD-YYYY');
      const difference = secondDate.diff(firstDate, 'd');
      if (difference >= returningDayRange.min && difference <= returningDayRange.max) {
        console.log(aToBtrip, bToAtrip);
      }
    });
  });
};
startApp();

// Если в range указана одна дата, то она должна быть фиксированной
// Переодически при рабочем коде вылетают ошибки сервера
// Научится определять максимальное кол-во legs и concurrency, и умно их выставлять
// https://ticket.luxexpress.eu/ru/Stops/FindBy?stopName=riga - Запрос остановки --> slug - элементы ссылки
