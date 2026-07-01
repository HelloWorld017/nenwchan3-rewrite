export const formatDateYearMonth = (date: Date | number) => {
  const dateObject = new Date(date);
  const year = dateObject.getFullYear();
  const month = (dateObject.getMonth() + 1).toString().padStart(2, '0');
  return `${year}. ${month}`;
};
