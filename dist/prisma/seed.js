"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const enums_1 = require("../src/common/enums");
const argon2 = __importStar(require("argon2"));
const prisma = new client_1.PrismaClient();
const defaultExpenseCategories = [
    { name: "Ăn uống", icon: "Bowl", type: enums_1.TransactionType.EXPENSE },
    { name: "Mua sắm", icon: "ShoppingCart", type: enums_1.TransactionType.EXPENSE },
    { name: "Đi lại", icon: "Van", type: enums_1.TransactionType.EXPENSE },
    { name: "Hóa đơn", icon: "Document", type: enums_1.TransactionType.EXPENSE },
    { name: "Sức khỏe", icon: "FirstAidKit", type: enums_1.TransactionType.EXPENSE },
    { name: "Giải trí", icon: "Film", type: enums_1.TransactionType.EXPENSE },
    { name: "Giáo dục", icon: "Reading", type: enums_1.TransactionType.EXPENSE },
    { name: "Khác", icon: "More", type: enums_1.TransactionType.EXPENSE },
];
const defaultIncomeCategories = [
    { name: "Lương", icon: "Money", type: enums_1.TransactionType.INCOME },
    { name: "Thưởng", icon: "Present", type: enums_1.TransactionType.INCOME },
    { name: "Thu khác", icon: "Coin", type: enums_1.TransactionType.INCOME },
];
async function main() {
    console.log("🌱 Starting seed...");
    const passwordHash = await argon2.hash("demo123456");
    const user = await prisma.user.upsert({
        where: { email: "demo@example.com" },
        update: {},
        create: {
            email: "demo@example.com",
            passwordHash,
        },
    });
    console.log("✅ Created demo user:", user.email);
    const wallet = await prisma.wallet.upsert({
        where: { id: user.id + "-wallet" },
        update: {},
        create: {
            id: user.id + "-wallet",
            userId: user.id,
            name: "Ví chính",
            currency: "VND",
        },
    });
    console.log("✅ Created default wallet:", wallet.name);
    for (const cat of [...defaultExpenseCategories, ...defaultIncomeCategories]) {
        await prisma.category.upsert({
            where: {
                id: `${user.id}-${cat.name}`,
            },
            update: {},
            create: {
                id: `${user.id}-${cat.name}`,
                userId: user.id,
                name: cat.name,
                type: cat.type,
                icon: cat.icon,
            },
        });
    }
    console.log("✅ Created default categories");
    const categories = await prisma.category.findMany({
        where: { userId: user.id },
    });
    const foodCategory = categories.find((c) => c.name === "Ăn uống");
    const salaryCategory = categories.find((c) => c.name === "Lương");
    const shoppingCategory = categories.find((c) => c.name === "Mua sắm");
    if (foodCategory && salaryCategory && shoppingCategory) {
        const today = new Date();
        const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        await prisma.transaction.createMany({
            data: [
                {
                    userId: user.id,
                    walletId: wallet.id,
                    categoryId: salaryCategory.id,
                    type: enums_1.TransactionType.INCOME,
                    amount: BigInt(15000000),
                    note: "Lương tháng này",
                    txnDate: new Date(thisMonth.getFullYear(), thisMonth.getMonth(), 5),
                },
                {
                    userId: user.id,
                    walletId: wallet.id,
                    categoryId: foodCategory.id,
                    type: enums_1.TransactionType.EXPENSE,
                    amount: BigInt(150000),
                    note: "Ăn trưa với đồng nghiệp",
                    txnDate: new Date(thisMonth.getFullYear(), thisMonth.getMonth(), 10),
                },
                {
                    userId: user.id,
                    walletId: wallet.id,
                    categoryId: shoppingCategory.id,
                    type: enums_1.TransactionType.EXPENSE,
                    amount: BigInt(500000),
                    note: "Mua quần áo",
                    txnDate: new Date(thisMonth.getFullYear(), thisMonth.getMonth(), 15),
                },
                {
                    userId: user.id,
                    walletId: wallet.id,
                    categoryId: foodCategory.id,
                    type: enums_1.TransactionType.EXPENSE,
                    amount: BigInt(200000),
                    note: "Cafe",
                    txnDate: today,
                },
            ],
        });
        console.log("✅ Created sample transactions");
    }
    console.log("🎉 Seed completed!");
}
main()
    .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map