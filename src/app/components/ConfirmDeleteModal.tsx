import { CineItem } from "../models/cine-item";

interface ConfirmDeleteModalProps {
  item: CineItem | null;
  open: boolean;
  pending?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function ConfirmDeleteModal({
  item,
  open,
  pending = false,
  onClose,
  onConfirm,
}: ConfirmDeleteModalProps) {
  if (!open || !item) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md">
      <div className="w-full max-w-lg rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(25,20,28,0.98),rgba(12,11,16,0.98))] p-6 shadow-[0_40px_120px_rgba(0,0,0,0.55)]">
        <p className="text-xs font-medium uppercase tracking-[0.28em] text-rose-300">
          Delete title
        </p>
        <h2 className="mt-3 text-2xl font-semibold text-white">
          Remove &ldquo;{item.title}&rdquo; from CineTrack?
        </h2>
        <p className="mt-3 text-sm leading-6 text-white/58">
          This action removes the title from the current local library view.
          You can still add it again later if needed.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white/70 transition hover:border-white/20 hover:text-white"
          >
            Keep it
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={pending}
            className="rounded-2xl border border-rose-300/20 bg-rose-500/12 px-5 py-3 text-sm font-semibold text-rose-100 transition hover:bg-rose-500/18 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending ? "Deleting..." : "Delete title"}
          </button>
        </div>
      </div>
    </div>
  );
}
