// roles.js

const AccessControl = require("accesscontrol");
const ac = new AccessControl();

// Définition des rôles et permissions
exports.roles = (function() {
    ac.grant("user")                 // Définir le rôle 'user'
     .readOwn("profile");            // L'utilisateur peut lire son propre profil

    ac.grant("admin")                // Définir le rôle 'admin'
     .extend("user")                 // L'admin hérite des permissions de 'user'
     .readAny("profile");            // L'admin peut lire n'importe quel profil

    return ac;
})();
