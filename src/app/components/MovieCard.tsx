import { CineItem } from "../models/cine-item";
import { MediaType } from "../types/media-type";
import { Status } from "../types/status";
import {
  formatDate,
  getInitials,
  mediaTypeMeta,
  statusOptions,
} from "../lib/cine-track";
import RatingPill from "./RatingPill";
import StatusBadge from "./StatusBadge";

interface MovieCardProps {
  item: CineItem;
  onEdit: (item: CineItem) => void;
  onDelete: (item: CineItem) => void;
  onStatusChange: (id: number, status: Status) => void;
}

export default function MovieCard({
  item,
  onEdit,
  onDelete,
  onStatusChange,
}: MovieCardProps) {
  const mediaMeta = mediaTypeMeta[item.type as MediaType];

  return (
    <article className="group relative overflow-hidden rounded-[28px] border border-white/8 bg-[linear-gradient(180deg,rgba(31,31,44,0.92),rgba(13,13,18,0.98))] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.4)] transition duration-300 hover:-translate-y-1.5 hover:border-[#7c3aed]/35 hover:shadow-[0_32px_100px_rgba(124,58,237,0.2)]">
      <div className="absolute inset-x-10 top-0 h-24 rounded-full bg-[#7c3aed]/15 blur-3xl transition duration-300 group-hover:bg-[#a855f7]/20" />

      <div className="relative flex h-full flex-col gap-5">
        <div className="grid gap-4 sm:grid-cols-[108px_minmax(0,1fr)]">
          <div
            className="relative overflow-hidden rounded-[22px] border border-white/10 bg-[radial-gradient(circle_at_top,#8b5cf6,transparent_58%),linear-gradient(160deg,#1b102c,#0d0d12_65%)]"
            style={
              item.posterUrl
                ? {
                    backgroundImage: `linear-gradient(180deg, rgba(11,11,15,0.1), rgba(11,11,15,0.45)), url(${item.posterUrl})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }
                : undefined
            }
          >
            <div className="flex aspect-[3/4] items-end p-4">
              {!item.posterUrl ? (
                <div className="space-y-2">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-lg font-semibold text-white">
                    {getInitials(item.title)}
                  </span>
                  <p className="max-w-20 text-xs uppercase tracking-[0.24em] text-white/55">
                    CineTrack Select
                  </p>
                </div>
              ) : null}
            </div>
          </div>

          <div className="min-w-0 space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${mediaMeta.chipClassName}`}
                  >
                    {mediaMeta.label}
                  </span>
                  <StatusBadge status={item.status} />
                </div>
                <h3 className="mt-3 line-clamp-2 text-2xl font-semibold text-white">
                  {item.title}
                </h3>
              </div>
              <RatingPill rating={item.rating} />
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm text-white/52">
              <div className="rounded-2xl border border-white/8 bg-black/20 p-3">
                <p className="text-[11px] uppercase tracking-[0.24em] text-white/38">
                  Added
                </p>
                <p className="mt-2 font-medium text-white/74">
                  {formatDate(item.createdAt)}
                </p>
              </div>
              <div className="rounded-2xl border border-white/8 bg-black/20 p-3">
                <p className="text-[11px] uppercase tracking-[0.24em] text-white/38">
                  Updated
                </p>
                <p className="mt-2 font-medium text-white/74">
                  {formatDate(item.updatedAt)}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <label className="flex min-w-44 flex-1 items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/55">
                <span className="text-[11px] font-medium uppercase tracking-[0.24em] text-white/40">
                  Status
                </span>
                <select
                  value={item.status}
                  onChange={(event) =>
                    onStatusChange(item.id, event.target.value as Status)
                  }
                  className="w-full bg-transparent text-sm font-medium text-white outline-none"
                >
                  {statusOptions.map((option) => (
                    <option
                      key={option.value}
                      value={option.value}
                      className="bg-[#12121a]"
                    >
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <button
                onClick={() => onEdit(item)}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:border-[#a855f7]/40 hover:bg-[#7c3aed]/12"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(item)}
                className="rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm font-semibold text-rose-100 transition hover:border-rose-300/30 hover:bg-rose-500/16"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
