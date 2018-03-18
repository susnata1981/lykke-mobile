const moment = require('moment');

let curr = moment(1521043636745);
let yday = moment(1521043636745);
yday.subtract(1, 'days');
// console.log(yday.format('MM/DD/YYYY'));
console.log(curr.valueOf());
console.log(yday.valueOf());
// console.log(moment().valueOf());

// console.log(moment().format('MM/DD/YYYY'));