const express = require("express");
const path = require("path");
const cors = require("cors");

const app = express();
app.use(cors());
app.options('*')

app.use("/static", express.static(path.resolve(__dirname, "static")))

app.get("/*", (req,res) => {
   res.sendFile(path.resolve(__dirname, "index.html"));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=> console.log("Server running on port:" + PORT));