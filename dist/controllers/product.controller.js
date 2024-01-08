import { TryCatch } from "../middlewares/error.js";
import { Product } from "../models/product.model.js";
import errorHandler from "../utils/utility-class.js";
import { rm } from "fs";
import { nodeCache } from "../app.js";
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
// revalidate on new. update,delete product & on new order
export const getLatestProducts = TryCatch(async (req, res, next) => {
    let products;
    if (nodeCache.has("latest-products"))
        products = JSON.parse(nodeCache.get("latest-products"));
    else {
        products = await Product.find({}).sort({ createdAt: -1 }).limit(5);
        nodeCache.set("latest-products", JSON.stringify(products));
    }
    return res.status(201).json({
        success: true,
        products,
    });
});
// revalidate on new. update,delete product & on new order
export const getCategories = TryCatch(async (req, res, next) => {
    let categories;
    if (nodeCache.has("categories"))
        categories = JSON.parse(nodeCache.get("categories"));
    else {
        categories = await Product.distinct("category");
        nodeCache.set("categories", JSON.stringify(categories));
    }
    return res.status(201).json({
        success: true,
        categories,
    });
});
// revalidate on new. update,delete product & on new order
export const getAdminProducts = TryCatch(async (req, res, next) => {
    let products;
    if (nodeCache.has("all-products"))
        products = JSON.parse(nodeCache.get("all-products"));
    else {
        products = await Product.find({});
        nodeCache.set("add-products", JSON.stringify(products));
    }
    return res.status(201).json({
        success: true,
        products,
    });
});
export const getSingleProduct = TryCatch(async (req, res, next) => {
    let product;
    const id = req.params.id;
    if (nodeCache.has(`product-${id}`)) {
        product = JSON.parse(nodeCache.get(`product-${id}`));
    }
    else {
        product = await Product.findById(id);
        if (!product)
            return next(new errorHandler("product not found", 404));
        nodeCache.set(`product-${id}`, JSON.stringify(product));
    }
    return res.status(201).json({
        success: true,
        product,
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
