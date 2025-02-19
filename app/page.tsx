"use client";

import { formatDistanceToNow } from "date-fns";
import { useEffect, useState } from "react";

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
    const interval = setInterval(fetchOTP, 10000); // Poll every 10 seconds
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
    </div>
  );
}
