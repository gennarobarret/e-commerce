// UserManagementController.js

"use strict";

const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("../helpers/jwt");
const fs = require("fs");
const path = require("path");

// CREATE USER
const createUser = async (req, res) => {
    try {
        const data = req.body;
        // Verificar si se proporcionó una contraseña
        if (!data.password) {
            return res.status(200).send({
                message: "No password provided",
                data: undefined,
            });
        }
        // Crear el registro del useristrador
        const reg = await User.create(data);
        res.status(200).send({ data: reg });

    } catch (error) {
        console.error("Server error:", error.message);
        res.status(500).send({ message: "Server error", data: undefined });
    }
}

// GET USER
const getUser = async (req, res) => {
    try {
        const userId = req.user ? req.user.sub : null;
        if (!userId) {
            return res.status(400).json({ message: "No user ID found in token" });
        }
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const { password, __v, ...userDataWithoutSensitiveInfo } =
            user.toObject();
        res
            .status(200)
            .json({ message: "User found", data: userDataWithoutSensitiveInfo });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// GET USER PROFILE PICTURE
const geUserImage = async function (req, res) {
    try {
        let img = req.params["img"];
        fs.stat("./uploads/profile/" + img, function (err) {
            if (!err) {
                let path_img = "./uploads/profile/" + img;
                res.status(200).sendFile(path.resolve(path_img));
            } else {
                let path_img = "./uploads/profile-2.png";
                res.status(200).sendFile(path.resolve(path_img));
            }
        });
    } catch (error) {
        res.status(500).send("Error getting the profile picture: " + error.message);
    }
};

// UPDATE USER
const updateUser = async function (req, res) {
    const userId = req.body._id;
    let data = req.body;
    try {
        let userToUpdate = await User.findById(userId);
        if (!userToUpdate) {
            return res.status(404).send({
                message: "User not found.",
                data: undefined,
            });
        }
        userToUpdate.userName = data.userName;
        userToUpdate.firstName = data.firstName;
        userToUpdate.lastName = data.lastName;
        userToUpdate.organizationName = data.organizationName;
        userToUpdate.countryAddress = data.countryAddress;
        userToUpdate.stateAddress = data.stateAddress;
        userToUpdate.emailAddress = data.emailAddress;
        userToUpdate.phoneNumber = data.phoneNumber;
        userToUpdate.birthday = data.birthday;
        userToUpdate.role = data.role;
        userToUpdate.identification = data.identification;
        userToUpdate.additionalInfo = data.additionalInfo;
        await userToUpdate.save();
        res.status(200).send({
            message: "User updated successfully",
            data: userToUpdate,
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send({
            message: "Error updating user, Internal server error",
        });
    }
};

module.exports = {
    createUser,
    getUser,
    geUserImage,
    updateUser,
};
