"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useFontStore } from '@/hooks/use-font-store';

const fonts = [
  { value: 'inter', label: 'Inter' },
  { value: 'roboto', label: 'Roboto' },
  { value: 'open-sans', label: 'Open Sans' },
  { value: 'lora', label: 'Lora' },
];

export function FontSelector() {
  const { font, setFont } = useFontStore();

  return (
    <Select value={font} onValueChange={setFont}>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Select font" />
      </SelectTrigger>
      <SelectContent>
        {fonts.map((f) => (
          <SelectItem key={f.value} value={f.value}>
            {f.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}