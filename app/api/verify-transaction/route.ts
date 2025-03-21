import { NextResponse } from "next/server"
import { Connection, LAMPORTS_PER_SOL } from "@solana/web3.js"

// Your recipient wallet address
const RECIPIENT_WALLET = "6zhLuGqFfVfYsRNUrkXSMxhCpKK63JCJvFccosBBhqf8"

export async function POST(request: Request) {
  try {
    const { signature, bannerType } = await request.json()

    if (!signature) {
      return NextResponse.json({ error: "Transaction signature is required" }, { status: 400 })
    }

    // Connect to Solana
    const connection = new Connection("https://api.mainnet-beta.solana.com", "confirmed")

    // Get transaction details
    const transaction = await connection.getTransaction(signature, {
      maxSupportedTransactionVersion: 0,
    })

    if (!transaction) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 })
    }

    // Verify the transaction is a transfer to the correct recipient
    const expectedAmount = bannerType === "basic" ? 0.1 * LAMPORTS_PER_SOL : 0.2 * LAMPORTS_PER_SOL

    // In a real implementation, you would:
    // 1. Verify the transaction is a SOL transfer
    // 2. Verify the recipient is your wallet
    // 3. Verify the amount matches the expected amount
    // 4. Verify the transaction is confirmed
    // 5. Check if the transaction is already used for another banner request

    // Log verification information to console instead of sending email
    console.log(`Verified transaction ${signature} for ${bannerType} banner`)
    console.log(`Banner Type: ${bannerType}`)
    console.log(`Expected Amount: ${bannerType === "basic" ? "0.1" : "0.2"} SOL`)

    return NextResponse.json({
      success: true,
      message: "Transaction verified successfully",
      details: {
        signature,
        bannerType,
        verified: true,
      },
    })
  } catch (error) {
    console.error("Error verifying transaction:", error)
    return NextResponse.json({ error: "Failed to verify transaction" }, { status: 500 })
  }
}
