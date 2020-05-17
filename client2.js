// 在 net 包的基础上实现 HTTP
const net = require("net");

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

      connection.on("data", (data) => {
        resolve(data.toString());
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

class Response {}

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
  console.log(response);
})();
