//Source Ori From https://codingshiksha.com/javascript/node-js-express-bulk-website-url-up-down-status-checker-using-is-up-library-full-project-for-beginners/
//Recode By Me :)

import express from 'express'
import isUp from 'is-up'
import bodyparser from 'body-parser'
const PORT = 9000;
const app = express();
app.set("view engine", "ejs")
app.use(bodyparser.urlencoded({
   extended: false
}));
app.use(bodyparser.json());
app.set('json spaces', 2)

//Is Url Valid Or Not Module
const isUrl = (url) => {
    return url.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/, 'gi'))
}

//Web Checker API
app.get("/webcheck", async (req, res) => {
  var url = req.query.domain
  if (!url) return res.status(400).json({
        status: false,
        message: "Enter domain parameters"
    })
    if (!isUrl(url)) return res.status(400).json({
        status: false,
        message: "Please enter a valid url"
    })
   var statusResult = await isUp(url);
   if (statusResult) {
      res.json({
         domain: url,
         status: "Site is Running (200) OK"
      });
   } else {
      res.json({
         domain: url,
         status: "Site is Down (500) Not OK"
      });
   }
});

app.get("/", async (req,res) => {
   res.send("200 OK")
})

app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.status(500).send('Something broke!')
})

app.listen(PORT, () => {
   console.log(`App is listening on Port ${PORT}`);
});
