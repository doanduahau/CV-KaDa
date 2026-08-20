import { Skeleton } from "@/components/ui/Skeleton";

export default function AssessmentsLoading() {
  return (
    <div className="space-y-4" role="status" aria-live="polite" aria-busy="true">
      <span className="sr-only">Đang tải danh sách bài đánh giá...</span>
      <Skeleton className="h-20 w-full" />
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-48 w-full" />
    </div>
  );
}
