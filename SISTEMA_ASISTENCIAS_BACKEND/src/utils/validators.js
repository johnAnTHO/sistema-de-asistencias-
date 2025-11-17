// Validadores personalizados
class Validators {
  static isValidDNI(dni) {
    return /^\d{8}$/.test(dni);
  }

  static isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  static isValidTime(time) {
    return /^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/.test(time);
  }

  static isValidDate(date) {
    return !isNaN(Date.parse(date));
  }
}

module.exports = Validators;