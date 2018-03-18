import moment from 'moment';

export const CHECKIN_INCOMPLETE = 'INCOMPLETE';
export const CHECKIN_COMPLETE = 'COMPLETE';

export const DAYS = [
  {
    name: 'SUNDAY',
    index: 0,
    holiday: true,
  },
  {
    name: 'MONDAY',
    index: 1,
    holiday: false,
  },
  {
    name: 'TUESDAY',
    index: 2,
    holiday: false,
  },
  {
    name: 'WEDNESDAY',
    index: 3,
    holiday: false,
  },
  {
    name: 'THURSDAY',
    index: 4,
    holiday: false,
  },
  {
    name: 'FRIDAY',
    index: 5,
    holiday: false,
  },
  {
    name: 'SATURDAY',
    index: 6,
    holiday: false,
  }
]

export const mapIndexToDay = (index) => {
  if (index < 0 || index > 6) {
    throw new Error(`Invalid index ${index}`);
  }
  return DAYS.filter(item => item.index === index)[0];
}

export const getCurrentDay = () => {
  const indexOfCurrDay = moment().day();
  if (indexOfCurrDay === 0) {
    return mapIndexToDay(1);
  }
  return mapIndexToDay(indexOfCurrDay);
}