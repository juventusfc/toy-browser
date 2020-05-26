const getStyle = require("./utils/getStyle");

function layout(element) {
  if (!element.computedStyle) {
    return;
  }

  let elementStyle = getStyle(element);

  if (elementStyle.display !== "flex") {
    return;
  }

  let items = element.children.filter((e) => e.type === "element");

  ["width", "height"].forEach((size) => {
    if (elementStyle[size] === "auto" || !elementStyle[size]) {
      elementStyle[size] = null;
    }
  });

  ////////// 定义主轴、交叉轴 //////////

  initFlexContainerProps(elementStyle);

  let {
    mainSize,
    mainStart,
    mainEnd,
    mainSign,
    mainBase,
    crossSize,
    crossStart,
    crossEnd,
    crossSign,
    crossBase,
  } = initAlgorithmParams(elementStyle);

  // 父元素没有 mainSize 时，父元素的 mainSize 由其子元素撑开
  let isAutoMainSize = initAutoMainSize(elementStyle, mainSize, items);

  ////////// 收集元素进行  //////////

  let flexLine = [];
  let flexLines = [flexLine];

  let mainSpace = elementStyle[mainSize];
  let crossSpace = 0;

  for (let i = 0; i < items.length; i++) {
    let itemStyle = getStyle(items[i]);

    if (!itemStyle[mainSize]) {
      itemStyle[mainSize] = 0;
    }

    // 子元素的 flex 属性，代表子元素是可伸缩的，肯定能放在当前行。
    // 在这个项目中，只管 `flex-basis`
    if (elementStyle.flexWrap === "nowrap" && isAutoMainSize) {
      mainSpace -= itemStyle[mainSize];
      if (itemStyle[crossSize]) {
        crossSpace = Math.max(crossSpace, itemStyle[crossSize]);
      }
      flexLine.push(item);
    } else if (itemStyle.flex) {
      flexLine.push(item);
    } else {
      if (itemStyle[mainSize] > elementStyle[mainSize]) {
        itemStyle[mainSize] = elementStyle[mainSize];
      }

      // 当前行放不下，另起一行
      if (mainSpace < itemStyle[mainSize]) {
        flexLine.mainSpace = mainSpace;
        flexLine.crossSpace = crossSpace;
        flexLine = [item];
        flexLines.push(flexLine);
        mainSpace = elementStyle[mainSize];
        crossSpace = 0;
      } else {
        flexLine.push(item);
      }
      if (itemStyle[crossSize] !== null && itemStyle[crossSize] !== void 0) {
        crossSpace = Math.max(crossSpace, itemStyle[crossSize]);
      }
      mainSpace -= itemStyle[mainSize];
    }
  }

  flexLine.mainSpace = mainSpace;
  ////////// 收集元素进行 - 结束 //////////
  /**


  // 计算主轴，先将非flex的子元素排好，计算出 mainspace，然后用flex的子元素其填满

  if (elementStyle.flexWrap === "nowrap" || isAutoMainSize) {
    flexLine.crossSpace =
      elementStyle[crossSize] !== undefined ? elementStyle[crossSize] : crossSpace;
  } else {
    flexLine.crossSize = crossSpace;
  }

  if (mainSpace < 0) {
    // overflow
    let scale = elementStyle[mainSize] / (elementStyle[mainSize] - mainSpace);
    let currentMain = mainBase;
    for (let i = 0; i < items.length; i++) {
      let item = items[i];
      let itemStyle = getStyle(item);
      if (itemStyle.flex) {
        itemStyle[mainSize] = 0;
      }

      itemStyle[mainSize] = itemStyle[mainSize] * scale;

      itemStyle[mainStart] = currentMain;

      itemStyle[mainEnd] =
        itemStyle[mainStart] + mainSign * itemStyle[mainSize];
      currentMain = itemStyle[mainEnd];
    }
  } else {
    // process each flex line
    flexLines.forEach(function (items) {
      var mainSpace = items.mainSpace;
      var flexTotal = 0;
      for (let i = 0; i < items.length; i++) {
        var item = items[i];
        var itemStyle = getStyle(item);

        if (itemStyle.flex !== null && itemStyle.flex !== void 0) {
          flexTotal += itemStyle.flex;
          continue;
        }
      }

      if (flexTotal > 0) {
        var currentMain = mainBase;
        for (let i = 0; i < items.length; i++) {
          var item = items[i];
          var itemStyle = getStyle(item);

          if (itemStyle.flex) {
            itemStyle[mainSize] = (mainSpace / flexTotal) * itemStyle.flex;
          }

          itemStyle[mainStart] = currentMain;
          itemStyle[mainEnd] =
            itemStyle[mainStart] + mainSign * itemStyle[mainSize];
          currentMain = itemStyle[mainEnd];
        }
      } else {
        if (elementStyle.justifyContent === "flex-start") {
          var currentMain = mainBase;
          var step = 0;
        }

        if (elementStyle.justifyContent === "flex-end") {
          var currentMain = mainSpace * mainSign + mainBase;
          var step = 0;
        }

        if (elementStyle.justifyContent === "center") {
          var currentMain = (mainSpace / 2) * mainSign + mainBase;
          var step = 0;
        }

        if (elementStyle.justifyContent === "space-between") {
          var step = (mainSpace / (items.length - 1)) * mainSign;
          var currentMain = step / 2 + mainBase;
        }

        if (elementStyle.justifyContent === "space-around") {
          var step = (mainSpace / items.length) * mainSign;
          var currentMain = step / 2 + mainBase;
        }

        for (let i = 0; i < items.length; i++) {
          var item = items[i];
          var itemStyle = getStyle(item);

          itemStyle[(mainStart, currentMain)];
          itemStyle[mainEnd] =
            itemStyle[mainStart] + mainSign * itemStyle[mainSize];
          currentMain = itemStyle[mainEnd] + step;
        }
      }
    });
  }

  var crossSpace;

  if (!elementStyle[crossSize]) {
    crossSpace = 0;
    elementStyle[crossSize] = 0;
    for (let i = 0; i < flexLines.length; i++) {
      elementStyle[crossSize] =
        elementStyle[crossSize] + flexLines[i].crossSpace;
    }
  } else {
    crossSpace = elementStyle[crossSize];
    for (let i = 0; i < flexLines.length; i++) {
      crossSpace -= flexLines[i].crossSpace;
    }
  }

  if (elementStyle.flexWrap === "wrap-reverse") {
    crossBase = elementStyle[crossSize];
  } else {
    crossBase = 0;
  }

  var lineSize = elementStyle[crossSize] / flexLines.length;

  var step;

  if (elementStyle.alignContent === "flex-start") {
    crossBase += 0;
    step = 0;
  }

  if (elementStyle.alignContent === "flex-end") {
    crossBase += crossSign * crossSpace;
    step = 0;
  }

  if (elementStyle.alignContent === "center") {
    crossBase += (crossSign * crossSpace) / 2;
    step = 0;
  }

  if (elementStyle.alignContent === "space-between") {
    crossBase += 0;
    step = crossSpace / (flexLines.length - 1);
  }

  if (elementStyle.alignContent === "space-around") {
    step = crossSpace / flexLines.length;
    crossBase += (crossSign * step) / 2;
  }

  if (elementStyle.alignContent === "stretch") {
    crossBase += 0;
    step = 0;
  }

  flexLines.forEach(function (items) {
    var lineCrossSize =
      elementStyle.alignContent === "stretch"
        ? items.crossSpace + crossSpace / flexLines.length
        : items.crossSpace;

    for (let i = 0; i < items.length; i++) {
      var item = items[i];
      var itemStyle = getStyle(item);

      var align = itemStyle.alignSelf || elementStyle.alignItems;

      if (item === null) {
        itemStyle[crossSize] = align === "stretch" ? lineCrossSize : 0;
      }

      if (align === "flex-start") {
        itemStyle[crossStart] = crossBase;
        itemStyle[crossEnd] =
          itemStyle[crossStart] + crossSign * itemStyle[crossSize];
      }

      if (align === "flex-end") {
        itemStyle[crossStart] = crossBase;
        itemStyle[crossEnd] =
          itemStyle[crossStart] - crossSign * itemStyle[crossSize];
      }

      if (align === "center") {
        itemStyle[crossStart] =
          crossBase + (crossSign * (lineCrossSize - itemStyle[crossSize])) / 2;
        itemStyle[crossEnd] =
          itemStyle[crossStart] + crossSign * itemStyle[crossSize];
      }

      if (align === "stretch") {
        itemStyle[crossStart] = crossBase;
        itemStyle[crossEnd] =
          crossBase +
          crossSign *
            (itemStyle[crossSize] !== null && itemStyle[crossSize] !== void 0)
            ? itemStyle[crossSize]
            : lineCrossSize;

        itemStyle[crossSize] =
          crossSign * (itemStyle[crossEnd] - itemStyle[crossStart]);
      }
    }
    crossBase += crossSign * (lineCrossSize + step);
  });
  */
}

