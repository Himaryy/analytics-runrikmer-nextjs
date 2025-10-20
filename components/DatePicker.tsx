"use client";
import * as React from "react";
import { format, parse } from "date-fns";
import { id } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const MASK = "d MMMM yyyy"; // 18 Oktober 2025

function formatDate(date: Date | undefined) {
  return date ? format(date, MASK, { locale: id }) : "";
}

function isValidDate(date: Date | undefined) {
  return date && !isNaN(date.getTime());
}

type Props = {
  value?: Date;
  onChange?: (d?: Date) => void;
};

export function DatePicker({ value, onChange }: Props) {
  const [open, setOpen] = React.useState(false);
  const [text, setText] = React.useState(formatDate(value));

  React.useEffect(() => setText(formatDate(value)), [value]);

  const handleText: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const v = e.target.value;
    setText(v);
    const parsed = parse(v, MASK, new Date(), { locale: id });
    if (isValidDate(parsed)) onChange?.(parsed);
  };

  const handleKey: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="relative flex gap-2">
        <Input
          id="date"
          value={text}
          placeholder="Masukan Tanggal Service"
          className="bg-background pr-10"
          onChange={handleText}
          onKeyDown={handleKey}
        />
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              id="date-picker"
              variant="ghost"
              className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
            >
              <CalendarIcon className="size-3.5" />
              <span className="sr-only">Pilih tanggal</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto overflow-hidden p-0"
            align="end"
            alignOffset={-8}
            sideOffset={10}
          >
            <Calendar
              mode="single"
              selected={value}
              captionLayout="dropdown" // ← month/year dropdowns kept
              month={value}
              onMonthChange={onChange}
              onSelect={onChange}
              locale={id} // ← Indonesian month names
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
