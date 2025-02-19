"use client";

import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";

interface OTPData {
  value: string | null;
  timestamp: string | null;
}

export default function Home() {
  const [otpData, setOtpData] = useState<OTPData>({
    value: null,
    timestamp: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOTP = async () => {
      try {
        const response = await fetch("/api/otp");
        const data = await response.json();
        setOtpData(data);
      } catch (error) {
        console.error("Failed to fetch OTP:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOTP();
    const interval = setInterval(fetchOTP, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="p-4">
            <h1 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">
              Current OTP
            </h1>

            {loading ? (
              <div className="animate-pulse h-8 bg-gray-200 dark:bg-gray-700 rounded mt-2"></div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-baseline justify-between">
                  <span className="text-3xl font-mono font-bold text-gray-900 dark:text-gray-100">
                    {otpData.value || "—"}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {otpData.timestamp
                      ? `Updated ${formatDistanceToNow(
                          new Date(otpData.timestamp)
                        )} ago`
                      : "No updates yet"}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
