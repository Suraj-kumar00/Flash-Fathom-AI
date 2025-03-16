"use client";
import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const StayUpdated = () => {
  const [email, setEmail] = useState<string>("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const apiUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const response = await axios.post(`${apiUrl}/api/subscribe`, { email });

      setStatus("success");

    
      toast.success(response.data.message || "Thank you for subscribing!", {
        position: "top-right",
        autoClose: 3000,
      });

      setEmail("");
    } catch (error: any) {
      setStatus("error");


      toast.error(
        error.response?.data?.message || "Failed to subscribe. Please try again.",
        {
          position: "top-right",
          autoClose: 3000,
        }
      );
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border border-gray-300 rounded px-4 py-2 w-full sm:w-auto dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="bg-purple-600 text-white rounded px-4 py-2 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600"
        >
          {status === "loading" ? "Subscribing..." : "Subscribe"}
        </button>
      </form>

      
    </div>
  );
};

export default StayUpdated;
