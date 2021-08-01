function formatDate(date) {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  let minute = date.getMinutes();
  if (minute < 10) {
    minute = `0${minute}`;
  }
  return `${month}/${day} ${hour}:${minute}`
}

module.exports = {
  formatDate
}