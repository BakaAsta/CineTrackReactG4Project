import { useState } from "react";
import { MovieFormValues, statusOptions } from "../lib/cine-track";
import { MediaType } from "../types/media-type";
import { Status } from "../types/status";

interface MovieFormModalProps {
  open: boolean;
  mode: "create" | "edit";
  initialValues: MovieFormValues;
  onClose: () => void;
  onSubmit: (values: MovieFormValues) => void;
  pending?: boolean;
}

export default function MovieFormModal({
  open,
  mode,
  initialValues,
  onClose,
  onSubmit,
  pending = false,
}: MovieFormModalProps) {
  const [formValues, setFormValues] = useState<MovieFormValues>(initialValues);

  if (!open) {
    return null;
  }

  const title = mode === "create" ? "Add a new title" : "Edit selection";
  const description =
    mode === "create"
      ? "Capture a movie or series with a premium, watchlist-first flow."
      : "Refresh the metadata without leaving the library.";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md">
      <div className="w-full max-w-2xl rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(24,24,34,0.98),rgba(10,10,16,0.98))] p-6 shadow-[0_40px_120px_rgba(0,0,0,0.55)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.28em] text-[#a855f7]">
              {mode === "create" ? "Create" : "Update"}
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-white">{title}</h2>
            <p className="mt-2 max-w-xl text-sm text-white/55">{description}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 transition hover:border-white/20 hover:text-white"
          >
            Close
          </button>
        </div>

        <form
          className="mt-8 grid gap-5"
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit(formValues);
          }}
        >
          <label className="grid gap-2">
            <span className="text-sm font-medium text-white/78">Title</span>
            <input
              value={formValues.title}
              onChange={(event) =>
                setFormValues((current) => ({
                  ...current,
                  title: event.target.value,
                }))
              }
              placeholder="The Last of Us"
              required
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-white/30 focus:border-[#a855f7]"
            />
          </label>

          <div className="grid gap-5 md:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-sm font-medium text-white/78">Format</span>
              <select
                value={formValues.type}
                onChange={(event) =>
                  setFormValues((current) => ({
                    ...current,
                    type: event.target.value as MediaType,
                  }))
                }
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-[#a855f7]"
              >
                <option value="movie" className="bg-[#12121a]">
                  Movie
                </option>
                <option value="series" className="bg-[#12121a]">
                  Series
                </option>
              </select>
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-medium text-white/78">Status</span>
              <select
                value={formValues.status}
                onChange={(event) =>
                  setFormValues((current) => ({
                    ...current,
                    status: event.target.value as Status,
                  }))
                }
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-[#a855f7]"
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
          </div>

          <label className="grid gap-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-white/78">Rating</span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm font-semibold text-white">
                {formValues.rating}/10
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              step="1"
              value={formValues.rating}
              onChange={(event) =>
                setFormValues((current) => ({
                  ...current,
                  rating: Number(event.target.value),
                }))
              }
              className="accent-[#a855f7]"
            />
          </label>

          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white/70 transition hover:border-white/20 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={pending}
              className="rounded-2xl bg-[linear-gradient(135deg,#7c3aed,#a855f7)] px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_48px_rgba(124,58,237,0.4)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {pending
                ? "Saving..."
                : mode === "create"
                  ? "Add to library"
                  : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
