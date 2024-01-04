import { User } from "../models/user.model.js";
export const newUser = async (req, res, next) => {
    try {
        const { name, email, photo, gender, _id, dob } = req.body;
        const user = await User.create({
            name,
            email,
            photo,
            gender,
            _id,
            dob,
        });
        return res.status(201).json({
            success: true,
            message: `welcome ${user.name}`,
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: "Server error",
            error: error,
        });
    }
};
