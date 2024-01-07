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
export const getLatestProducts = TryCatch(async (req, res, next) => {
    const products = await Product.find({}).sort({ createdAt: -1 }).limit(5);
    return res.status(201).json({
        success: true,
        products,
    });
});
export const getCategories = TryCatch(async (req, res, next) => {
    const categories = await Product.distinct("category");
    return res.status(201).json({
        success: true,
        categories,
    });
});
export const getAdminProducts = TryCatch(async (req, res, next) => {
    const products = await Product.find({});
    return res.status(201).json({
        success: true,
        products,
    });
});
export const getSingleProduct = TryCatch(async (req, res, next) => {
    const { id } = req.params;
    const products = await Product.findById(id);
    return res.status(201).json({
        success: true,
        products,
    });
});
export const updateProduct = TryCatch(async (req, res, next) => {
    const { id } = req.params;
    const { name, price, category, stock } = req.body;
    const photo = req.file;
    const product = await Product.findById(id);
    if (!product)
        return next(new errorHandler("invalid product id", 400));
    if (photo) {
        rm(product.photo, () => {
            console.log("old photo deleted");
        });
        product.photo = photo.path;
    }
    if (name)
        product.name = name;
    if (price)
        product.price = price;
    if (category)
        product.category = category;
    if (stock)
        product.stock = stock;
    await product.save();
    return res.status(201).json({
        success: true,
        message: "Product updated successfully",
    });
});
export const deleteProduct = TryCatch(async (req, res, next) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product)
        return next(new errorHandler("product not found", 404));
    rm(product.photo, () => {
        console.log("photo deleted");
    });
    await product.deleteOne();
    return res.status(201).json({
        success: true,
        message: "product deleted successfully",
    });
});
export const getAllProducts = TryCatch(async (req, res, next) => {
    const { search, category, sort, price } = req.query;
    const page = Number(req.query.page) || 1;
    const limit = Number(process.env.PRODUCT_PER_PAGE) || 8;
    const skip = limit * (page - 1);
    const baseQuery = {
    // price: {
    //   $lte: Number(price),
    // },
    // category,
    };
    if (search)
        baseQuery.name = {
            $regex: search,
            $options: "i",
        };
    if (price)
        baseQuery.price = {
            $lte: Number(price),
        };
    if (category)
        baseQuery.category = category;
    const [products, filteredOnlyProduct] = await Promise.all([
        Product.find(baseQuery)
            .sort(sort && { price: sort === "asc" ? 1 : -1 })
            .limit(limit)
            .skip(skip),
        Product.find(baseQuery),
    ]);
    const totalPage = Math.ceil(filteredOnlyProduct.length / limit);
    return res.status(201).json({
        success: true,
        products,
        totalPage,
    });
});
