"use client";

import { useRef } from "react";
import { Input } from "@/components/ui/input";

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  name?: string;
  id?: string;
}

function applyMask(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 11);
  if (digits.length === 0) return "";
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export function PhoneInput({ value, onChange, name, id }: PhoneInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const masked = applyMask(e.target.value);
    onChange(masked);
  }

  return (
    <Input
      ref={inputRef}
      id={id}
      name={name}
      type="tel"
      inputMode="numeric"
      value={value}
      onChange={handleChange}
      placeholder="(11) 99999-9999"
      maxLength={15}
      className="h-10"
      required
    />
  );
}
