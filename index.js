const express = require('express');

const app = express();

const port = process.env.PORT || 1234;
app.listen(port, () => console.log(`serving at port ${port}`));
app.use(express.static("public"));
