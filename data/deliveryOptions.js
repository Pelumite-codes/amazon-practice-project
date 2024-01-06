import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';

console.log(dayjs());

export function getDeliveryOption(deliveryOptionId) {
  let deliveryOption;
    
  deliveryOptions.forEach(option => {
    if (option.id === deliveryOptionId) {
      deliveryOption = option;
    }
  });

  return deliveryOption;
};

function isWeekend(date) {
  const dayOfTheWeek = date.format('dddd');
  return dayOfTheWeek === 'Sunday' || dayOfTheWeek === 'Saturday';
};

export function calculateDeliveryOption(deliveryOption) {
  const { deliveryDays } = deliveryOption;

  let remainingDays = deliveryDays;
  let deliveryDate = dayjs();

  while (remainingDays > 0) {
    deliveryDate = deliveryDate.add(1, 'days');

    if(!isWeekend(deliveryDate)) {
      remainingDays--;
    }
  }
  
  const dateString = deliveryDate.format('dddd, MMMM D'); 

  return dateString;
};

export const deliveryOptions = [{
  id: '1',
  deliveryDays: 7,
  priceCents: 0
}, {
  id: '2',
  deliveryDays: 3,
  priceCents: 499
}, {
  id: '3',
  deliveryDays: 1,
  priceCents: 999
}]