"use strict";

const Admin = require("../models/admin");
const bcrypt = require("bcrypt");
const jwt = require("../helpers/jwt");

const check_admin_exists = async (req, res) => {
    try {
        const admins = await Admin.find();
        if (admins.length === 0) {
            // No hay administradores, permitir la creación
            // Puedes responder con un mensaje o redirigir al frontend a una página de configuración
            res.status(200).send({
                message: "No admins found, ready for initial setup",
                setupRequired: true
            });
        } else {
            // Ya existe un administrador, indicar que no se requiere configuración inicial
            res.status(200).send({
                message: "Admin already setup",
                setupRequired: false
            });
        }
    } catch (error) {
        console.error("Server error:", error);
        res.status(500).send({ message: "Server error", data: undefined });
    }
};


// CREATE ADMIN
const create_admin = async (req, res) => {
    try {
        const data = req.body;
        const adminExists = await Admin.findOne({ email: data.email });

        if (adminExists) {
            return res.status(200).send({
                message: "Email already exists in the database",
                data: undefined,
            });
        }

        if (!data.password) {
            return res.status(200).send({
                message: "No password provided",
                data: undefined,
            });
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);
        data.password = hashedPassword;

        const reg = await Admin.create(data);
        
        res.status(200).send({ data: reg });
    } catch (error) {
        console.error("Server error:", error.message);
        res.status(500).send({ message: "Server error", data: undefined });
    }
};

// LOGIN ADMIN
const login_admin = async (req, res) => {
    try {
        const data = req.body;
        const admin = await Admin.findOne({ email: data.email });

        if (!admin) {
            return res
                .status(200)
                .send({ message: "Email not found", data: undefined });
        }

        bcrypt.compare(data.password, admin.password, async (error, check) => {
            if (check) {
                res.status(200).send({ data: admin, token: jwt.createToken(admin) });
            } else {
                res
                    .status(200)
                    .send({ message: "Incorrect password", data: undefined });
            }
        });
    } catch (error) {
        console.error("Server error:", error.message);
        res.status(500).send({ message: "Server error", data: undefined });
    }
};

// GET ADMIN
// const get_admin = async (req, res) => {
//     try {
//         // Obtener el ID del usuario del parámetro de la solicitud
//         const adminId = req.admin ? req.admin.sub : null; // Asumiendo que el ID del usuario está en req.admin.sub

//         if (!adminId) {
//             return res.status(400).json({ message: "No admin ID found in token" });
//         }

//         // Buscar al administrador por su ID en la base de datos
//         const admin = await Admin.findById(adminId);

//         if (!admin) {
//             return res.status(404).json({ message: "Admin not found", data: null });
//         }

//         const { password, _id, __v, ...adminDataWithoutSensitiveInfo } =
//             admin.toObject();
//         res
//             .status(200)
//             .json({ message: "Admin found", data: adminDataWithoutSensitiveInfo });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "Server error", data: null });
//     }
// };

// GET ADMIN
const get_admin = async (req, res) => {
    try {
        const userId = req.user ? req.user.sub : null;

        if (!userId) {
            return res.status(400).json({ message: "No user ID found in token" });
        }

        const admin = await Admin.findById(userId);
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        const { password,_id, __v, ...adminDataWithoutSensitiveInfo } = admin.toObject();
        res.status(200).json({ message: "Admin found", data: adminDataWithoutSensitiveInfo });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// GET USER PROFILE PICTURE
const get_admin_picture = async function (req, res) {
    try {
        let img = req.params["img"];
        fs.stat("./uploads/admins/" + img, function (err) {
            if (!err) {
                let path_img = "./uploads/admins/" + img;
                res.status(200).sendFile(path.resolve(path_img));
            } else {
                let path_img = "./uploads/default.jpg";
                res.status(200).sendFile(path.resolve(path_img));
            }
        });
    } catch (error) {
        res.status(500).send("Error getting the profile picture: " + error.message);
    }
};

// // UPDATE USER
const update_admin = async function (req, res) {
    let admin_arr = [];
    if (req.admin) {
        let id = req.params["id"];
        let data = req.body;

        const email = data.email.toLowerCase();
        admin_arr = await Admin.find({
            _id: { $ne: id },
            email: { $regex: new RegExp("^" + email + "$", "i") },
        });
        if (admin_arr.length === 0) {
            try {
                if (req.files && req.files.profileImage) {
                    let img_path = req.files.profileImage.path;
                    let name = img_path.split("\\");
                    let profileImage_name = name[2];
                    const existingOffer = await Admin.findById(id);
                    if (existingOffer && existingOffer.profileImage) {
                        const existingProfileImageOfferPath = `uploads/admins/${existingOffer.profileImage}`;
                        if (fs.existsSync(existingProfileImageOfferPath)) {
                            fs.unlinkSync(existingProfileImageOfferPath);
                        }
                    }
                    let reg = await Admin.findByIdAndUpdate(
                        { _id: id },
                        {
                            firstName: data.firstName,
                            lastName: data.lastName,
                            email: data.email,
                            location: data.location,
                            phoneNumber: data.phoneNumber,
                            role: data.role,
                            identification: data.identification,
                            additionalInfo: data.additionalInfo,
                            profileImage: profileImage_name,
                        }
                    );
                    res.status(200).send({ data: reg });
                } else {
                    let reg = await Admin.findByIdAndUpdate(
                        { _id: id },
                        {
                            firstName: data.firstName,
                            lastName: data.lastName,
                            email: data.email,
                            location: data.location,
                            phoneNumber: data.phoneNumber,
                            role: data.role,
                            identification: data.identification,
                            additionalInfo: data.additionalInfo                        }
                    );

                    res.status(200).send({ data: reg });
                }
            } catch (error) {
                console.error("Error:", error);
                res
                    .status(500)
                    .send({
                        message:
                        "Error updating data, Internal server error",
                    });
            }
        } else {
            res.status(409).send({
                message: "Title exists.",
                data: undefined,
            });
        }
    } else {
        res.status(500).send({ message: "No Access" });
    }
};

module.exports = {
    check_admin_exists,
    create_admin,
    login_admin,
    get_admin,
    get_admin_picture,
    update_admin,
};
