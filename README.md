# 玩具浏览器

该项目用于开发一款玩具浏览器。

![总体流程](./images/browser-process.png)

## HTTP

[rfc2616 标准](https://tools.ietf.org/html/rfc2616#section-6)

在使用老式的机械打字机时，如果你想在下一行最左端开始继续打印，需要做两个动作：

1. 先把机头重新推回最左侧，这就是回车
2. 但是他还没有换行，然后再按一下换行键，这样才到下一行。

计算机刚产生的时候，主要还是文字界面，受打字机影响，也就有了这两个特殊字符。标准中，用 `\r\n`表示 CRLF：

- CR: `\r`，回到行首，代表回车
- LF: `\n`，往下移动一行，代表换行

### Request

```text
Request = Request-Line
          *(( general-header
            | request-header
            | entity-header ) CRLF)
          CRLF
          [ message-body ]
```

举个例子：

```text
POST / HTTP/1.1
X-Foo2: customed
Content-Type: application/x-www-form-urlencoded
Content-Length: 18

name=winter&age=18

```

### Response

```text
HTTP/1.1 200 OK
Content-Type: text/plain
X-Foo: bar
Date: Fri, 15 May 2020 06:20:07 GMT
Connection: keep-alive
Transfer-Encoding: chunked

2
ok
0
```

## parse

[HTML 标准](https://html.spec.whatwg.org/multipage/parsing.html#tokenization)

## CSS computing

## layout

## render
