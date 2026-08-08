import { Skeleton } from '@/components/ui/skeleton';

/** Layout-preserving skeletons so panels never flash empty. */
export function MetadataSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_unused, index) => (
        <div key={index} className="space-y-2">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-4 w-24" />
        </div>
      ))}
    </div>
  );
}

export function ClipListSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 4 }).map((_unused, index) => (
        <Skeleton key={index} className="h-16 w-full rounded-lg" />
      ))}
    </div>
  );
}

export function TimelineSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_unused, index) => (
        <div key={index} className="flex items-center gap-3">
          <Skeleton className="size-6 rounded-full" />
          <Skeleton className="h-4 flex-1" />
        </div>
      ))}
    </div>
  );
}
