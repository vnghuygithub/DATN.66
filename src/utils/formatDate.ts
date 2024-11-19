import moment from 'moment';
import dayjs from 'dayjs';
export const formatDateCallApi = (date: string) => {
  return dayjs(date, 'DD/MM/YYYY')
};

export const formatDate = (date: string) => {
  return moment(date).format('DD/MM/YYYY');
};
export const formatDateTime = (date: string) => {
  return moment(date).format('DD/MM/YYYY - HH:mm:ss');
};
export const formatDateMonth = (date: string) => {
  return moment(date).format('DD/MM');
}
export const formatDateTable = (date: string) => {
  return moment(date, 'DD/MM/YYYY').format('YYYY-MM-DD');
};
export const formatDateDot = (date: string) => {
  return moment(date).format('HH:mm');
}
export const formatDateLeave = (date: string) => {
  if (!date) return '';
  return moment(date).format('YYYY-MM-DD');
};
export const formatedDate = (inputDate: string): string => {
  const dateObject = new Date(inputDate);

  const formattedDate = dateObject.toLocaleString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return formattedDate;
}
export const formatDateString = (originalString: string): string => {

  const originalDate = new Date(originalString);


  const year = originalDate.getFullYear();
  const month = (originalDate.getMonth() + 1).toString().padStart(2, '0');
  const day = originalDate.getDate().toString().padStart(2, '0');
  const hours = originalDate.getHours().toString().padStart(2, '0');
  const minutes = originalDate.getMinutes().toString().padStart(2, '0');


  const formattedString = `${Number(hours)+7}:${minutes} ${day}-${month}-${year}`;

  return formattedString;
}