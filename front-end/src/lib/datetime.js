export function formatDate(datestring) {
  const date = new Date(datestring);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const formattedDate = `${day}/${month}/${year}`;
  return formattedDate;
}

export function formatDatetime(datestring) {
  const datetime = new Date(datestring);
  datetime.setHours(datetime.getHours() - 7);
  const hour = String(datetime.getHours()).padStart(2, "0");
  const minute = String(datetime.getMinutes()).padStart(2, "0");
  const day = String(datetime.getDate()).padStart(2, "0");
  const month = String(datetime.getMonth() + 1).padStart(2, "0");
  const year = datetime.getFullYear();
  const formattedDate = `${hour}:${minute} ${day}/${month}/${year}`;
  return formattedDate;
}
