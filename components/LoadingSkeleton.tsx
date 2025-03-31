'use client';

export function LoadingSkeleton() {
  return (
    <div className="flex flex-col items-center p-4 w-full h-full space-y-4">
      <div className="w-full max-w-4xl">
        <div className="mb-4 flex justify-between items-center">
          <div className="h-6 w-32 bg-muted animate-pulse rounded" />
          <div className="flex items-center gap-2">
            <div className="h-8 w-44 bg-muted animate-pulse rounded-md" />
            <div className="h-8 w-44 bg-muted animate-pulse rounded-md" />
          </div>
        </div>
        <div className="h-[600px] w-full border rounded-lg overflow-hidden bg-background relative mb-4">
          <div className="absolute inset-0 bg-muted/10">
            <div className="absolute inset-0" style={{
              backgroundImage: `
                linear-gradient(to right, var(--tw-gradient-from) 1px, transparent 1px),
                linear-gradient(to bottom, var(--tw-gradient-from) 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px',
              opacity: 0.1
            }} />
            <div className="absolute left-[20%] top-[30%] w-32 h-32 bg-muted animate-pulse rounded-lg" />
            <div className="absolute right-[30%] top-[20%] w-24 h-24 bg-muted animate-pulse rounded-full" />
            <div className="absolute left-[40%] bottom-[20%] w-40 h-20 bg-muted animate-pulse rounded" />
          </div>
        </div>
        <div className="w-full flex items-center gap-2">
          <div className="h-8 w-full bg-muted animate-pulse rounded-md" />
          <div className="h-8 w-36 bg-muted animate-pulse rounded-md" />
        </div>
      </div>
    </div>
  );
} 