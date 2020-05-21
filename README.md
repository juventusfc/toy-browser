# 玩具浏览器

该项目用于开发一款玩具浏览器。

![总体流程](./images/browser-process.png)

## HTTP

[rfc2616 标准](https://tools.ietf.org/html/rfc2616#section-6)

该标准中，用 `\r\n`表示 `CRLF`。在使用老式的机械打字机时，如果你想在下一行最左端开始继续打印，需要做两个动作：

1. CR: `\r`，先把机头重新推回最左侧，回到行首，这就是回车。
2. LF: `\n`，但是他还没有换行，然后再按一下换行键，使他往下移动一行，代表换行。

计算机刚产生的时候，主要还是文字界面，受打字机影响，也就有了这两个特殊字符。

### Request

```text
Request = Request-Line
          *(( general-header
            | request-header
            | entity-header ) CRLF)
          CRLF
          [ message-body ]
```

![request-example](./images/request.png)

### Response

![response-example](./images/response.png)

## Parse

[HTML 标准](https://html.spec.whatwg.org/multipage/parsing.html#tokenization)

生成 DOM 树：

1. 使用状态机生成各个 token
2. 将 token 赋给 element
3. 将 element 放入 stack 中

## CSS Computing

浏览器中，都是先收集到所有的 CSS 规则，然后再应用给 DOM。如果之后 CSS 规则变了，很可能会引起 CSS 规则重新计算，然后重新再应用给 DOM，进而引起重排和重绘。

将 CSS 挂载到 DOM 树上:

1. 收集 CSS 规则

   遇到 `</style>` 时， 将栈顶 children 中的 TextNode 中的 content 加到 CSS 规则里

2. 添加调用

   在生成一个新的 element 的时候，立即添加生成 CSS

3. 获取父元素序列
4. 拆分选择器
5. 计算选择器与元素的匹配关系
6. 在 element 上生成 computedStyle 属性
7. 确定规则覆盖关系

## Layout

## Render
