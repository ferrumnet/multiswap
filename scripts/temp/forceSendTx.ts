import { ethers } from "ethers";

// RPC endpoint URL
const rpcUrl = "https://base-mainnet.core.chainstack.com/e7aa01c976c532ebf8e2480a27f18278";

// Create a provider
const provider = new ethers.JsonRpcProvider(rpcUrl);
const privateKey = process.env.PRIVATE_KEY0!;
const wallet = new ethers.Wallet(privateKey, provider);

// The raw transaction data
const rawTx = {
    to: "0xfc0933cb28518f12d17b935ffC49380f89790cDE", // Address of the receiver or contract
    value: 0, // Amount to send (for ETH transfers)
    data: "0xbebb1b7300000000000000000000000000000000000000000000000000000000000f424000000000000000000000000000000000000000000000000000011a73447884b8000000000000000000000000833589fcd6edb6e08f4c7c32d4f71b54bda02913000000000000000000000000eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee000000000000000000000000eedfdd620629c7432970d22488124fc92ad6d426000000000000000000000000111111125421ca6dc452d289314280a0f8842a6500000000000000000000000000000000000000000000000000000000000000e0000000000000000000000000000000000000000000000000000000000000022807ed2379000000000000000000000000e37e799d5077682fa0a244d46e5649f71457bd09000000000000000000000000833589fcd6edb6e08f4c7c32d4f71b54bda0291300000000000000000000000042000000000000000000000000000000000000060000000000000000000000002f8818d1b0f3e3e295440c1c0cddf40aaa21fa87000000000000000000000000eedfdd620629c7432970d22488124fc92ad6d42600000000000000000000000000000000000000000000000000000000000f424000000000000000000000000000000000000000000000000000011a73447884b80000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000012000000000000000000000000000000000000000000000000000000000000000cd0000000000000000000000000000000000000000000000af00008100001a0020d6bdbf78833589fcd6edb6e08f4c7c32d4f71b54bda0291300206ae4071138002dc6c02f8818d1b0f3e3e295440c1c0cddf40aaa21fa87111111125421ca6dc452d289314280a0f8842a650000000000000000000000000000000000000000000000000000000000000001833589fcd6edb6e08f4c7c32d4f71b54bda029130020d6bdbf784200000000000000000000000000000000000006111111125421ca6dc452d289314280a0f8842a65000000000000000000000000000000000000007c2ad3dd000000000000000000000000000000000000000000000000", // Encoded contract call or empty for plain ETH transfer
    gasLimit: 1000000, // Maximum gas to spend
    gasPrice: 200000000, // Gas price in wei
};

console.log("Using wallet address: " + wallet.address);

async function sendTransaction() {
    try {
        console.log("Sending transaction...");
        const txResponse = await wallet.sendTransaction(rawTx);
        console.log("Transaction sent! Hash:", txResponse.hash);

        // Wait for the transaction to be mined
        const receipt = await txResponse.wait();
        console.log("Transaction confirmed in block:", receipt!.blockNumber);
    } catch (error) {
        console.error("Error sending transaction:", error);
    }
}

sendTransaction();
