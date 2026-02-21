"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function FooterHiddenLoginTrigger({ year, brandName }) {
  const router = useRouter();
  const [tapCount, setTapCount] = useState(0);
  const [startedAt, setStartedAt] = useState(0);

  function handleHiddenLoginTrigger() {
    const now = Date.now();
    const withinWindow = startedAt && now - startedAt < 2000;
    const nextCount = withinWindow ? tapCount + 1 : 1;
    const nextStartedAt = withinWindow ? startedAt : now;

    if (nextCount >= 4) {
      setTapCount(0);
      setStartedAt(0);
      router.push("/login");
      return;
    }

    setTapCount(nextCount);
    setStartedAt(nextStartedAt);
  }

  return (
    <p className="text-gray-400 text-sm cursor-default select-none" onClick={handleHiddenLoginTrigger}>
      &copy; {year} <span className="font-semibold text-gray-200">{brandName}</span>. All rights reserved.
    </p>
  );
}
