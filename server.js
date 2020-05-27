const http = require("http");

const server = http.createServer((req, res) => {
  console.log(new Date() + " request received");
  res.setHeader("Content-Type", "text/html");
  res.setHeader("X-Foo", "bar");
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end(
    `<html maaa=a>

    <head>
        <style>
            .outer {
                width: 400px;
                height: 400px;
                background-color: rgb(255,255,255);
                display: flex;
            }
    
            .left {
                flex: 1;
                background-color: rgb(199,199,199);
    
            }
    
            .center {
                width: 100px;
                background-color: rgb(1,222,222);
    
            }
    
            .right {
                flex: 2;
                background-color: rgb(111,1,111);
    
            }
        </style>
    </head>
    
    <body>
        <div class='outer'>
            <div class="left"> </div>
            <div class="center"> </div>
    
            <div class="right"></div>
        </div>
    </body>
    
    </html>`
  );
});

server.listen(8088);
