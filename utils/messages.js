const moment = require('moment');

 let formatMessage = (userName, msgText) => {
     return {userName, msgText, time : moment().format('h-mm a')}
 }

 module.exports = formatMessage
