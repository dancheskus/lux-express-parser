const { departure, destination, isReturning } = require('./components/settings.js');

const searchTickets = require('./components/searchTickets');

const startApp = async () => {
  const aToB = await searchTickets(departure, destination);
  console.log(aToB);
  if (!isReturning) return;
  const bToA = await searchTickets(destination, departure);
  console.log(bToA);
};
startApp();

// Научится определять максимальное кол-во legs и concurrency, и умно их выставлять
// https://ticket.luxexpress.eu/ru/Stops/FindBy?stopName=riga - Запрос остановки --> slug - элементы ссылки
