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

## parse

[HTML 标准](https://html.spec.whatwg.org/multipage/parsing.html#tokenization)

## CSS computing

## layout

## render
