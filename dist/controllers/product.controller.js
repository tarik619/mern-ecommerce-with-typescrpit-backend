import { TryCatch } from "../middlewares/error.js";
import { Product } from "../models/product.model.js";
import errorHandler from "../utils/utility-class.js";
import { rm } from "fs";
export const newProduct = TryCatch(async (req, res, next) => {
    const { name, price, category, stock } = req.body;
    const photo = req.file;
    if (!photo) {
        return next(new errorHandler("please add photo", 400));
    }
    if (!name || !price || !category || !stock) {
        rm(photo.path, () => {
            console.log("deleted");
        });
        return next(new errorHandler("please enter all fields", 400));
    }
    await Product.create({
        name,
        price,
        stock,
        category: category.toLowerCase(),
        photo: photo.path,
    });
    return res.status(201).json({
        success: true,
        message: "Product created successfully",
    });
});
