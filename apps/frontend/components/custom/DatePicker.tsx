"use client";

import { format } from "date-fns";
import { CalendarIcon, XIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {Input} from "@/components/ui/input";

export function DatePicker({
  date,
  setDate,
  onDisableDate,
}: Readonly<{
  date?: Date;
  setDate: (date?: Date) => void;
  onDisableDate?: (date: Date) => boolean;
}>) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="relative">
          <Input value={date ? format(date, "dd/MM/yyyy") : "Seleziona una data"} className="pl-10"/>
          <CalendarIcon className="absolute top-[6px] left-2 cursor-pointer scale-80"/>
          { date && <XIcon className="absolute top-[6px] right-2 cursor-pointer scale-85" onClick={(evt) => {
            evt.stopPropagation()
            setDate(undefined)
          }}/> }
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
          disabled={onDisableDate}
        />
      </PopoverContent>
    </Popover>
  );
}
