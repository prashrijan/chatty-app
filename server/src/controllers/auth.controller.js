import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { generateToken } from "../utils/utils.js";
import cloudinary from "../libs/cloudinary.js";

export const signUp = async (req, res) => {
    try {
        const { email, password, fullName } = req.body;
        if (!email || !password || !fullName) {
            return res
                .status(400)
                .json(new ApiError(400, "All fields are required"));
        }

        if (password < 6) {
            return res
                .status(400)
                .json(
                    new ApiError(400, "Password must be at least 6 characters.")
                );
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res
                .status(400)
                .json(
                    new ApiError(400, "User with this email already exists.")
                );
        }

        const user = await User.create({
            email,
            password,
            fullName,
        });

        const createdUser = await User.findById(user._id).select("-password");

        if (createdUser) {
            generateToken(createdUser._id, res);
            await createdUser.save();
            return res
                .status(201)
                .json(
                    new ApiResponse(
                        201,
                        createdUser,
                        "User created successfully."
                    )
                );
        }
    } catch (error) {
        console.log("Error creating user: ", error);
        return res
            .status(500)
            .json(
                new ApiError(500, "Server Error while creating the user", error)
            );
    }
};
export const signIn = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res
                .status(400)
                .json(new ApiError(400, "All fields are required."));
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res
                .status(400)
                .json(new ApiError(404, "User with this email doesnot exist."));
        }

        const isPasswordCorrect = await user.isPasswordCorrect(password);

        if (!isPasswordCorrect) {
            return res.status(401).json(new ApiError(401, "Invalid Password."));
        }

        generateToken(user._id, res);

        return res
            .status(200)
            .json(new ApiResponse(200, user, "Login Successfull"));
    } catch (error) {
        console.log("Error while logging in the user: ", error);
        return res.status(500).json(new ApiError(500, "Internal Server Error"));
    }
};
export const signOut = (_, res) => {
    try {
        res.cookie("jwt", "", {
            maxAge: 0,
        });

        return res
            .status(200)
            .json(new ApiResponse(200, "", "Logout Successful"));
    } catch (error) {
        console.log("Error while logging out the user: ", error);
        return res.status(500).json(new ApiError(500, "Internal Server Error"));
    }
};
export const updateProfilePic = async (req, res) => {
    try {
        console.log(req.body);
        const { profilePic } = req.body;
        const userId = req.user._id;

        if (!profilePic) {
            return res
                .status(400)
                .json(new ApiError(400, "Profile Pic is required"));
        }

        const uploadRes = await cloudinary.uploader.upload(profilePic);

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                profilePic: uploadRes.secure_url,
            },
            { new: true }
        );

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    updatedUser,
                    "Profile Pic successfully updated"
                )
            );
    } catch (error) {
        console.log("Error updating the profile picture: ", error);
        return res.status(500).json(new ApiError(500, "Internal Server Error"));
    }
};
export const checkAuth = (req, res) => {
    try {
        return res
            .status(200)
            .json(new ApiResponse(200, req.user, "User Authorised"));
    } catch (error) {
        console.log("Error in check auth controller: ", error);
        return res.status(500).json(new ApiError(500, "Internal Server Error"));
    }
};
