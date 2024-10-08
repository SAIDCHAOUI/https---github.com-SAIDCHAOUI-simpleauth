// app.js

const express = require("express");
const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');
const { grantAccess } = require('/Users/chaou/Desktop/TP_2_Authentication_amp_Access_Control-20241008/simpleAuth/config/middleware');
const userController = require('/Users/chaou/Desktop/TP_2_Authentication_amp_Access_Control-20241008/simpleAuth/config/userController');
const User = require('/Users/chaou/Desktop/TP_2_Authentication_amp_Access_Control-20241008/simpleAuth/models/userModel'); // Importer le modèle utilisateur
const router = express.Router();

const app = express();
// Définir le moteur de vue
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); 


// Configuration de la session
app.use(session({
    secret: 'clé_secrète_de_session', 
    resave: false,
    saveUninitialized: false
}));

// Connecter à MongoDB
mongoose.set('strictQuery', false);
mongoose.connect('mongodb://localhost:27017/test', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Connecté à MongoDB");
}).catch(err => {
    console.error("Erreur de connexion à MongoDB", err);
});

// Middlewares
app.use(express.json()); // Pour parser les corps de requête JSON
app.use(express.urlencoded({ extended: true })); // Pour parser les corps de requête URL-encodés
app.use(express.static(path.join(__dirname, 'public'))); // Servir les fichiers statiques

// Définir le moteur de vue
app.set('view engine', 'ejs');

// Middleware pour peupler req.user à partir de la session
app.use(function(req, res, next) {
    if (req.session.userId) {
        req.user = {
            id: req.session.userId,
            role: req.session.role,
            username: req.session.username
        };
    }
    next();
});

// Routes

// Page d'accueil
router.get("/", function (req, res) {
    res.render('index');
});

// Formulaire d'inscription
router.get("/register", function (req, res) {
    res.render('register');
});

// Route d'inscription
router.post('/register', async function (req, res) {
    try {
        console.log(req.body);
        console.log("Nom d'utilisateur :", req.body.username);
        // 1- Récupérer les données du formulaire
        const { username, email, password, role } = req.body;

        // Vérifier si tous les champs sont fournis
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

// Afficher le formulaire de connexion
router.get("/login", function (req, res) {
    res.render('login');
});

// Route de connexion
router.post('/login', async function(req, res){
    try {
        // 1- Récupérer les données du formulaire
        const { email, password } = req.body;

        // 2- Authentifier l'utilisateur
        const user = await User.findOne({ email });
        if (!user) {
            // Si l'utilisateur n'existe pas, renvoyer une erreur
            return res.status(401).send("Email ou mot de passe incorrect");
        }

        // Comparer les mots de passe
        const match = await user.comparePassword(password);
        if (!match) {
            // Si le mot de passe ne correspond pas, renvoyer une erreur
            return res.status(401).send("Email ou mot de passe incorrect");
        }

        // 3- Si succès, stocker les informations de l'utilisateur dans la session
        req.session.userId = user._id;
        req.session.role = user.role;
        req.session.username = user.username;

        // Rediriger vers la page des utilisateurs
        res.redirect('/users');
    } catch (error) {
        console.error("Erreur lors de la connexion :", error);
        res.status(500).send("Erreur lors de la connexion");
    }
});

// Route pour lister tous les utilisateurs
router.get('/users', function(req, res, next) {
    if (!req.session.userId) {
        return res.status(401).send("Vous devez être connecté pour accéder à cette page");
    }
    next();
}, grantAccess('readAny', 'profile'), userController.getUsers);
// Route de déconnexion
router.get('/logout', function(req, res) {
    // Détruire la session pour déconnecter l'utilisateur
    req.session.destroy(function(err) {
        if (err) {
            // En cas d'erreur, renvoyer une erreur 500
            return res.status(500).send("Erreur lors de la déconnexion");
        } else {
            // Rediriger vers la page de connexion
            res.redirect('/login');
        }
    });
});

// Utiliser le routeur
app.use('/', router);

// Démarrer le serveur
var port = process.env.PORT || 9000;
app.listen(port, function () {
    console.log("Le serveur a démarré sur le port :", port);
});
