const moment = require('moment');

class DateUtils {
  static getCurrentTime() {
    return moment().format('HH:mm:ss');
  }

  static getCurrentDate() {
    return moment().format('YYYY-MM-DD');
  }

  static formatDateForDisplay(date) {
    return moment(date).format('DD/MM/YYYY');
  }

  static formatTimeForDisplay(time) {
    return moment(time, 'HH:mm:ss').format('HH:mm');
  }

  static calculateTimeDifference(startTime, endTime) {
    const start = moment(startTime, 'HH:mm:ss');
    const end = moment(endTime, 'HH:mm:ss');
    return moment.duration(end.diff(start));
  }

  static isWeekend(date) {
    const day = moment(date).day();
    return day === 0 || day === 6; // 0 = Domingo, 6 = Sábado
  }
}

module.exports = DateUtils;