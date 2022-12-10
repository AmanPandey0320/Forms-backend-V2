const express = require("express");
const http = require("http");
require("dotenv").config();
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const server = http.createServer(app);
const port = process.env.PORT;

app.use(express.json());
app.use(cookieParser());

const corsOptions = {
  origin: [
    "http://localhost:3000",
    "https://akp-forms-app.web.app",
    "https://forms-admin-c7e0b.web.app",
  ],
  optionsSuccessStatus: 200, // For legacy browser support
  credentials: true,
};

app.use(async function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );

  next();
});

app.use(cors(corsOptions));
app.use("/admin", require("./Routes/index"));
app.use("/api", require("./api/router"));
app.use("/gql", require("./gql-api/routes"));

server.listen(port, () =>
  {console.log(`Example app listening on port ${port}!`);
  console.log(process.env)}
);
