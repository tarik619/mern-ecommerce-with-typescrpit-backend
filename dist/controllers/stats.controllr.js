import { nodeCache } from "../app.js";
import { TryCatch } from "../middlewares/error.js";
export const getDashboardStats = TryCatch(async (req, res, next) => {
    let stats = {};
    if (nodeCache.has("admin-stats"))
        stats = JSON.parse(nodeCache.get("admin-stats"));
    else {
    }
    res.status(200).json({
        success: true,
        stats,
    });
});
export const getPieCharts = TryCatch(async (req, res, next) => { });
export const getBarCharts = TryCatch(async (req, res, next) => { });
export const getLineCharts = TryCatch(async (req, res, next) => { });
