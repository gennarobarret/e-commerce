"use strict";

// exports.checkRoleAndGroup = (requiredRole, requiredGroup) => {
//     return (req, res, next) => {
//         const user = req.user;
//         if (user.role === requiredRole && user.group === requiredGroup) {
//             next();
//         } else {
//             res.status(403).send({ message: "Access denied" });
//         }
//     };
// };


const rbacMiddleware = (requiredRole, requiredGroup) => {
    return (req, res, next) => {
        const user = req.user;

        // Permite el acceso si el usuario es un MasterAdministrator
        if (user.role === 'MasterAdministrator') {
            return next();
        }

        // Permite el acceso si el usuario cumple con el rol y grupo requeridos
        if (user.role === requiredRole && (requiredGroup === 'any' || user.groups.includes(requiredGroup))) {
            return next();
        }

        // En cualquier otro caso, deniega el acceso
        res.status(403).send({ message: "Access denied" });
    };
};

module.exports = rbacMiddleware;
