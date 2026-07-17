"use client";

import { useState, useEffect } from "react";
import { FeatureInfo, isFeatureDismissed } from "@/lib/features";
import { FeaturePopup } from "./FeaturePopup";

interface FeaturePopupQueueProps {
  features: FeatureInfo[];
  delay?: number;
}

export function FeaturePopupQueue({ features, delay = 4000 }: FeaturePopupQueueProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const nextIdx = features.findIndex((f, i) => i >= currentIndex && !isFeatureDismissed(f.id));
    if (nextIdx === -1) return;
    setCurrentIndex(nextIdx);
  }, [currentIndex, features]);

  const undismissed = features.filter((f) => !isFeatureDismissed(f.id));
  if (undismissed.length === 0) return null;

  return (
    <>
      {undismissed.slice(0, 1).map((f) => (
        <FeaturePopup key={f.id} feature={f} delay={delay} />
      ))}
    </>
  );
}
