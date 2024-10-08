//app.js
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

// Connecter à MongoDB
mongoose.connect('mongodb://localhost:27017/test', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Connected to MongoDB");
}).catch(err => {
    console.error("Error connecting to MongoDB", err);
});

var express = require("express");
const path = require('path');

var app = express();
const router = express.Router();

app.use(express.json()); // Used to parse JSON bodies
app.use(express.urlencoded({ extended: true })); //Parse URL-encoded bodies

app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));

router.get("/", function (req, res) {
    res.render('index');
});

router.get("/register", function (req, res) {
    res.render('register');
});

const User = require('/Users/chaou/Desktop/TP_2_Authentication_amp_Access_Control-20241008/simpleAuth/models/userModel'); // Importer le modèle utilisateur

app.post('/register', async function (req, res) {
    try {
        console.log(req.body);
        console.log("Nom d'utilisateur :", req.body.username);
        // 1- Récupérer les données du formulaire
        const { username, email, password, role } = req.body;

        // Vérifiez si tous les champs sont fournis
        if (!username || !email || !password) {
            return res.status(400).send("Tous les champs sont requis !");
        }

        // Vérifier si l'utilisateur existe déjà
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).send("Un utilisateur avec ce nom d'utilisateur ou cet email existe déjà.");
        }

        // 2- Créer un nouvel utilisateur avec les données récupérées
        const newUser = new User({ username, email, password, role });

        // 3- Sauvegarder l'utilisateur dans la base de données MongoDB
        await newUser.save();

        console.log("Utilisateur enregistré avec succès :", newUser);

        // 4- Rediriger vers la page de connexion après l'inscription
        res.render('login');
    } catch (err) {
        console.error("Erreur lors de l'inscription de l'utilisateur :", err);
        if (err.code === 11000) {
            // Erreur de clé dupliquée
            res.status(400).send("Ce nom d'utilisateur ou cet email est déjà utilisé.");
        } else {
            res.status(500).send("Erreur lors de l'inscription");
        }
    }
});

//Showing login form
router.get("/login", function (req, res) {
    res.render('login');
});

app.post('/login', function(req, res){
    //1- get data 
    console.log(req.body);
    
    //2- authenticate user 

    //3- if success redirect to home page 
    //res.render('home');

});

app.use('/', router);

var port = process.env.PORT || 9000;

app.listen(port, function () {
    console.log("Server Has Started! port: ", port);
});
