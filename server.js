const express = require("express")
const app = express()
const jwt = require("jsonwebtoken")

app.set("view engine", "ejs")
app.use(express.urlencoded({ extended:true}))
app.use(express.json)


const Books = [
    {
        id: 1,
        BookName: "PHP 8",
        YearPublished: "2023",
        Author: "VicS",
        Category: "Web",
        status: 1,
    },
    {
        id: 2,
        BookName: "React.js",
        YearPublished: "2000",
        Author: "Peter SMith",
        Category: "Web",
        status: 1,
    },
    {
        id: 3,
        BookName: "CSS framework",
        YearPublished: "2005",
        Author: "Jaguar",
        Category: "Web",
        status: 1,
    },
    {
        id: 4,
        BookName: "Data Science",
        YearPublished: "2023",
        Author: "Vic S",
        Category: "Data",
        status: 1,
    },
]

//test parameters dynamic
app.get('/test/:bookname/:yearpublished/:category', (req, res)=>{
    let book = req.params.BookName;
    let year = req.params.YearPublished;
    let cat = req.params.Category;
    res.send("we have received the following " + book + "  " + year + "  " + cat);
})


//function to generate token
const generateAccessToken = (user) => {
    return jwt.sign( { id: user.id, isAdmin: user.isAdmin }, "ThisMYsecretKey", {expiresIn : '1000s'})
}

const generateAccessTokenLogout = (user) => {
    return jwt.sign( { id: user.id, isAdmin: user.isAdmin }, "ThisMYsecretKey", {expiresIn : '1s'})
}

const LoginProfiles = [

    {
        id: 1,
        username: "admin",
        password: "passwd123",
        isAdmin: true,
    },
    {
        id: 2,
        username: "staff",
        password: "123456",
        isAdmin: false,
    },
    {
        id: 3,
        username: "vice",
        password: "abrakadabra",
        isAdmin: false,
    },
{
        id: 4,
        username: "super",
        password: "69843",
        isAdmin: true,
    },
{
        id: 5,
        username: "user",
        password: "123",
        isAdmin: false,
    }
];

//endpoint for the login
app.post('/login', (req, res)=>{

    console.log('check here: ' + req.params.username + "  " + req.params.password);

    const { username, password } = req.body;
    
    const user = LoginProfiles.find((u) => {
        return u.username === username && u.password === password;
        });

    if(user){

    const accessToken = generateAccessToken(user);
 
        res.json({
            username: user.username,
            isAdmin: user.isAdmin,
            accessToken: accessToken,
        }); 

    } else {
    res.status(400).json("Username or Password incorrect"); 
    }

})

//middleware for security
const verify = (req, res, next)=>{

    const autHeader = req.headers.authorization;  
     console.log('check token here:  ' + req.headers.authorization);
  
      if(autHeader){
          const token = autHeader.split(" ")[1];
  
          jwt.verify(token, "MySecretKey", (err, user) => {
              if(err){
                   return res.status(403).json("token is not valid")   
              }
              req.user = user;
              next();
          })
  
      } else {
          return res.status(403).json("You are not authenticated")   
      }   
  }


  //test
app.get('/test', verify, (req, res)=>{
    res.send('Hi')
})

//logout
app.post('/api/logout', verify, (req, res)=>{
    const logoutToken = generateAccessTokenLogout(req.user);
})


app.get('/user/:Id', verify, (req, res)=>{

    console.log('test :'+ req.params.Id);

       const userP = userProfile.find( (u) => {
            return parseInt(u.id) === parseInt(req.params.Id);
        });

        if(userP){
            res.json(userP);
        } else {
            res.status(400).json("Invalid User ID"); 
        }
})




app.listen(4000)
console.log("server is running in port 4000")
