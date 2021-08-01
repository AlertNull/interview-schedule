function formatDate(date) {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  return `${month}/${day} ${hour}:${minute}`
}

module.exports = {
  formatDate
}