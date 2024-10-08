// middleware.js

const { roles } = require('/Users/chaou/Desktop/TP_2_Authentication_amp_Access_Control-20241008/simpleAuth/config/roles');

// Fonction middleware pour vérifier les autorisations
exports.grantAccess = function(action, resource) {
    return (req, res, next) => {
        try {
            const permission = roles.can(req.user.role)[action](resource);
            if (!permission.granted) {
                return res.status(403).render('error', {
                    message: "Vous n'avez pas la permission d'effectuer cette action"
                });
            }
            next();
        } catch (error) {
            next(error);
        }
    }
}