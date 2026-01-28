import { PrismaClient } from "@prisma/client";
import { TransactionType } from "../src/common/enums";
import * as argon2 from "argon2";

const prisma = new PrismaClient();

const defaultExpenseCategories = [
  { name: "Ăn uống", icon: "Bowl", type: TransactionType.EXPENSE },
  { name: "Mua sắm", icon: "ShoppingCart", type: TransactionType.EXPENSE },
  { name: "Đi lại", icon: "Van", type: TransactionType.EXPENSE },
  { name: "Hóa đơn", icon: "Document", type: TransactionType.EXPENSE },
  { name: "Sức khỏe", icon: "FirstAidKit", type: TransactionType.EXPENSE },
  { name: "Giải trí", icon: "Film", type: TransactionType.EXPENSE },
  { name: "Giáo dục", icon: "Reading", type: TransactionType.EXPENSE },
  { name: "Khác", icon: "More", type: TransactionType.EXPENSE },
];

const defaultIncomeCategories = [
  { name: "Lương", icon: "Money", type: TransactionType.INCOME },
  { name: "Thưởng", icon: "Present", type: TransactionType.INCOME },
  { name: "Thu khác", icon: "Coin", type: TransactionType.INCOME },
];

async function main() {
  console.log("🌱 Starting seed...");

  // Create a demo user
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

  // Create default wallet
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

  // Create categories
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

  // Create sample transactions
  const categories = await prisma.category.findMany({
    where: { userId: user.id },
  });

  const foodCategory = categories.find((c) => c.name === "Ăn uống");
  const salaryCategory = categories.find((c) => c.name === "Lương");
  const shoppingCategory = categories.find((c) => c.name === "Mua sắm");

  if (foodCategory && salaryCategory && shoppingCategory) {
    const today = new Date();
    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    // Sample transactions
    await prisma.transaction.createMany({
      data: [
        {
          userId: user.id,
          walletId: wallet.id,
          categoryId: salaryCategory.id,
          type: TransactionType.INCOME,
          amount: BigInt(15000000),
          note: "Lương tháng này",
          txnDate: new Date(thisMonth.getFullYear(), thisMonth.getMonth(), 5),
        },
        {
          userId: user.id,
          walletId: wallet.id,
          categoryId: foodCategory.id,
          type: TransactionType.EXPENSE,
          amount: BigInt(150000),
          note: "Ăn trưa với đồng nghiệp",
          txnDate: new Date(thisMonth.getFullYear(), thisMonth.getMonth(), 10),
        },
        {
          userId: user.id,
          walletId: wallet.id,
          categoryId: shoppingCategory.id,
          type: TransactionType.EXPENSE,
          amount: BigInt(500000),
          note: "Mua quần áo",
          txnDate: new Date(thisMonth.getFullYear(), thisMonth.getMonth(), 15),
        },
        {
          userId: user.id,
          walletId: wallet.id,
          categoryId: foodCategory.id,
          type: TransactionType.EXPENSE,
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
