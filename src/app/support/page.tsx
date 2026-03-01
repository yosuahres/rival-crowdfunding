"use client";

import Image from "next/image";
import { useState, useEffect, useCallback } from "react";

interface PaymentData {
  qr_content: string | null;
  expired_date: string | null;
  invoice_number: string;
  reference_no: string | null;
  amount: number;
}

export default function SupportPage() {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [successData, setSuccessData] = useState<{ reference: string } | null>(null);
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<"pending" | "success" | "failed">("pending");
  const [errorMsg, setErrorMsg] = useState("");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [gender, setGender] = useState("male");

  const [donationType, setDonationType] = useState<"package" | "custom">("package");
  const [selectedPackage, setSelectedPackage] = useState(1);
  const [amount, setAmount] = useState("");
  const [payment, setPayment] = useState("");
  const [message, setMessage] = useState("");

  const packages = [
    {
      id: 1,
      name: "Package 1",
      price: 350000,
      perks: "Placement name rover (h=0.5 cm), Keychain 1, Sticker, Website mention",
    },
    {
      id: 2,
      name: "Package 2",
      price: 450000,
      perks: "Placement name rover (h=0.8 cm) and IG, Keychain 2, Sticker, Website mention",
    },
    {
      id: 3,
      name: "Package 3",
      price: 600000,
      perks:
        "Placement name rover (h=1.5 cm) and IG, Sticker, Keychain 3, Sticker, Website mention",
    },
    {
      id: 4,
      name: "Package 4",
      price: 1000000,
      perks:
        "Placement name rover (h=2 cm) and IG, Keychain 4, Sticker, Website mention, Gacoan Bareng VIP Access",
    },
  ];

  const formatRupiah = (val: number) => "Rp" + val.toLocaleString("id-ID");

  const pollStatus = useCallback(async () => {
    if (!paymentData) return;
    try {
      const res = await fetch(`/api/donations/status?invoice=${paymentData.invoice_number}`);
      const result = await res.json();
      if (result.status === "success") {
        setPaymentStatus("success");
        setSuccessData({ reference: paymentData.invoice_number });
        setPaymentData(null);
      } else if (result.status === "failed") {
        setPaymentStatus("failed");
        setPaymentData(null);
      }
    } catch {}
  }, [paymentData]);

  useEffect(() => {
    if (!paymentData || paymentStatus !== "pending") return;
    const interval = setInterval(pollStatus, 5000);
    return () => clearInterval(interval);
  }, [paymentData, paymentStatus, pollStatus]);

  return (
    <main className="mx-auto flex max-w-3xl flex-col items-center gap-10 px-4 py-16 sm:px-6 lg:px-8">
      <div className="w-full overflow-hidden rounded-2xl">
        <Image
          src="/assets/web-banner/zero-banner.jpg"
          alt="Rival ITS Banner"
          width={1200}
          height={400}
          className="h-auto w-full object-cover"
          priority
        />
      </div>

      <p className="bg-gradient-to-r from-[#bdb88e] via-[#ffffff] to-[#8eac7a] bg-clip-text text-center text-lg font-bold tracking-tight text-transparent">
        #YourSupportMatters
      </p>

      <p className="-mt-6 w-full text-justify text-sm leading-relaxed text-white/80 sm:text-base">
        Welcome to Rival&apos;s <span className="font-semibold text-white">#GibranJamet</span>{" "}
        Crowdfunding Program. Gibran jamet banget gilak.{" "}
        <span className="font-semibold text-white">#GibranJamet⚡</span>
      </p>

      <div className="flex w-full items-start gap-0">
        <div className="flex flex-1 flex-col gap-2">
          <span className={`text-sm font-semibold ${step >= 1 ? "text-white" : "text-white/40"}`}>
            1. Personal Data
          </span>
          <div className="h-1.5 w-full rounded-full bg-white/20">
            <div
              className={`h-full rounded-full transition-all duration-500 ${step >= 1 ? "w-full bg-[#8eac7a]" : "w-0"}`}
            />
          </div>
        </div>

        {/* Step 2 */}
        <div className="flex flex-1 flex-col gap-2">
          <span className={`text-sm font-semibold ${step >= 2 ? "text-white" : "text-white/40"}`}>
            2. Payment
          </span>
          <div className="h-1.5 w-full rounded-full bg-white/20">
            <div
              className={`h-full rounded-full transition-all duration-500 ${step >= 2 ? "w-full bg-[#8eac7a]" : "w-0"}`}
            />
          </div>
        </div>
      </div>

      {/* QRIS Payment View */}
      {paymentData && paymentStatus === "pending" && (
        <div className="flex w-full flex-col items-center gap-6 text-center">
          <h3 className="text-xl font-bold text-white">Scan QRIS to Pay</h3>
          <p className="text-sm text-white/70">
            Amount:{" "}
            <span className="font-bold text-[#8eac7a]">{formatRupiah(paymentData.amount)}</span>
          </p>

          {paymentData.qr_content ? (
            <img
              src={`/api/qrcode?data=${encodeURIComponent(paymentData.qr_content)}`}
              alt="QRIS Payment Code"
              className="w-full rounded-2xl"
            />
          ) : (
            <Image
              src="/assets/code.jpeg"
              alt="QRIS Payment Code"
              width={800}
              height={800}
              className="w-full rounded-2xl"
            />
          )}

          <p className="text-xs text-white/50">
            Invoice: <span className="font-mono">{paymentData.invoice_number}</span>
          </p>

          <a
            href="/assets/code.jpeg"
            download="QRIS-Payment.jpeg"
            className="inline-flex items-center gap-2 rounded-full border border-[#8eac7a] px-6 py-2.5 text-sm font-medium text-[#8eac7a] transition-all hover:bg-[#8eac7a]/10"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Download QR Code
          </a>
        </div>
      )}

      {paymentStatus === "failed" && !successData && (
        <div className="flex w-full flex-col items-center gap-4 rounded-2xl border border-red-400/30 bg-red-900/20 p-8 text-center">
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#f87171"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
          <h3 className="text-xl font-bold text-white">Payment Failed or Expired</h3>
          <p className="text-sm text-white/70">
            Your payment could not be completed. Please try again.
          </p>
          <button
            type="button"
            onClick={() => {
              setPaymentStatus("pending");
              setPaymentData(null);
              setStep(2);
            }}
            className="inline-flex items-center gap-2 rounded-full bg-[#145127] px-6 py-2.5 text-sm font-medium text-white transition-all hover:bg-[#1a6b34]"
          >
            Try Again
          </button>
        </div>
      )}

      {successData && (
        <div className="flex w-full flex-col items-center gap-4 rounded-2xl border border-[#8eac7a]/30 bg-[#145127]/40 p-8 text-center">
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#8eac7a"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          <h3 className="text-xl font-bold text-white">Payment Successful!</h3>
          <p className="text-sm text-white/70">
            Thank you for your support! Your donation has been confirmed.
          </p>
          <p className="text-sm text-white/70">Reference ID:</p>
          <p className="font-mono text-sm font-bold text-[#8eac7a]">{successData.reference}</p>
        </div>
      )}

      {!successData && !paymentData && paymentStatus !== "failed" && (
        <form
          className="flex w-full flex-col gap-8"
          onSubmit={async (e) => {
            e.preventDefault();
            setErrorMsg("");

            if (step === 1) {
              setStep(2);
              return;
            }

            if (step === 2) {
              if (donationType === "custom") {
                const parsed = Number(amount);
                if (isNaN(parsed) || parsed < 5000) {
                  setErrorMsg("Minimum donation is IDR 5,000.");
                  return;
                }
              }
              setStep(3);
              return;
            }

            setSubmitting(true);
            try {
              const res = await fetch("/api/donations", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  donor_name: name,
                  donor_email: email,
                  donor_phone: phone,
                  donor_address: address,
                  donor_gender: gender,
                  amount:
                    donationType === "package"
                      ? packages.find((p) => p.id === selectedPackage)!.price
                      : Number(amount),
                }),
              });

              const result = await res.json();

              if (!res.ok) {
                setErrorMsg(result.error || "Something went wrong.");
                return;
              }

              if (result.payment) {
                setPaymentData(result.payment);
                setPaymentStatus("pending");
              } else {
                setErrorMsg("Payment generation failed. Please try again.");
              }
            } catch {
              setErrorMsg("Network error. Please try again.");
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {step === 1 && (
            <>
              <div className="flex flex-col gap-2">
                <label htmlFor="name" className="text-sm font-bold text-white">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="rounded-lg border border-white/20 bg-transparent px-4 py-3 text-sm text-white placeholder-white/40 outline-none transition focus:border-[#8eac7a] focus:ring-1 focus:ring-[#8eac7a]"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="phone" className="text-sm font-bold text-white">
                  Phone Number
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Input your phone number"
                  className="rounded-lg border border-white/20 bg-transparent px-4 py-3 text-sm text-white placeholder-white/40 outline-none transition focus:border-[#8eac7a] focus:ring-1 focus:ring-[#8eac7a]"
                />
                <p className="text-xs text-white/50">Use +62 or 08 format. Ex: +6281234567890</p>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-sm font-bold text-white">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="rounded-lg border border-white/20 bg-transparent px-4 py-3 text-sm text-white placeholder-white/40 outline-none transition focus:border-[#8eac7a] focus:ring-1 focus:ring-[#8eac7a]"
                />
                <p className="text-xs text-white/50">Ex: example@gmail.com</p>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="address" className="text-sm font-bold text-white">
                  Address
                </label>
                <input
                  id="address"
                  name="address"
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter your address"
                  className="rounded-lg border border-white/20 bg-transparent px-4 py-3 text-sm text-white placeholder-white/40 outline-none transition focus:border-[#8eac7a] focus:ring-1 focus:ring-[#8eac7a]"
                />
                <p className="text-xs text-white/50">
                  Use full address format. Ex: Jl. Raya Kebayoran Baru No. 123, RT.1/RW.1, Kebayoran
                  Baru, Kec. Kebayoran Baru, Kota Jakarta Selatan, Daerah Khusus Ibukota Jakarta
                  12110
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <span className="text-sm font-bold text-white">Gender</span>
                <label
                  className="flex cursor-pointer items-center gap-3 text-sm text-white"
                  onClick={() => setGender("male")}
                >
                  <span className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-white">
                    {gender === "male" && <span className="h-3 w-3 rounded-full bg-[#8eac7a]" />}
                  </span>
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={gender === "male"}
                    readOnly
                    className="sr-only"
                  />
                  Male
                </label>
                <label
                  className="flex cursor-pointer items-center gap-3 text-sm text-white"
                  onClick={() => setGender("female")}
                >
                  <span className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-white">
                    {gender === "female" && <span className="h-3 w-3 rounded-full bg-[#8eac7a]" />}
                  </span>
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={gender === "female"}
                    readOnly
                    className="sr-only"
                  />
                  Female
                </label>
              </div>

              <div className="mt-4 flex items-center justify-center gap-4">
                <button
                  type="button"
                  disabled
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-2.5 text-sm font-medium text-white/40"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                  Previous
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-full bg-[#145127] px-6 py-2.5 text-sm font-medium text-white transition-all hover:bg-[#1a6b34]"
                >
                  Next
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="flex flex-col gap-3">
                <span className="text-sm font-bold text-white">Type</span>
                <label
                  className="flex cursor-pointer items-center gap-3 text-sm text-white"
                  onClick={() => setDonationType("package")}
                >
                  <span className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-white">
                    {donationType === "package" && (
                      <span className="h-3 w-3 rounded-full bg-[#8eac7a]" />
                    )}
                  </span>
                  Package
                </label>
                <label
                  className="flex cursor-pointer items-center gap-3 text-sm text-white"
                  onClick={() => setDonationType("custom")}
                >
                  <span className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-white">
                    {donationType === "custom" && (
                      <span className="h-3 w-3 rounded-full bg-[#8eac7a]" />
                    )}
                  </span>
                  Custom
                </label>
              </div>

              {donationType === "package" && (
                <div className="flex flex-col gap-3">
                  <span className="text-sm font-bold text-white">Package</span>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {packages.map((pkg) => (
                      <button
                        key={pkg.id}
                        type="button"
                        onClick={() => setSelectedPackage(pkg.id)}
                        className={`relative flex flex-col gap-2 rounded-xl border p-5 text-left transition-all ${
                          selectedPackage === pkg.id
                            ? "border-[#8eac7a]"
                            : "border-white/20 hover:border-white/40"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-white/60">{pkg.name}</span>
                          <span className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-white">
                            {selectedPackage === pkg.id && (
                              <span className="h-3 w-3 rounded-full bg-[#8eac7a]" />
                            )}
                          </span>
                        </div>
                        <span className="text-lg font-bold text-white">
                          {formatRupiah(pkg.price)}
                        </span>
                        <span className="text-xs font-semibold text-[#8eac7a]">You Will Get</span>
                        <span className="text-xs leading-relaxed text-white/60">{pkg.perks}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {donationType === "custom" && (
                <div className="flex flex-col gap-2">
                  <label htmlFor="amount" className="text-sm font-bold text-white">
                    Donation Amount (IDR)
                  </label>
                  <input
                    id="amount"
                    name="amount"
                    type="number"
                    min={5000}
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Minimum 5,000"
                    className="rounded-lg border border-white/20 bg-transparent px-4 py-3 text-sm text-white placeholder-white/40 outline-none transition focus:border-[#8eac7a] focus:ring-1 focus:ring-[#8eac7a]"
                  />
                  <p className="text-xs text-white/50">Minimum donation: IDR 5,000</p>
                </div>
              )}

              <div className="mt-4 flex items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-2.5 text-sm font-medium text-white transition-all hover:bg-white/10"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                  Previous
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-full bg-[#145127] px-6 py-2.5 text-sm font-medium text-white transition-all hover:bg-[#1a6b34]"
                >
                  Next
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              </div>

              {errorMsg && (
                <p className="text-center text-sm font-medium text-red-400">{errorMsg}</p>
              )}
            </>
          )}

          {step === 3 &&
            (() => {
              const currentPkg =
                donationType === "package" ? packages.find((p) => p.id === selectedPackage) : null;
              const finalAmount =
                donationType === "package" ? currentPkg?.price || 0 : Number(amount);
              return (
                <>
                  <div className="flex w-full flex-col items-center gap-6">
                    <h2 className="text-2xl font-bold text-white sm:text-3xl">Fund Information</h2>
                    <p className="-mt-4 text-sm text-white/60">
                      Please review your details before proceeding to payment
                    </p>

                    <div className="w-full rounded-xl border border-[#bdb88e]/40 bg-[#bdb88e]/10 px-6 py-4 text-center">
                      <p className="text-sm text-[#bdb88e]">
                        Please double-check your information. Once you proceed to payment, you
                        cannot edit these details.
                      </p>
                    </div>

                    <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="flex flex-col gap-4 rounded-xl border border-white/20 bg-black/20 p-6">
                        <h3 className="text-lg font-bold text-white">Personal Information</h3>

                        <div className="flex items-start gap-3">
                          <svg
                            className="mt-0.5 shrink-0 text-[#8eac7a]"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                          </svg>
                          <div>
                            <p className="text-xs text-white/50">Name</p>
                            <p className="text-sm font-semibold text-white">{name}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <svg
                            className="mt-0.5 shrink-0 text-[#8eac7a]"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <rect x="2" y="4" width="20" height="16" rx="2" />
                            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                          </svg>
                          <div>
                            <p className="text-xs text-white/50">Email</p>
                            <p className="text-sm font-semibold text-white">{email}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <svg
                            className="mt-0.5 shrink-0 text-[#8eac7a]"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                          </svg>
                          <div>
                            <p className="text-xs text-white/50">Phone Number</p>
                            <p className="text-sm font-semibold text-white">{phone}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <svg
                            className="mt-0.5 shrink-0 text-[#8eac7a]"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <circle cx="12" cy="10" r="3" />
                            <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 7 8 11.7z" />
                          </svg>
                          <div>
                            <p className="text-xs text-white/50">Address</p>
                            <p className="text-sm font-semibold text-white">{address}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <svg
                            className="mt-0.5 shrink-0 text-[#8eac7a]"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                          </svg>
                          <div>
                            <p className="text-xs text-white/50">Gender</p>
                            <p className="text-sm font-semibold text-white">
                              {gender.charAt(0).toUpperCase() + gender.slice(1)}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-4 rounded-xl border border-white/20 bg-black/20 p-6">
                        <h3 className="text-lg font-bold text-white">
                          {donationType === "package" ? "Package Details" : "Donation Details"}
                        </h3>

                        {donationType === "package" && currentPkg && (
                          <div className="flex items-start gap-3">
                            <svg
                              className="mt-0.5 shrink-0 text-[#8eac7a]"
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
                              <path d="m3.3 7 8.7 5 8.7-5" />
                              <path d="M12 22V12" />
                            </svg>
                            <div>
                              <p className="text-sm font-semibold text-white">{currentPkg.name}</p>
                              <p className="text-xs text-white/50">{currentPkg.perks}</p>
                            </div>
                          </div>
                        )}

                        <div className="rounded-xl border border-[#8eac7a]/40 bg-[#8eac7a]/5 px-5 py-4">
                          <p className="text-xs text-white/50">
                            {donationType === "package" ? "Package Amount" : "Donation Amount"}
                          </p>
                          <p className="mt-1 text-2xl font-bold text-[#8eac7a]">
                            {formatRupiah(finalAmount)}
                          </p>
                        </div>

                        <div className="rounded-xl border border-white/20 px-5 py-4">
                          <p className="text-xs text-white/50">Payment Type</p>
                          <p className="mt-1 text-sm font-semibold text-white">
                            {donationType === "package" ? "Package" : "Custom"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-center gap-4">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="inline-flex items-center gap-2 rounded-full border border-[#8eac7a] px-6 py-2.5 text-sm font-medium text-[#8eac7a] transition-all hover:bg-[#8eac7a]/10"
                    >
                      Edit Information
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="inline-flex items-center gap-2 rounded-full bg-[#145127] px-6 py-2.5 text-sm font-medium text-white transition-all hover:bg-[#1a6b34] disabled:opacity-50"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                        <line x1="1" y1="10" x2="23" y2="10" />
                      </svg>
                      {submitting ? "Processing..." : "Proceed to Payment"}
                    </button>
                  </div>

                  {errorMsg && (
                    <p className="text-center text-sm font-medium text-red-400">{errorMsg}</p>
                  )}
                </>
              );
            })()}
        </form>
      )}
    </main>
  );
}
