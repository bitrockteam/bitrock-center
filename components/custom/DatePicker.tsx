"use client";

import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import dayjs from "dayjs";
import { CalendarIcon, XIcon } from "lucide-react";
import { useState } from "react";

export function DatePicker({
  date,
  setDate,
  onDisableDate,
}: Readonly<{
  date?: Date;
  setDate: (date?: Date) => void;
  onDisableDate?: (date: Date) => boolean;
}>) {
  const [isOpen, setIsOpen] = useState(false);

  const handleClear = (evt: React.MouseEvent) => {
    evt.stopPropagation();
    setDate(undefined);
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div className="relative">
          <Input
            readOnly
            value={date ? dayjs(date).format("DD/MM/YYYY") : "Seleziona una data"}
            className="pl-10"
          />
          <CalendarIcon className="absolute top-[6px] left-2 cursor-pointer scale-80" />
          {date && (
            <XIcon
              className="absolute top-[6px] right-2 cursor-pointer scale-85"
              onClick={handleClear}
            />
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(selectedDate) => {
            console.log("Selected date:", selectedDate);

            setDate(selectedDate);
            setIsOpen(false);
          }}
          initialFocus
          disabled={onDisableDate}
        />
      </PopoverContent>
    </Popover>
  );
}
