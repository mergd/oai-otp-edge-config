"use client";

import { formatDistanceToNow } from "date-fns";
import { Copy } from "lucide-react";
import { useEffect, useState } from "react";

interface EmailOTPData {
  value: string | null;
  timestamp: string | null;
}

export default function Home() {
  const [emailOTP, setEmailOTP] = useState<EmailOTPData>({
    value: null,
    timestamp: null,
  });
  const [totp, setTOTP] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(30);
  const [copied, setCopied] = useState<"email" | "totp" | null>(null);

  // Calculate progress for the circular timer (0 to 1)
  const progress = timeLeft / 30;

  // Handle TOTP updates
  useEffect(() => {
    const updateTOTP = async () => {
      try {
        const response = await fetch("/api/totp");
        const { token } = await response.json();
        setTOTP(token);
      } catch (error) {
        console.error("Failed to generate TOTP:", error);
      }
    };

    const timer = setInterval(() => {
      const now = new Date();
      const secondsLeft = 30 - (now.getSeconds() % 30);
      setTimeLeft(secondsLeft);

      // Update TOTP when timer hits 30 or 0
      if (secondsLeft === 30) {
        updateTOTP();
      }
    }, 1000);

    // Initial TOTP fetch
    updateTOTP();

    return () => clearInterval(timer);
  }, []);

  // Handle Email OTP updates
  useEffect(() => {
    const fetchEmailOTP = async () => {
      try {
        const response = await fetch("/api/otp");
        const data = await response.json();
        setEmailOTP(data);
      } catch (error) {
        console.error("Failed to fetch Email OTP:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmailOTP();
    const interval = setInterval(fetchEmailOTP, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleCopy = async (type: "email" | "totp", value: string) => {
    if (value) {
      await navigator.clipboard.writeText(value);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto space-y-4">
          {/* TOTP Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="p-4">
              <h1 className="text-sm font-semibold uppercase text-gray-700 dark:text-gray-200 mb-1">
                TOTP Code
              </h1>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl font-mono font-bold text-gray-900 dark:text-gray-100">
                      {totp || "—"}
                    </span>
                    <button
                      onClick={() => handleCopy("totp", totp)}
                      className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      title="Copy TOTP"
                    >
                      <Copy className="w-4 h-4 text-gray-500" />
                      {copied === "totp" && (
                        <span className="absolute -mt-8 text-xs text-gray-500">
                          Copied!
                        </span>
                      )}
                    </button>
                  </div>
                  <div className="relative w-8 h-8">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="16"
                        cy="16"
                        r="14"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="none"
                        className="text-gray-200 dark:text-gray-700"
                      />
                      <circle
                        cx="16"
                        cy="16"
                        r="14"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 14}`}
                        strokeDashoffset={`${
                          2 * Math.PI * 14 * (1 - progress)
                        }`}
                        className="text-blue-500 transition-all duration-200"
                      />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-xs font-medium">
                      {timeLeft}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Email OTP Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="p-4">
              <h1 className="text-sm font-semibold uppercase text-gray-700 dark:text-gray-200 mb-1">
                Email OTP
              </h1>
              {loading ? (
                <div className="animate-pulse h-8 bg-gray-200 dark:bg-gray-700 rounded mt-2"></div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl font-mono font-bold text-gray-900 dark:text-gray-100">
                        {emailOTP.value || "—"}
                      </span>
                      <button
                        onClick={() =>
                          handleCopy("email", emailOTP.value || "")
                        }
                        className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        title="Copy Email OTP"
                      >
                        <Copy className="w-4 h-4 text-gray-500" />
                        {copied === "email" && (
                          <span className="absolute -mt-8 text-xs text-gray-500">
                            Copied!
                          </span>
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {emailOTP.timestamp
                        ? `Updated ${formatDistanceToNow(
                            new Date(emailOTP.timestamp)
                          )} ago`
                        : "No updates yet"}
                    </span>
                  </div>
                </div>
              )}
            </div>
            <p className="text-xs pt-2 pb-3 px-4 text-gray-500 dark:text-gray-400">
              Email OTP hasn&apos;t been updated? wait for at least 1 minute
              before re-requesting another OTP.
              <br />
              Soz, email OTP is not working right now.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
