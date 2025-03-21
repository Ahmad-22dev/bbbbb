import { NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()

    const contractAddress = formData.get("contractAddress") as string
    const bannerText = formData.get("bannerText") as string
    const email = formData.get("email") as string
    const telegram = formData.get("telegram") as string
    const bannerType = formData.get("bannerType") as string
    const paymentSignature = formData.get("paymentSignature") as string
    const manualPayment = formData.get("manualPayment") === "true"

    // Handle logo upload
    const logo = formData.get("logo") as File | null
    let logoPath = null

    if (logo) {
      const bytes = await logo.arrayBuffer()
      const buffer = Buffer.from(bytes)

      // In a real app, you'd use a storage service like AWS S3 or Vercel Blob
      // For this example, we'll just log the file details
      console.log(`Received logo: ${logo.name}, size: ${logo.size} bytes`)
      logoPath = `logo-${uuidv4()}-${logo.name}`
    }

    // Handle screenshots (for premium banners)
    const screenshotPaths = []

    if (bannerType === "premium") {
      for (let i = 0; i < 3; i++) {
        const screenshot = formData.get(`screenshot_${i}`) as File | null

        if (screenshot) {
          const bytes = await screenshot.arrayBuffer()
          const buffer = Buffer.from(bytes)

          console.log(`Received screenshot ${i}: ${screenshot.name}, size: ${screenshot.size} bytes`)
          screenshotPaths.push(`screenshot-${i}-${uuidv4()}-${screenshot.name}`)
        }
      }
    }

    // Log order information to console instead of sending emails
    console.log(`Banner request submitted successfully`)
    console.log(`Contract Address: ${contractAddress}`)
    console.log(`Banner Type: ${bannerType}`)
    console.log(`Customer Email: ${email}`)
    console.log(`Customer Telegram: ${telegram || "Not provided"}`)
    console.log(`Payment Method: ${manualPayment ? "Manual Payment" : "Direct Wallet Payment"}`)
    console.log(`Transaction Signature: ${paymentSignature}`)

    // Return success response
    return NextResponse.json({
      success: true,
      message: "Banner request submitted successfully",
      requestId: uuidv4(),
      details: {
        contractAddress,
        bannerType,
        paymentSignature,
        manualPayment,
        logoPath,
        screenshotPaths,
      },
    })
  } catch (error) {
    console.error("Error processing banner request:", error)
    return NextResponse.json({ error: "Failed to process banner request" }, { status: 500 })
  }
}
