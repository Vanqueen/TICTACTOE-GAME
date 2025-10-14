// session.js

const session = require("express-session");
const MongoStore = require("connect-mongodb-session")(session);

console.log(process.env.MONGODB_URI + "/" + process.env.APP_DB,);

const store = new MongoStore({
  uri: process.env.MONGODB_URI + "/" + process.env.APP_DB,
  collection: "sessions",
  idField: "sessionId",
});

// Gérer les erreurs de connexion au store
store.on("error", function (error) {
  console.log("session store error: ", error);
});

const sessionConfig = session({
  secret: process.env.APP_TOKEN,
  cookie: {
    secure: process.env.NODE_ENV === "production" ? true : false,
    httpOnly: process.env.NODE_ENV === "production" ? true : false,
    domain: process.env.API_URL,
    maxAge: 60 * 60 * 24 * 1000, // Durée de vie du cookie de session en millisecondes :: 
  },
  store: store,
  resave: false, // ne sauvegarde pas la session si elle n'est pas modifiée
  saveUninitialized: false, // ne crée pas de session tant que quelque chose n'est pas stocké
});

// store.on('expired', function (err, session) {
//   axios.post('')
// })


module.exports = { store, sessionConfig };
