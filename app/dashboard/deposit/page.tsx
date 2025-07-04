"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  ArrowLeft,
  CreditCard,
  Wallet,
  Building2,
  CheckCircle,
  AlertCircle,
  Home,
  History,
  LifeBuoy,
  LogOut,
  User,
  Copy,
} from "lucide-react"
import { processDeposit } from "@/lib/user-service"

// Crypto addresses for deposits - User's specific addresses
const CRYPTO_ADDRESSES = {
  bitcoin: "1EwSeZbK8RW5EgRc96RnhjcLmGQA6zZ2RV",
  usdt_erc20: "0x4c2bba6f32aa4b804c43dd25c4c3c311dd8016cf",
  usdt_bep20: "0x4c2bba6f32aa4b804c43dd25c4c3c311dd8016cf",
  usdt_trc20: "TFBXLYCcuDLJqkN7ggxzfKMHmW64L7u9AA",
  ethereum: "0x4c2bba6f32aa4b804c43dd25c4c3c311dd8016cf",
}

const CRYPTO_NETWORKS = {
  bitcoin: "Bitcoin Network",
  usdt_erc20: "Ethereum (ERC-20)",
  usdt_bep20: "Binance Smart Chain (BEP-20)",
  usdt_trc20: "Tron (TRC-20)",
  ethereum: "Ethereum Network",
}

const CRYPTO_CONFIRMATIONS = {
  bitcoin: "3",
  usdt_erc20: "12",
  usdt_bep20: "15",
  usdt_trc20: "20",
  ethereum: "12",
}

