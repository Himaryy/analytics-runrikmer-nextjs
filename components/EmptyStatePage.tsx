export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-10">
      <div className="size-10 rounded-full grid place-items-center bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
        !
      </div>
      <div className="text-sm text-muted-foreground">
        No overdue items found for current filters.
      </div>
      <div className="text-xs text-zinc-500">
        Try clearing filters or adjusting your search.
      </div>
    </div>
  );
}
