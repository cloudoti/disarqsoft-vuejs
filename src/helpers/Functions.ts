export function isValidString(value: string) {
  if (value !== '' && value !== null && value !== undefined) {
    return true;
  }
  return false;
}

function isNumberOdd(number: number): boolean {
  const result = number % 2;
  if (result === 0) {
    return false;
  } if (result === Math.round(result)) {
    return true;
  }
  return true;
}

function formatMoney(num: string): string {
  if (isValidString(num)) {
    return `S/ ${num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}`;
  }
  return '';
}

function formatMoneyTwoDecimal(num: string): string {
  const numSplit = num.split('.');
  if (numSplit.length === 1 && isValidString(num)) {
    return `S/ ${num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}.00`;
  }
  if (numSplit.length > 1 && isValidString(numSplit[0])) {
    if (numSplit[1].length > 1) {
      return `S/ ${numSplit[0].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}.${numSplit[1].substr(0, 2)}`;
    }
    return `S/ ${numSplit[0].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}.${numSplit[1]}0`;
  }
  return '';
}

function formatMoneySeparator(num: string): string {
  if (isValidString(num)) {
    return `S/ ${num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
  }
  return '';
}

function unFormatMoneySeparator(num: string): string {
  if (isValidString(num)) {
    return num
      .toString()
      .replace('S/', '')
      .replace(/,/gi, '');
  }
  return '';
}

function formatMoneyWithoutSymbol(num: string): string {
  if (isValidString(num)) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }
  return '';
}

function formatNumberWithoutSymbol(num: string): string {
  if (isValidString(num)) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
  return '';
}

function unformatNumberWithoutSymbol(num: string): string {
  if (isValidString(num)) {
    return num.toString().replace(/,/gi, '');
  }
  return '';
}

function formatDigits(num: string): string {
  if (isValidString(num)) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }
  return '';
}

function formatDate(date: any): string {
  if (isValidString(date)) {
    const parts = date.split('/');
    let part = parts[parts.length - 1];
    if (parts.length < 3 && part.length === 2 && part[part.length - 1] !== '/') {
      part += '/';
      parts[parts.length - 1] = part;
    }
    return parts.join('/');
  }
  return '';
}

function dateToYMD(date) {
  const d = new Date(date);
  let month = `${d.getMonth() + 1}`;
  let day = `${d.getDate()}`;
  const year = d.getFullYear();

  if (month.length < 2) month = `0${month}`;
  if (day.length < 2) day = `0${day}`;

  return [year, month, day].join('-');
}

function dateToDDMMYY(date) {
  const d = new Date(date);
  let month = `${d.getMonth() + 1}`;
  let day = `${d.getDate()}`;
  const year = d.getFullYear();

  if (month.length < 2) month = `0${month}`;
  if (day.length < 2) day = `0${day}`;

  return [day, month, year].join('/');
}

function parseDate(date: string) {
  const correctDate = date.split(' ');

  if (correctDate != null && correctDate.length > 0) {
    const parts = correctDate[0].split('-');

    // eslint-disable-next-line radix
    if (parts.length === 3) return new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
  }
  return null;
}

function dateStringToDate(date: string) {
  const partsDate = date.split('/');
  if (partsDate != null && partsDate.length > 0) {
    return new Date(+partsDate[2], +partsDate[1] - 1, +partsDate[0]);
  }
  return null;
}

function formatPercent(num: number): string {
  const total = 1;
  const percent = 100;
  const value = ((percent * num) / total).toFixed(2);
  return `${value}%`;
}

function validateFormatDate(valDate:string) {
  const RegExPattern = /^\d{1,2}\/\d{1,2}\/\d{2,4}$/;
  if ((valDate.match(RegExPattern)) && (valDate !== '')) {
    return true;
  }
  return false;
}

function validateExistDate(valDate: string) {
  const fechaf = valDate.split('/');
  const day = fechaf[0];
  const month = fechaf[1];
  const year = fechaf[2];
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const date = new Date(year, month, '0');
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if ((day - 0) > (date.getDate() - 0)) {
    return false;
  }
  return true;
}

function validateDateLessThanToday(valDate: string) {
  const x = new Date();
  const fechav = valDate.split('/');
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  x.setFullYear(fechav[2], fechav[1] - 1, fechav[0]);
  const today = new Date();

  if (x >= today) return false;
  return true;
}

function validateFullDate(valDate : string) {
  const RegExPattern = /^\d{1,2}\/\d{1,2}\/\d{2,4}$/;
  if ((valDate.match(RegExPattern)) && (valDate !== '')) {
    const fechaf = valDate.split('/');
    const day = fechaf[0];
    const month = fechaf[1];
    const year = fechaf[2];
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const date = new Date(year, month, '0');
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if ((day - 0) > (date.getDate() - 0)) {
      return false;
    }
  }
  const x = new Date();
  const fechav = valDate.split('/');
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  x.setFullYear(fechav[2], fechav[1] - 1, fechav[0]);
  const today = new Date();
  if (x >= today) return false;
  return true;
}

function getExtencionFromType(text: string): string {
  if (isValidString(text)) {
    return text.toString().replace('image/', '.');
  }
  return '';
}

export default {
  isValidString,
  isNumberOdd,
  formatMoney,
  formatMoneySeparator,
  unFormatMoneySeparator,
  formatMoneyWithoutSymbol,
  formatNumberWithoutSymbol,
  unformatNumberWithoutSymbol,
  formatDigits,
  formatPercent,
  formatDate,
  getExtencionFromType,
  dateToYMD,
  dateToDDMMYY,
  parseDate,
  validateFormatDate,
  validateDateLessThanToday,
  validateExistDate,
  validateFullDate,
  dateStringToDate,
  formatMoneyTwoDecimal,
};
