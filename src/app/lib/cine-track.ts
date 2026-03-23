import { CineItem } from "../models/cine-item";
import { MediaType } from "../types/media-type";
import { Status } from "../types/status";

export type SortOption =
  | "updated-desc"
  | "created-desc"
  | "rating-desc"
  | "title-asc";

export interface MovieFormValues {
  title: string;
  type: MediaType;
  status: Status;
  rating: number;
}

export const EMPTY_FORM_VALUES: MovieFormValues = {
  title: "",
  type: "movie",
  status: "to-watch",
  rating: 7,
};

export const statusOptions: Array<{ value: Status; label: string }> = [
  { value: "to-watch", label: "To Watch" },
  { value: "watching", label: "Watching" },
  { value: "completed", label: "Watched" },
  { value: "dropped", label: "Dropped" },
];

export const mediaTypeOptions: Array<{ value: MediaType | "all"; label: string }> =
  [
    { value: "all", label: "All formats" },
    { value: "movie", label: "Movies" },
    { value: "series", label: "Series" },
  ];

export const sortOptions: Array<{ value: SortOption; label: string }> = [
  { value: "updated-desc", label: "Recently updated" },
  { value: "created-desc", label: "Recently added" },
  { value: "rating-desc", label: "Top rated" },
  { value: "title-asc", label: "Title A-Z" },
];

export const statusMeta: Record<
  Status,
  {
    label: string;
    chipClassName: string;
    dotClassName: string;
    sectionTitle: string;
    sectionDescription: string;
  }
> = {
  "to-watch": {
    label: "To Watch",
    chipClassName:
      "border border-white/10 bg-white/6 text-[#d5ccff] shadow-[0_0_28px_rgba(124,58,237,0.12)]",
    dotClassName: "bg-[#a855f7]",
    sectionTitle: "To Watch",
    sectionDescription: "Fresh picks waiting for their first play.",
  },
  watching: {
    label: "Watching",
    chipClassName:
      "border border-[#6d5ef3]/30 bg-[#1d1d39] text-[#c6c5ff] shadow-[0_0_30px_rgba(90,110,255,0.18)]",
    dotClassName: "bg-[#7c83ff]",
    sectionTitle: "Continue Watching",
    sectionDescription: "Titles currently in rotation.",
  },
  completed: {
    label: "Watched",
    chipClassName:
      "border border-emerald-400/20 bg-emerald-500/10 text-emerald-200 shadow-[0_0_30px_rgba(16,185,129,0.14)]",
    dotClassName: "bg-emerald-400",
    sectionTitle: "Watched",
    sectionDescription: "Finished titles worth revisiting.",
  },
  dropped: {
    label: "Dropped",
    chipClassName:
      "border border-rose-400/20 bg-rose-500/10 text-rose-200 shadow-[0_0_30px_rgba(244,63,94,0.14)]",
    dotClassName: "bg-rose-400",
    sectionTitle: "Dropped",
    sectionDescription: "Archived titles that did not make the cut.",
  },
};

export const mediaTypeMeta: Record<
  MediaType,
  { label: string; chipClassName: string }
> = {
  movie: {
    label: "Movie",
    chipClassName: "border border-white/10 bg-white/5 text-white/80",
  },
  series: {
    label: "Series",
    chipClassName: "border border-white/10 bg-[#211734] text-[#d7c8ff]",
  },
};

export function getInitials(title: string) {
  return title
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((chunk) => chunk[0]?.toUpperCase() ?? "")
    .join("");
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function getFormValues(item: CineItem): MovieFormValues {
  return {
    title: item.title,
    type: item.type,
    status: item.status,
    rating: item.rating,
  };
}
