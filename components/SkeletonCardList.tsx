"use client";

import { SkeletonCard } from "./SkeletonCard";

 // Ensure this file exists or adjust the path





export function SkeletonCardList({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}