"use client";
import { Input } from "@/components/ui/input";
import { formatRupiah } from "@/lib/formatValue";
import { useEffect, useState } from "react";

type Props = {
  value: number; // raw number from RHF
  onChange: (n: number) => void;
  placeholder?: string;
};

export function PriceInput({ value, onChange, placeholder = "Rp 0" }: Props) {
  const [display, setDisplay] = useState(formatRupiah(value));

  useEffect(() => {
    setDisplay(formatRupiah(value));
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // strip every non-digit
    const digits = e.target.value.replace(/\D/g, "");
    const num = Number(digits) || 0;
    onChange(num);
  };

  return (
    <Input value={display} onChange={handleChange} placeholder={placeholder} />
  );
}