export default function DepositPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [amount, setAmount] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("")
  const [cryptoType, setCryptoType] = useState("")
  const [processing, setProcessing] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [copied, setCopied] = useState("")

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem("user")
    if (!storedUser) {
      router.push("/login")
      return
    }

    try {
      const userData = JSON.parse(storedUser)
      setUser(userData)
    } catch (error) {
      console.error("Error loading user data:", error)
      localStorage.removeItem("user")
      router.push("/login")
    } finally {
      setLoading(false)
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/login")
  }

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    setCopied(type)
    setTimeout(() => setCopied(""), 2000)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validate amount
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setError("Please enter a valid amount")
      return
    }

    // Check minimum deposit
    if (Number(amount) < 50) {
      setError("Minimum deposit amount is €50")
      return
    }

    // Validate payment method
    if (!paymentMethod) {
      setError("Please select a payment method")
      return
    }

    // For crypto, validate crypto type
    if (paymentMethod === "crypto" && !cryptoType) {
      setError("Please select a cryptocurrency")
      return
    }

    setProcessing(true)

    try {
      // Process deposit
      const transactionId = processDeposit(
        user.email,
        Number(amount),
        paymentMethod === "crypto" ? `${paymentMethod}_${cryptoType}` : paymentMethod,
      )

      // Simulate processing time
      setTimeout(() => {
        setProcessing(false)
        setSuccess(true)

        // Reset form after success
        setTimeout(() => {
          setSuccess(false)
          setAmount("")
          setPaymentMethod("")
          setCryptoType("")
        }, 3000)
      }, 2000)
    } catch (error) {
      setProcessing(false)
      setError("Failed to process deposit. Please try again.")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050e24] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#050e24] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0a1735] text-white hidden md:block">
        <div className="p-4 border-b border-[#253256]">
          <Link href="/" className="flex items-center">
            <div className="relative w-10 h-10 rounded-full overflow-hidden">
              <Image src="/logo.png" alt="MXTM Investment" fill className="object-cover" />
            </div>
            <span className="ml-2 font-medium">MXTM INVESTMENT</span>
          </Link>
        </div>

        <div className="p-4">
          <div className="flex items-center mb-8">
            <div className="bg-[#162040] h-10 w-10 rounded-full flex items-center justify-center mr-3">
              <span className="text-[#0066ff] font-bold">{user?.name?.charAt(0) || user?.email?.charAt(0) || "U"}</span>
            </div>
            <div>
              <p className="text-sm font-medium">{user?.name || "User"}</p>
              <p className="text-xs text-gray-400">{user?.email}</p>
            </div>
          </div>

          <nav>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/dashboard"
                  className="flex items-center p-2 rounded-md hover:bg-[#162040] text-gray-300 hover:text-white"
                >
                  <Home className="mr-3 h-5 w-5" />
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/dashboard/deposit" className="flex items-center p-2 rounded-md bg-[#162040] text-white">
                  <Wallet className="mr-3 h-5 w-5" />
                  Deposit
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/withdraw"
                  className="flex items-center p-2 rounded-md hover:bg-[#162040] text-gray-300 hover:text-white"
                >
                  <Wallet className="mr-3 h-5 w-5" />
                  Withdraw
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/investments"
                  className="flex items-center p-2 rounded-md hover:bg-[#162040] text-gray-300 hover:text-white"
                >
                  <Wallet className="mr-3 h-5 w-5" />
                  Investments
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/history"
                  className="flex items-center p-2 rounded-md hover:bg-[#162040] text-gray-300 hover:text-white"
                >
                  <History className="mr-3 h-5 w-5" />
                  History
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/verification"
                  className="flex items-center p-2 rounded-md hover:bg-[#162040] text-gray-300 hover:text-white"
                >
                  <User className="mr-3 h-5 w-5" />
                  Verification
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/support"
                  className="flex items-center p-2 rounded-md hover:bg-[#162040] text-gray-300 hover:text-white"
                >
                  <LifeBuoy className="mr-3 h-5 w-5" />
                  Support
                </Link>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="flex items-center p-2 rounded-md hover:bg-[#162040] text-gray-300 hover:text-white w-full text-left"
                >
                  <LogOut className="mr-3 h-5 w-5" />
                  Logout
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-[#0a1735] z-10 border-b border-[#253256]">
        <div className="flex items-center justify-between p-4">
          <Link href="/" className="flex items-center">
            <div className="relative w-8 h-8 rounded-full overflow-hidden">
              <Image src="/logo.png" alt="MXTM Investment" fill className="object-cover" />
            </div>
            <span className="ml-2 font-medium text-white text-sm">MXTM</span>
          </Link>
          <div className="flex items-center">
            <Link href="/dashboard" className="mr-4">
              <Home className="h-5 w-5 text-white" />
            </Link>
            <button onClick={handleLogout}>
              <LogOut className="h-5 w-5 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-8 pt-20 md:pt-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center mb-6">
            <Link href="/dashboard" className="mr-4 text-gray-400 hover:text-white">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-2xl font-bold text-white">Deposit Funds</h1>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Card className="bg-[#0a1735] border-[#253256] text-white">
            <CardHeader>
              <CardTitle>Add Funds to Your Account</CardTitle>
              <CardDescription className="text-gray-400">
                Choose your preferred payment method and amount
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (EUR)</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="Enter amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="bg-[#162040] border-[#253256] text-white"
                    min="50"
                    step="0.01"
                  />
                  <p className="text-xs text-gray-400">Minimum deposit: €50</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="payment-method">Payment Method</Label>
                  <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                    <SelectTrigger className="bg-[#162040] border-[#253256] text-white">
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0a1735] border-[#253256] text-white">
                      <SelectItem value="credit_card">
                        <div className="flex items-center">
                          <CreditCard className="h-4 w-4 mr-2" />
                          Credit/Debit Card
                        </div>
                      </SelectItem>
                      <SelectItem value="bank_transfer">
                        <div className="flex items-center">
                          <Building2 className="h-4 w-4 mr-2" />
                          Bank Transfer
                        </div>
                      </SelectItem>
                      <SelectItem value="crypto">
                        <div className="flex items-center">
                          <Wallet className="h-4 w-4 mr-2" />
                          Cryptocurrency
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Cryptocurrency Selection */}
                {paymentMethod === "crypto" && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="crypto-type">Select Cryptocurrency</Label>
                      <Select value={cryptoType} onValueChange={setCryptoType}>
                        <SelectTrigger className="bg-[#162040] border-[#253256] text-white">
                          <SelectValue placeholder="Choose cryptocurrency" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#0a1735] border-[#253256] text-white">
                          <SelectItem value="bitcoin">Bitcoin (BTC)</SelectItem>
                          <SelectItem value="ethereum">Ethereum (ETH)</SelectItem>
                          <SelectItem value="usdt_erc20">USDT (ERC-20)</SelectItem>
                          <SelectItem value="usdt_bep20">USDT (BEP-20)</SelectItem>
                          <SelectItem value="usdt_trc20">USDT (TRC-20)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Show crypto address when crypto type is selected */}
                    {cryptoType && (
                      <Card className="bg-[#162040] border-[#253256]">
                        <CardHeader>
                          <CardTitle className="text-lg text-white flex items-center">
                            <Wallet className="h-5 w-5 mr-2 text-[#f9a826]" />
                            {cryptoType === "bitcoin"
                              ? "Bitcoin"
                              : cryptoType === "ethereum"
                                ? "Ethereum"
                                : cryptoType === "usdt_erc20"
                                  ? "USDT (ERC-20)"
                                  : cryptoType === "usdt_bep20"
                                    ? "USDT (BEP-20)"
                                    : cryptoType === "usdt_trc20"
                                      ? "USDT (TRC-20)"
                                      : "Crypto"}{" "}
                            Deposit Address
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <Label className="text-gray-300">Wallet Address</Label>
                            <div className="flex items-center space-x-2">
                              <Input
                                value={CRYPTO_ADDRESSES[cryptoType as keyof typeof CRYPTO_ADDRESSES]}
                                readOnly
                                className="bg-[#0a1735] border-[#253256] text-white font-mono text-sm"
                              />
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() =>
                                  copyToClipboard(
                                    CRYPTO_ADDRESSES[cryptoType as keyof typeof CRYPTO_ADDRESSES],
                                    cryptoType,
                                  )
                                }
                                className="border-[#253256] hover:bg-[#253256]"
                              >
                                {copied === cryptoType ? (
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                ) : (
                                  <Copy className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                            {copied === cryptoType && (
                              <p className="text-xs text-green-500">Address copied to clipboard!</p>
                            )}
                          </div>

                          <Alert className="bg-red-500/10 border-red-500">
                            <AlertCircle className="h-4 w-4 text-red-500" />
                            <AlertDescription className="text-red-500">
                              <strong>IMPORTANT:</strong> Only send{" "}
                              {cryptoType === "bitcoin"
                                ? "Bitcoin (BTC)"
                                : cryptoType === "ethereum"
                                  ? "Ethereum (ETH)"
                                  : cryptoType.includes("usdt")
                                    ? `USDT on ${CRYPTO_NETWORKS[cryptoType as keyof typeof CRYPTO_NETWORKS]} network`
                                    : "the selected cryptocurrency"}{" "}
                              to this address. Sending other coins or wrong network will result in permanent loss!
                            </AlertDescription>
                          </Alert>

                          <div className="bg-[#0a1735] p-4 rounded-lg">
                            <h4 className="font-medium text-white mb-3">Deposit Instructions:</h4>
                            <ol className="text-sm text-gray-300 space-y-2">
                              <li className="flex items-start">
                                <span className="bg-[#f9a826] text-black rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-2 mt-0.5">
                                  1
                                </span>
                                Copy the wallet address above
                              </li>
                              <li className="flex items-start">
                                <span className="bg-[#f9a826] text-black rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-2 mt-0.5">
                                  2
                                </span>
                                Send your{" "}
                                {cryptoType === "bitcoin" ? "Bitcoin" : cryptoType === "ethereum" ? "Ethereum" : "USDT"}{" "}
                                to this address
                              </li>
                              <li className="flex items-start">
                                <span className="bg-[#f9a826] text-black rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-2 mt-0.5">
                                  3
                                </span>
                                Wait for {CRYPTO_CONFIRMATIONS[cryptoType as keyof typeof CRYPTO_CONFIRMATIONS]} network
                                confirmations
                              </li>
                              <li className="flex items-start">
                                <span className="bg-[#f9a826] text-black rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-2 mt-0.5">
                                  4
                                </span>
                                Your balance will be updated automatically
                              </li>
                            </ol>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div className="bg-[#0a1735] p-3 rounded-lg">
                              <p className="text-gray-400 mb-1">Network:</p>
                              <p className="text-white font-medium">
                                {CRYPTO_NETWORKS[cryptoType as keyof typeof CRYPTO_NETWORKS]}
                              </p>
                            </div>
                            <div className="bg-[#0a1735] p-3 rounded-lg">
                              <p className="text-gray-400 mb-1">Required Confirmations:</p>
                              <p className="text-white font-medium">
                                {CRYPTO_CONFIRMATIONS[cryptoType as keyof typeof CRYPTO_CONFIRMATIONS]} blocks
                              </p>
                            </div>
                          </div>

                          {/* Network-specific warnings */}
                          {cryptoType.includes("usdt") && (
                            <Alert className="bg-yellow-500/10 border-yellow-500">
                              <AlertCircle className="h-4 w-4 text-yellow-500" />
                              <AlertDescription className="text-yellow-500">
                                <strong>Network Warning:</strong> Make sure you're sending USDT on the{" "}
                                <strong>
                                  {cryptoType === "usdt_erc20"
                                    ? "Ethereum (ERC-20)"
                                    : cryptoType === "usdt_bep20"
                                      ? "Binance Smart Chain (BEP-20)"
                                      : "Tron (TRC-20)"}
                                </strong>{" "}
                                network only. Wrong network = lost funds!
                              </AlertDescription>
                            </Alert>
                          )}
                        </CardContent>
                      </Card>
                    )}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-[#f9a826] hover:bg-[#f9a826]/90 text-black font-medium"
                  disabled={processing || !amount || !paymentMethod || (paymentMethod === "crypto" && !cryptoType)}
                >
                  {processing ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                      Processing...
                    </div>
                  ) : paymentMethod === "crypto" ? (
                    "Confirm Crypto Deposit"
                  ) : (
                    "Confirm Deposit"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Payment Methods Info */}
          <Card className="bg-[#0a1735] border-[#253256] text-white mt-6">
            <CardHeader>
              <CardTitle className="text-lg">Payment Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CreditCard className="h-5 w-5 text-[#f9a826] mt-0.5" />
                  <div>
                    <h4 className="font-medium">Credit/Debit Card</h4>
                    <p className="text-sm text-gray-400">Instant processing • 0% fees</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Building2 className="h-5 w-5 text-[#f9a826] mt-0.5" />
                  <div>
                    <h4 className="font-medium">Bank Transfer</h4>
                    <p className="text-sm text-gray-400">1-3 business days • No fees</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Wallet className="h-5 w-5 text-[#f9a826] mt-0.5" />
                  <div>
                    <h4 className="font-medium">Cryptocurrency</h4>
                    <p className="text-sm text-gray-400">
                      BTC: 30-60 min • ETH: 5-15 min • USDT: 5-30 min • Network fees apply
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Success Modal */}
      {success && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#0a1735] border border-[#253256] rounded-lg p-8 max-w-md w-full mx-4">
            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-full bg-green-500/20 flex items-center justify-center mb-6">
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">
                {paymentMethod === "crypto" ? "Crypto Deposit Initiated!" : "Deposit Submitted!"}
              </h2>
              <p className="text-gray-300 mb-6">
                {paymentMethod === "crypto"
                  ? `Please send your ${
                      cryptoType === "bitcoin" ? "Bitcoin" : cryptoType === "ethereum" ? "Ethereum" : "USDT"
                    } to the provided address. Your deposit will be processed after network confirmations.`
                  : `Your deposit request for €${amount} has been successfully submitted. We will process your request within 24 hours.`}
              </p>
              <Button className="bg-[#f9a826] hover:bg-[#f9a826]/90 text-black" onClick={() => setSuccess(false)}>
                Continue
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
