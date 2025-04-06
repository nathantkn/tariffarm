"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from 'next/navigation';
import Lottie from "lottie-react";
import loading from '@/assets/loading.json';

export default function Home() {
  const router = useRouter();
  const [dots, setDots] = useState(0);

  useEffect(() => {
    const dotInterval = setInterval(() => {
      setDots((prev) => (prev + 1) % 4); 
    }, 500);

    const redirectTimer = setTimeout(() => {
      router.push('/globe');
    }, 2000);

    return () => {
      clearInterval(dotInterval);
      clearTimeout(redirectTimer);
    };
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Lottie animationData={loading} loop={true} />
      <h1 className="text-3xl font-bold mt-4">
        Loading{'.'.repeat(dots)}
      </h1>
    </div>
  );
}