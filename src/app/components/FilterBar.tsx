import { MediaType } from "../types/media-type";
import { Status } from "../types/status";
import { SortOption, mediaTypeOptions, sortOptions, statusOptions } from "../lib/cine-track";
import DropdownSelect from "./DropdownSelect";

interface FilterBarProps {
  totalItems: number;
  statusFilter: Status | "all";
  typeFilter: MediaType | "all";
  sortBy: SortOption;
  hasActiveFilters: boolean;
  onStatusFilterChange: (value: Status | "all") => void;
  onTypeFilterChange: (value: MediaType | "all") => void;
  onSortChange: (value: SortOption) => void;
  onResetFilters: () => void;
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
  hasActiveFilters,
  onStatusFilterChange,
  onTypeFilterChange,
  onSortChange,
  onResetFilters,
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

        <div className="grid gap-4 md:grid-cols-4">
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
          <div className="flex min-w-40 flex-col gap-2">
            <span className="text-xs font-medium uppercase tracking-[0.24em] text-white/45">
              Reset
            </span>
            <button
              type="button"
              onClick={onResetFilters}
              disabled={!hasActiveFilters}
              className="min-h-14 rounded-[22px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] px-4 py-3 text-sm font-semibold text-white transition duration-200 hover:border-white/20 hover:bg-white/8 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-white/10 disabled:hover:bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))]"
            >
              Reset filters
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
