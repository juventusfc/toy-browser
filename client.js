// 在 net 包的基础上实现 HTTP
const net = require("net");
const parser = require("./parser");

class Request {
  constructor(options) {
    this.method = options.method || "GET";
    this.host = options.host;
    this.path = options.path || "/";
    this.port = options.port || 80;
    this.body = options.body || {};
    this.headers = options.headers || {};

    if (!this.headers["Content-Type"]) {
      this.headers["Content-Type"] = "application/x-www-form-urlencoded";
    }

    if (this.headers["Content-Type"] === "application/json") {
      this.bodyText = JSON.stringify(this.body);
    } else if (
      this.headers["Content-Type"] === "application/x-www-form-urlencoded"
    ) {
      this.bodyText = Object.keys(this.body)
        .map((key) => `${key}=${encodeURIComponent(this.body[key])}`)
        .join("&");
    }

    this.headers["Content-Length"] = this.bodyText.length;
  }

  toString() {
    return `${this.method} ${this.path} HTTP/1.1\r\n${Object.keys(this.headers)
      .map((key) => `${key}: ${this.headers[key]}`)
      .join("\r\n")}\r\n\r\n${this.bodyText}`;
  }

  send(connection) {
    return new Promise((resolve, reject) => {
      if (connection) {
        connection.write(this.toString());
      } else {
        connection = net.createConnection(
          {
            host: this.host,
            port: this.port,
          },
          () => {
            connection.write(this.toString());
          }
        );
      }

      const responseParser = new ResponseParser();

      connection.on("data", (data) => {
        // 由于 TCP 是流式传输，我们压根不知道 data 是不是一个完整的返回。也就是说， onData 事件可能发生多次。
        // 所以每次触发新的 onData 事件，就将返回的 data 数据流喂给状态机。
        responseParser.receive(data.toString());
        if (responseParser.isFinished) {
          resolve(responseParser.response);
        }
        connection.end();
      });

      connection.on("end", () => {
        console.log("disconnected from server");
      });

      connection.on("error", (err) => {
        reject(err);
        connection.end();
      });
    });
  }
}

class ResponseParser {
  constructor() {
    this.WAITING_STATUS_LINE = 0;
    this.WAITING_STATUS_LINE_END = 1;
    this.WAITING_HEADER_NAME = 2;
    this.WAITING_HEADER_SPACE = 3;
    this.WAITING_HEADER_VALUE = 4;
    this.WAITING_HEADER_LINE_END = 5;
    this.WAITING_HEADER_BLOCK_END = 6;
    this.WAITING_BODY = 7;

    this.currentState = this.WAITING_STATUS_LINE;

    this.statusLine = "";
    this.headers = {};
    this.headerName = "";
    this.headerValue = "";

    this.bodyParser = null;
  }

  get isFinished() {
    return this.bodyParser && this.bodyParser.isFinished;
  }

  get response() {
    this.statusLine.match(/HTTP\/1.1 ([0-9]+) ([\s\S]+)/);
    return {
      statusCode: RegExp.$1,
      statusText: RegExp.$2,
      headers: this.headers,
      body: this.bodyParser.content.join(""),
    };
  }

  receive(string) {
    for (let i = 0; i < string.length; i++) {
      this.receiveChar(string.charAt(i));
    }
  }
  receiveChar(char) {
    if (this.currentState === this.WAITING_STATUS_LINE) {
      if (char === "\r") {
        this.currentState = this.WAITING_STATUS_LINE_END;
      } else {
        this.statusLine += char;
      }
    } else if (this.currentState === this.WAITING_STATUS_LINE_END) {
      if (char === "\n") {
        this.currentState = this.WAITING_HEADER_NAME;
      }
    } else if (this.currentState === this.WAITING_HEADER_NAME) {
      if (char === ":") {
        this.currentState = this.WAITING_HEADER_SPACE;
      } else if (char === "\r") {
        this.currentState = this.WAITING_HEADER_BLOCK_END;
        if (this.headers["Transfer-Encoding"] === "chunked") {
          this.bodyParser = new TrunkedBodyParser();
        }
      } else {
        this.headerName += char;
      }
    } else if (this.currentState === this.WAITING_HEADER_SPACE) {
      if (char === " ") {
        this.currentState = this.WAITING_HEADER_VALUE;
      }
    } else if (this.currentState === this.WAITING_HEADER_VALUE) {
      if (char === "\r") {
        this.currentState = this.WAITING_HEADER_LINE_END;
        this.headers[this.headerName] = this.headerValue;
        this.headerName = "";
        this.headerValue = "";
      } else {
        this.headerValue += char;
      }
    } else if (this.currentState === this.WAITING_HEADER_LINE_END) {
      if (char === "\n") {
        this.currentState = this.WAITING_HEADER_NAME;
      }
    } else if (this.currentState === this.WAITING_HEADER_BLOCK_END) {
      if (char === "\n") {
        this.currentState = this.WAITING_BODY;
      }
    } else if (this.currentState === this.WAITING_BODY) {
      // 查看 \r \n 等
      // console.log(JSON.stringify(char));
      this.bodyParser.receiveChar(char);
    }
  }
}

class TrunkedBodyParser {
  constructor() {
    this.WAITING_LENGTH = 0;
    this.WAITING_LENGTH_LINE_END = 1;
    this.READING_TRUNK = 2;
    this.WAITING_NEW_LINE = 3;
    this.WAITING_NEW_LINE_END = 4;

    this.currentState = this.WAITING_LENGTH;

    this.length = 0;
    this.content = [];
    this.isFinished = false;
  }
  receiveChar(char) {
    if (this.isFinished) {
      return;
    }

    if (this.currentState === this.WAITING_LENGTH) {
      if (char === "\r") {
        if (this.length === 0) {
          this.isFinished = true;
        }
        this.currentState = this.WAITING_LENGTH_LINE_END;
      } else {
        this.length *= 16;
        this.length += parseInt(char, 16);
      }
    } else if (this.currentState === this.WAITING_LENGTH_LINE_END) {
      if (char === "\n") {
        this.currentState = this.READING_TRUNK;
      }
    } else if (this.currentState === this.READING_TRUNK) {
      this.content.push(char);
      this.length--;
      if (this.length === 0) {
        this.currentState = this.WAITING_NEW_LINE;
      }
    } else if (this.currentState === this.WAITING_NEW_LINE) {
      if (char === "\r") {
        this.currentState = this.WAITING_NEW_LINE_END;
      }
    } else if (this.currentState === this.WAITING_NEW_LINE_END) {
      if (char === "\n") {
        this.currentState = this.WAITING_LENGTH;
      }
    }
  }
}

void (async function () {
  const request = new Request({
    method: "POST",
    host: "127.0.0.1",
    path: "/",
    port: 8088,
    body: {
      name: "winter",
    },
  });
  const response = await request.send();

  let dom = parser.parseHTML(response.body);
})();
