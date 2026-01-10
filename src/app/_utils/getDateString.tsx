export function getDateString (createDateUTC: string) {
  const date = new Date(createDateUTC);
  return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
};
