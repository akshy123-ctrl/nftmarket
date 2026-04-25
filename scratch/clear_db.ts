import mongoose from "mongoose";

const MONGODB_URI = "mongodb+srv://greyparadox:parth123@payslip.5du9xig.mongodb.net/nft_marketplace?appName=payslip";

async function clearDb() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");
    
    // We want to keep the models but clear the data
    const collections = await mongoose.connection.db.collections();
    for (const collection of collections) {
      await collection.deleteMany({});
      console.log(`Cleared collection: ${collection.collectionName}`);
    }
    
    console.log("Database cleared successfully");
    process.exit(0);
  } catch (err) {
    console.error("Failed to clear DB:", err);
    process.exit(1);
  }
}

clearDb();
