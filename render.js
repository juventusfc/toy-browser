const images = require("images");

function render(viewport, element) {
  if (element.style) {
    var img = images(element.style.width, element.style.height);

    if (element.style["background-color"]) {
      let color = element.style["background-color"];
      const result = color.match(/rgb\((\d+),(\d+),(\d+)/);
      img.fill(Number(result[1]), Number(result[2]), Number(result[3]), 1);
      viewport.draw(img, element.style.left || 0, element.style.top || 0);
    }
  }

  if (element.children) {
    for (let child of element.children) {
      render(viewport, child);
    }
  }
}

module.exports = render;
