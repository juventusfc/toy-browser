function getStyle(element) {
  if (!element.style) {
    element.style = {};
  }

  for (let prop in element.computedStyle) {
    element.style[prop] = element.computedStyle[prop].value;

    if (element.style[prop].toString().match(/px$/)) {
      element.style[prop] = parseInt(element.style[prop]);
    }

    if (element.style[prop].toString().match(/^[0-9\.]+$/)) {
      element.style[prop] = parseInt(element.style[prop]);
    }
  }

  return element.style;
}

module.exports = getStyle;
