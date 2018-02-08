function extend(target) {
  var sources = Array.prototype.slice.call(arguments, 1);

  for (var i = 0; i < sources.length; i += 1) {
    var source = sources[i];
    for (var key in source) {
      if (source.hasOwnProperty(key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
}

function formatNumber(n) {
  n = n.toString();
  return n[1] ? n : '0' + n;
}

function formatTime(datetime) {
  let hour = datetime.getHours();
  let minute = datetime.getMinutes();
  return [hour, minute].map(formatNumber).join(':');
}

function formatDate(datetime) {
  let year = datetime.getFullYear();
  let month = datetime.getMonth() + 1;
  let day = datetime.getDate();
  return [year, month, day].map(formatNumber).join('-');
}

function formatDatetime(datetime) {
  return formatDate(datetime) + ' ' + formatTime(datetime);
}

module.exports = {
  extend: extend,
  formatTime: formatTime,
  formatDate: formatDate,
  formatDatetime: formatDatetime
};
