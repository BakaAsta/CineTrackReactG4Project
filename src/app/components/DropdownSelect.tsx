"use client";

import { useEffect, useId, useRef, useState } from "react";

interface DropdownOption<T extends string> {
  value: T;
  label: string;
}

interface DropdownSelectProps<T extends string> {
  label?: string;
  value: T;
  options: DropdownOption<T>[];
  onChange: (value: T) => void;
  buttonClassName?: string;
  menuClassName?: string;
  labelClassName?: string;
  valueClassName?: string;
  optionClassName?: string;
  leadingContent?: React.ReactNode;
}

export default function DropdownSelect<T extends string>({
  label,
  value,
  options,
  onChange,
  buttonClassName = "",
  menuClassName = "",
  labelClassName = "",
  valueClassName = "",
  optionClassName = "",
  leadingContent,
}: DropdownSelectProps<T>) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const listboxId = useId();

  const selectedOption =
    options.find((option) => option.value === value) ?? options[0];

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div ref={rootRef} className={`relative ${open ? "z-50" : "z-10"}`}>
      {label ? (
        <span
          className={`mb-2 block text-xs font-medium uppercase tracking-[0.24em] text-white/45 ${labelClassName}`}
        >
          {label}
        </span>
      ) : null}

      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        onClick={() => setOpen((current) => !current)}
        className={`flex w-full items-center justify-between gap-3 rounded-[22px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] px-4 py-3 text-left text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] outline-none transition duration-200 hover:border-white/20 hover:bg-white/8 focus:border-[#a855f7] focus:shadow-[0_0_0_4px_rgba(124,58,237,0.16)] ${open ? "border-[#a855f7]/70 bg-[rgba(124,58,237,0.12)]" : ""} ${buttonClassName}`}
      >
        <span className="flex min-w-0 items-center gap-3">
          {leadingContent}
          <span className={`truncate text-sm font-medium ${valueClassName}`}>
            {selectedOption?.label}
          </span>
        </span>

        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          className={`h-4 w-4 shrink-0 text-white/70 transition duration-200 ${open ? "rotate-180 text-[#c9a5ff]" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <path d="M5 7.5 10 12.5 15 7.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open ? (
        <div
          className={`absolute left-0 right-0 top-[calc(100%+0.75rem)] z-[70] overflow-hidden rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(22,22,31,0.98),rgba(11,11,15,0.98))] p-2 shadow-[0_28px_80px_rgba(0,0,0,0.45),0_0_0_1px_rgba(168,85,247,0.08)] backdrop-blur-xl ${menuClassName}`}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-8 top-0 h-10 rounded-full bg-[#7c3aed]/18 blur-2xl"
          />
          <ul id={listboxId} role="listbox" className="relative flex flex-col gap-1">
            {options.map((option) => {
              const isActive = option.value === value;

              return (
                <li key={option.value} role="option" aria-selected={isActive}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(option.value);
                      setOpen(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-[18px] px-4 py-3 text-sm transition duration-150 ${
                      isActive
                        ? "border border-[#a855f7]/35 bg-[linear-gradient(135deg,rgba(124,58,237,0.26),rgba(168,85,247,0.12))] text-white shadow-[0_12px_30px_rgba(124,58,237,0.18)]"
                        : "border border-transparent text-white/76 hover:border-white/8 hover:bg-white/6 hover:text-white"
                    } ${optionClassName}`}
                  >
                    <span>{option.label}</span>
                    {isActive ? (
                      <span className="h-2 w-2 rounded-full bg-[#c084fc]" />
                    ) : null}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
