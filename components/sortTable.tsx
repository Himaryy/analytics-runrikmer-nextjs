import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { TableHead } from "./ui/table";
import { Button } from "./ui/button";

export type SortKey = "invoice" | "tanggal_service";
export type SortDir = "asc" | "desc";

export function ThSort({
  children,
  active,
  dir,
  onClick,
  className = "",
}: {
  children: React.ReactNode;
  active?: boolean;
  dir?: SortDir;
  onClick: () => void;
  className?: string;
}) {
  const Icon = !active ? ArrowUpDown : dir === "asc" ? ArrowUp : ArrowDown;
  return (
    <>
      <TableHead className={`whitespace-nowrap ${className}`}>
        <Button
          variant="ghost"
          className="px-0 font-normal hover:bg-transparent"
          onClick={onClick}
          title="Klik untuk urutkan"
        >
          <span className="mr-2">{children}</span>
          <Icon className="h-4 w-4" />
        </Button>
      </TableHead>
    </>
  );
}
