import cn from "clsx";
import dayjs from "dayjs";
import LocalizedFormat from "dayjs/plugin/localizedFormat";
import { MultiplicationSignIcon } from "hugeicons-react";
import { useState } from "react";
import { DayPicker } from 'react-day-picker';
import "react-day-picker/dist/style.css";

import { useOutside } from "@/hooks/useOutside";

import "./DatePicker.css";

dayjs.extend(LocalizedFormat);

interface DatePicker {
  onChange: (value: string) => void;
  value: string;
  position?: "left" | "right";
}

export function DatePicker({
  onChange,
  value,
  position = "right",
}: DatePicker) {
  const [selected, setSelected] = useState<Date | undefined>(
    value ? new Date(value) : undefined
  );
  const { isShow, setIsShow, ref } = useOutside(false);

  const handleDaySelect = (date: Date | undefined) => {
    setSelected(date);
    if (date) {
      onChange(date.toISOString());
      setIsShow(false);
    } else {
      onChange("");
    }
  };

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setIsShow(!isShow)}>
        {selected ? dayjs(selected).format("LL") : "Click to select"}
      </button>
      {value && (
        <button
          className="absolute -top-2 -right-4 opacity-30 hover:opacity-100 transition-opacity"
          onClick={() => {
            setSelected(undefined);
            onChange("");
          }}
        >
          <MultiplicationSignIcon size={14} />
        </button>
      )}
      {isShow && (
        <div
          className={cn(
            "absolute p-2.5 slide bg-sidebar z-10 shadow rounded-lg",
            position === "left" ? "-left-4" : "-right-4"
          )}
          style={{ top: "calc(100% + .7rem)" }}
        >
          <DayPicker
            mode="single"
            selected={selected}
            onSelect={handleDaySelect}
            weekStartsOn={1}
            fromYear={2023}
            toYear={2054}
            captionLayout="dropdown" // Caption dropdown for months and years
          />
        </div>
      )}
    </div>
  );
}
