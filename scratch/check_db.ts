import mongoose from "mongoose";

const MONGODB_URI = "mongodb+srv://greyparadox:parth123@payslip.5du9xig.mongodb.net/nft_marketplace?appName=payslip";

async function checkDb() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");
    
    const db = mongoose.connection.db;
    const collections = await db.collections();
    for (const collection of collections) {
      const count = await collection.countDocuments();
      console.log(`Collection: ${collection.collectionName}, Count: ${count}`);
      if (count > 0) {
        const docs = await collection.find({}).limit(5).toArray();
        console.log("Samples:", JSON.stringify(docs, null, 2));
      }
    }
    
    process.exit(0);
  } catch (err) {
    console.error("Failed to check DB:", err);
    process.exit(1);
  }
}

checkDb();
