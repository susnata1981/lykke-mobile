export const DAYS = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];

export const getDay = (index) => {
  return DAYS[index];
}

export const indexOfDay = (day) => {
  return DAYS[day];
}

export function isInteger(value) {
  return !isNaN(value) &&
    parseInt(Number(value)) === value &&
    !isNaN(parseInt(value, 10));
}

export const isInt = (n) => {      
  if (n === 0) {
    return true;
  }                                                        
  return Number(n) === n && n % 1 === 0;
}                                                                                        

export const isFloat = (n) => {       
  if (n === 0) {
    return true;
  }                                                   
  return Number(n) === n && n % 1 !== 0;                               
}

export const isNumber = (n) => {
  return isInt(n) || isFloat(n);
}

export function getDateObject(today) {
  return {
    day: today.getDate(),
    month: today.getMonth() + 1,
    year: today.getFullYear(),
  }
}

export function formatCurrency(amount) {
  if (typeof amount === Number) {
    return `Rs. ${amount.toFixed(2)}`
  } else {
    return `Rs. ${parseFloat(amount).toFixed(2)}`
  }
}

export function isToday(timestamp) {
  let currDate = new Date(timestamp);
  let today = new Date();
  return currDate.getDate() === today.getDate() 
  && currDate.getMonth() === today.getMonth()
  && currDate.getFullYear() === today.getFullYear();
}

export function isSameDay(d1, d2) {
  return d1.getDate() === d2.getDate()
    && d1.getMonth() === d2.getMonth()
    && d1.getFullYear() === d2.getFullYear();
}