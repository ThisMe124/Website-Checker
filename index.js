import express from 'express'
import isUp from 'is-up'
import bodyparser from 'body-parser'
import isReachable from 'is-reachable'
import { bahasa_planet } from 'bahasa-planet'
import dns from 'dns'
import axios from 'axios'
const PORT = 9000;
const app = express();
app.set("view engine", "ejs")
app.use(bodyparser.urlencoded({
   extended: false
}));
app.use(bodyparser.json());
app.set('json spaces', 2)

const isUrl = (url) => {
    return url.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/, 'gi'))
}

//Check Domain Is Available Or Not To Buy Or Register
app.get("/check_domain", async (req, res) => {
  var url = req.query.domain
  if (!url) return res.status(400).json({
        status: false,
        message: "Enter domain parameters"
    })
 try {
   var result = await axios.get(`https://cdntelegf.vercel.app/checkdomain?domain=${url}`)
   res.status(200).json({ info: "Check Domain Is Available Or Not To Buy Or Register", github: "https://github.com/ThisMe124/Website-Checker", result })
 } catch(e) {
   res.status(400).json({ status: "error", message: "Error From Server Bro...", info: e.message })
 }
});

//Web Check API V1
app.get("/webcheck", async (req, res) => {
  var url = req.query.domain
  if (!url) return res.status(400).json({
        status: false,
        message: "Enter domain parameters"
    })
    if (!isUrl(url)) return res.status(400).json({
        status: false,
        message: "Please enter url"
    })
   var statusResult = await isUp(url);
   if (statusResult) {
      res.json({
         domain: url,
         status: "Site is Running (200) OK",
         github: "https://github.com/ThisMe124/Website-Checker"
      });
   } else {
      res.json({
         domain: url,
         status: "Site is Down (500) Not OK",
         github: "https://github.com/ThisMe124/Website-Checker"
      });
   }
});

//Web Check API V2 (Recommended)
app.get("/webcheck2", async (req,res) => {
  var url = req.query.domain
  if (!url) return res.status(400).json({
        status: false,
        message: "Enter domain parameters"
    })
  var resp = await isReachable(url)
  var wdoh = await isReachable(url)
  if (resp === true) {
   resp = "Site is Running (200) OK"
   } else if (resp === false) {
   resp = "Site is Down (500) Not OK"
   } 
   res.json({ 
        domain: url, 
        status: resp,
        status_web: wdoh,
        github: "https://github.com/ThisMe124/Website-Checker",
        message: `Recommended Used`
    })
})

app.get("/isavailable", async (req,res) => {
  var url = req.query.domain
  if (!url) return res.status(400).json({
        status: false,
        message: "Enter domain parameters"
    })
  var resp = await checkDomain(url)
  var wdoh = await checkDomain(url)
  if (resp === true) {
   resp = "available"
   } else if (resp === false) {
   resp = "unavailable"
   } 
   res.json({ 
        domain: url, 
        status: resp,
        status_web: wdoh,
        github: "https://github.com/ThisMe124/Website-Checker",
        message: `Recommended Used`
    })
})


// Bonus Hehe :)
app.get("/bahasa/planet", async(req, res) => {
try {
var text = req.query.text
var alias = req.query.alias
if (!text) return res.status(400).json({
status: false,
message: "Enter text parameters"
})
if (!alias) return res.status(400).json({
status: false,
message: "Enter alias parameters"
})
let pop = bahasa_planet(text, alias)
res.json({ result: pop })
} catch(err) {
res.json({ info: err.message })
}
})

app.get("/", async (req,res) => {
   res.json({
   result: "200 OK",
   github: "https://github.com/ThisMe124/Website-Checker"
   })
})

app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.status(500).send('Something broke!')
})


async function checkDomain(domain) {
  return new Promise((resolve, reject) => {
    dns.resolve(domain, (err) => {
      if (err) {
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
}

app.listen(PORT, () => {
   console.log(`App is listening on Port ${PORT}`);
});
