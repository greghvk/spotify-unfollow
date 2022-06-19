const express = require('express');

const app = express();

const port = process.env.PORT || 1234;
app.use(express.static("public"));

app.use("/public", express.static(__dirname + "/public"))
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
})
app.listen(port, () => console.log(`serving at port ${port}`));

