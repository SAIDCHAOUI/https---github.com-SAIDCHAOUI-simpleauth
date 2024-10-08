// userController.js

const User = require('/Users/chaou/Desktop/TP_2_Authentication_amp_Access_Control-20241008/simpleAuth/models/userModel');


// Fonction pour obtenir tous les utilisateurs
exports.getUsers = async function(req, res) {
    try {
        // Récupérer tous les utilisateurs, en sélectionnant les champs pertinents
        const users = await User.find({}, 'username email role');
        // Rendre la vue 'usersResult' avec les données des utilisateurs
        res.render('userResult', { users });
    } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs :", error);
        res.status(500).send("Erreur lors de la récupération des utilisateurs");
    }
};
