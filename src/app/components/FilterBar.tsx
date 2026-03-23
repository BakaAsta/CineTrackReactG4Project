import { MediaType } from "../types/media-type";
import { Status } from "../types/status";
import { SortOption, mediaTypeOptions, sortOptions, statusOptions } from "../lib/cine-track";
import DropdownSelect from "./DropdownSelect";

interface FilterBarProps {
  totalItems: number;
  statusFilter: Status | "all";
  typeFilter: MediaType | "all";
  sortBy: SortOption;
  onStatusFilterChange: (value: Status | "all") => void;
  onTypeFilterChange: (value: MediaType | "all") => void;
  onSortChange: (value: SortOption) => void;
}

function FilterSelect<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: Array<{ value: T; label: string }>;
  onChange: (value: T) => void;
}) {
  return (
    <div className="min-w-44">
      <DropdownSelect
        label={label}
        value={value}
        options={options}
        onChange={onChange}
        buttonClassName="min-h-14"
      />
    </div>
  );
}

export default function FilterBar({
  totalItems,
  statusFilter,
  typeFilter,
  sortBy,
  onStatusFilterChange,
  onTypeFilterChange,
  onSortChange,
}: FilterBarProps) {
  return (
    <section className="relative z-30 rounded-[28px] border border-white/8 bg-[rgba(16,16,24,0.82)] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-[#a855f7]">
            Control Room
          </p>
          <h2 className="mt-2 text-xl font-semibold text-white">
            Curate your library with precision
          </h2>
          <p className="mt-1 text-sm text-white/55">
            {totalItems} titles visible after search, filters and sort.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <FilterSelect
            label="Status"
            value={statusFilter}
            options={[{ value: "all", label: "All statuses" }, ...statusOptions]}
            onChange={onStatusFilterChange}
          />
          <FilterSelect
            label="Format"
            value={typeFilter}
            options={mediaTypeOptions}
            onChange={onTypeFilterChange}
          />
          <FilterSelect
            label="Sort"
            value={sortBy}
            options={sortOptions}
            onChange={onSortChange}
          />
        </div>
      </div>
    </section>
  );
}
