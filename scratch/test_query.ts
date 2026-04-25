import { rpc, Contract, xdr, TransactionBuilder } from "@stellar/stellar-sdk";

const RPC_URL = "https://soroban-testnet.stellar.org";
const NETWORK_PASSPHRASE = "Test SDF Network ; September 2015";
const MARKETPLACE_ID = "CD5BIENAZHWBQMEQQEO7EUSXHWF6K6KDJI4DWHJGKLH6YZEPTV73K2IK";

const sorobanRpc = new rpc.Server(RPC_URL);

const idToScVal = (id: string | number) => xdr.ScVal.scvI128(
  new xdr.Int128Parts({
    lo: xdr.Uint64.fromString(id.toString()),
    hi: xdr.Int64.fromString("0")
  })
);

async function testQuery() {
  try {
    const marketplace = new Contract(MARKETPLACE_ID);
    const id = 1; // Testing with ID 1 from previous logs
    
    console.log(`Querying listing for ID: ${id}`);
    
    // We need an account to simulate
    const address = "GBKNHIATMCYTFZZZUX347NF2SCH7MKMT7HS73HOVCC55CDJEI53I6S5A";
    const account = await sorobanRpc.getAccount(address);
    
    const tx = new TransactionBuilder(account, {
      fee: "1000",
      networkPassphrase: NETWORK_PASSPHRASE,
    })
    .addOperation(marketplace.call("get_listing", idToScVal(id)))
    .setTimeout(30)
    .build();

    const simRes = await sorobanRpc.simulateTransaction(tx);
    console.log("Simulation Response:", JSON.stringify(simRes, null, 2));
    
    // Accessing results via .results as per SDK v12+
    const results = (simRes as any).results;
    if (results && results.length > 0) {
        const res = results[0];
        console.log("Result found in simulation.");
        if (res.result) {
            console.log("ScVal Type (via switch):", res.result.switch().name);
            if (res.result.switch().name !== 'scvVoid') {
                console.log("NFT IS FOUND ON BLOCKCHAIN!");
            } else {
                console.log("NFT NOT FOUND (Void ScVal).");
            }
        }
    } else {
        console.log("NO RESULTS ARRAY IN SIMULATION RESPONSE. Keys:", Object.keys(simRes));
    }
    
    process.exit(0);
  } catch (err) {
    console.error("Test failed:", err);
    process.exit(1);
  }
}

testQuery();
