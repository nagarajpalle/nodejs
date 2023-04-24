require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();


app.use(express.json());

let refreshTokens = [];
//app.use(bodyParser);

//Registratiom

//Login
app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username === "raj" && password === "123456") {
    const access_token = jwt.sign({ sub: username },process.env.JWT_ACCESS_SECRETE,{ expiresIn: process.env.JWT_ACCESS_TIME });
    const refresh_token = GenerateRefreshToken(username);
    return res.json({status: true,message: "Login Success",data: { access_token, refresh_token }});
  } 

  return res.status(401).json({status : false, message: "login failed"})
});

app.post("/token", verifyRefreshToken, (req, res) => {
  const username = req.userData.sub;
  const access_token = jwt.sign({ sub: username },process.env.JWT_ACCESS_SECRETE,{ expiresIn: process.env.JWT_ACCESS_TIME });
  const refresh_token = GenerateRefreshToken(username);
  return res.json({status: true,message: "Login Success",data: { access_token, refresh_token }});
});
//dashboard

app.get("/dashboard", verifyToken, (req, res) => {
  return res.json({ status: true, message: "hello from dashboard" });
});

app.get("/logout", verifyToken, (req, res) => {
   const username = req.userData.sub;

   //remove refresh tokens 
   refreshTokens = refreshTokens.filter(x => x.username !== username);
   return res.json({ status: true, message: "success" });
 });

//custom middleware
function verifyToken(req, res, next) {
  try {
    // bearer tokenstring
    const token = req.headers.authorization.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRETE);
    req.userData = decoded;
    next();
  } catch (error) {
    return res.status(401).json({status: false,message: "your session is not valid ...",data: error});
  }
}

function verifyRefreshToken(req, res, next) {
  const token = req.body.token;

  if (token === null) return res.status(401).json({ status: false, message: "invalid request" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRETE);
    req.userData = decoded;
    
    //verify if token is store or not
    let storedRefreshToken = refreshTokens.find((x) => x.username === decoded.sub);
    if (storedRefreshToken === undefined) return res.status(401).json({ status: false, message: "refresh token not in database" });
    if (storedRefreshToken.token != token) return res.status(401).json({ status: false, message: "refresh token not same in database" });
    next();
  
   } catch (error) {
    return res.status(401).json({status: true,message: "your session is not valid ...",data: error});
  }
}

function GenerateRefreshToken(username) {
  const refresh_token = jwt.sign({ sub: username },process.env.JWT_REFRESH_SECRETE,{ expiresIn: process.env.JWT_REFRESH_TIME });
  
  let storedRefreshToken = refreshTokens.find((x) => x.username === username);
  if (storedRefreshToken === undefined) {
     //add it
    refreshTokens.push({
      username: username,
      token: refresh_token,
    });
  
   } else {
   //update it 
    refreshTokens[refreshTokens.findIndex(x => x.username === username)].token = refresh_token;
  }
  return refresh_token;
}
app.get("/", function (req, res) {
  res.send([
    {
      "product-name": "MEN'S BETTER THAN NAKED&trade; JACKET",
      "product-image-url":
        "http://images.thenorthface.com/is/image/TheNorthFace/236x204_CLR/mens-better-than-naked-jacket-AVMH_LC9_hero.png",
      "header-top-right-text": "Shop All",
      "header-top-left-text": "Men's",
      "product-url":
        "http://www.thenorthface.com/catalog/sc-gear/men-39-s-better-than-naked-8482-jacket.html",
      "header-top-right-url": "http://www.thenorthface.com/en_US/shop-mens/",
      "product-cta-text": "Shop Now",
    },
  ]);
});

app.listen("3002", () => {
  console.log("app is listning port 3002 !");
});
