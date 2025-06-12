"use client";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonCard() {
  return (
    <Card className="p-4 animate-pulse">
      <div className="flex flex-col gap-4">
        <Skeleton className="h-4 w-1/4 rounded" />
        <Skeleton className="h-8 w-3/4 rounded" />
        <Skeleton className="h-6 w-1/3 rounded" />
        <div className="pt-4">
          <Skeleton className="h-4 w-full rounded" />
          <Skeleton className="h-4 w-4/5 mt-2 rounded" />
        </div>
      </div>
    </Card>
  );
}