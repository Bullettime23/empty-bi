function formatNum(v, m) {
  if (typeof v === 'string') return v;
  if (isNaN(v)) return '-';
  if (m && m.config && m.config.format) {
    return window.parent.formatNumberWithString(v, m.config.format);
  }
  return (Math.floor(v * 100) / 100).toString().replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1 ");
}

function checkElementOutOfBounds(e, parentSelector) {
  var p = $(e).closest(parentSelector)[0];
  if (!p) return false;
  var b = e.getBoundingClientRect(), pb = p.getBoundingClientRect();
  if (b.x < pb.x) return true;
  if (b.y < pb.y) return true;
  if (pb.x + pb.width < b.x + b.width) return true;
  if (pb.y + pb.height < b.y + b.height) return true;
  return false;
}

// Запустится сразу, body еще не доступен
(function globalInit() {
// Добавляем <link> с текущей темой
  var theme = document.location.href.match(/theme=(\w+)/) ? RegExp.$1 : 'dark';
  var ts = new Date().valueOf();
  var link = document.createElement('link');
  link.setAttribute('href', theme + '.css?ts=' + ts);
  link.setAttribute('rel', 'stylesheet');
  document.getElementsByTagName('head')[0].appendChild(link);
  document.getElementsByTagName('html')[0].className = theme;
})();

var twCanvas;

function getTextWidth(text, fontSize) {
  if (!twCanvas) {
    twCanvas = document.createElement('canvas');
  }
  var ctx = twCanvas.getContext("2d");
  ctx.font = fontSize + " Arial";
  return ctx.measureText(text).width;
}
