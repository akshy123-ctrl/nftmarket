import mongoose from "mongoose";

const uri = "mongodb+srv://greyparadox:parth123@payslip.5du9xig.mongodb.net/nft_marketplace?appName=payslip";

const NFTSchema = new mongoose.Schema({
  tokenId: Number,
  name: String,
  imageUrl: String,
  price: String,
  royalty: String,
  creator: String,
  status: String,
});

const NFT = mongoose.models.NFT || mongoose.model("NFT", NFTSchema);

async function run() {
  try {
    console.log("Connecting to Mongo...");
    await mongoose.connect(uri);
    console.log("Connected!");

    console.log("Testing large document creation (2MB image)...");
    const largeStr = "a".repeat(2 * 1024 * 1024); // 2MB string
    
    const testNft = {
      tokenId: Math.floor(Math.random() * 1000000),
      name: "Large Test",
      imageUrl: "data:image/png;base64," + largeStr,
      price: "1",
      royalty: "2000",
      creator: "diag_user",
      status: "pending"
    };

    const doc = await NFT.create(testNft);
    console.log("Success! Created doc with ID:", doc._id);
    
    await NFT.deleteOne({ _id: doc._id });
    console.log("Cleanup done.");
    process.exit(0);
  } catch (e) {
    console.error("Fail!");
    console.error(e);
    process.exit(1);
  }
}

run();