// 父元素没有 mainSize 时，父元素的 mainSize 由其子元素撑开
function initAutoMainSize(elementStyle, mainSize, items) {
  let isAutoMainSize = false;
  if (!elementStyle[mainSize]) {
    elementStyle[mainSize] = 0;
    for (let i = 0; i < items.length; i++) {
      let itemStyle = getStyle(items[i]);
      if (itemStyle[mainSize]) {
        elementStyle[mainSize] += itemStyle[mainSize];
      }
    }
    isAutoMainSize = true;
  }
  return isAutoMainSize;
}

function initAlgorithmParams(elementStyle) {
  let mainSize, // flex item 占据的主轴空间
    mainStart, // 主轴开始位置
    mainEnd, // 主轴结束位置
    mainSign, // 沿着主轴的方向
    mainBase,
    crossSize,
    crossStart,
    crossEnd,
    crossSign,
    crossBase;
  if (elementStyle.flexDirection === "row") {
    mainSize = "width";
    mainStart = "left";
    mainEnd = "right";
    mainSign = +1;
    mainBase = 0;
    crossSize = "height";
    crossStart = "top";
    crossEnd = "bottom";
  } else if (elementStyle.flexDirection === "row-reverse") {
    mainSize = "width";
    mainStart = "right";
    mainEnd = "left";
    mainSign = -1;
    mainBase = elementStyle.width;
    crossSize = "height";
    crossStart = "top";
    crossEnd = "bottom";
  } else if (elementStyle.flexDirection === "column") {
    mainSize = "height";
    mainStart = "top";
    mainEnd = "bottom";
    mainSign = +1;
    mainBase = 0;
    crossSize = "width";
    crossStart = "left";
    crossEnd = "right";
  } else if (elementStyle.flexDirection === "column-reverse") {
    mainSize = "height";
    mainStart = "bottom";
    mainEnd = "top";
    mainSign = -1;
    mainBase = elementStyle.height;
    crossSize = "width";
    crossStart = "left";
    crossEnd = "right";
  }

  if (elementStyle.flexWrap === "wrap-reverse") {
    let tmp = crossStart;
    crossStart = crossEnd;
    crossEnd = tmp;
    crossSign = -1;

    // crossBase 还没计算，会在其他地方计算
  } else {
    crossSign = +1;
    crossBase = 0;
  }

  return {
    mainSize,
    mainStart,
    mainEnd,
    mainSign,
    mainBase,
    crossSize,
    crossStart,
    crossEnd,
    crossSign,
    crossBase,
  };
}

function initFlexContainerProps(elementStyle) {
  if (!elementStyle.flexDirection || elementStyle.flexDirection === "auto") {
    elementStyle.flexDirection = "row";
  }
  if (!elementStyle.flexWrap || elementStyle.flexWrap === "auto") {
    elementStyle.flexWrap = "nowrap";
  }
  if (!elementStyle.justifyContent || elementStyle.justifyContent === "auto") {
    elementStyle.justifyContent = "flex-start";
  }
  if (!elementStyle.alignItems || elementStyle.alignItems === "auto") {
    elementStyle.alignItems = "stretch";
  }
  if (!elementStyle.alignContent || elementStyle.alignContent === "auto") {
    elementStyle.alignContent = "stretch";
  }
}

module.exports = layout;
