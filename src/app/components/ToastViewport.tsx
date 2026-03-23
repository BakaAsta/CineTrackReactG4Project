interface Toast {
  id: number;
  message: string;
  tone: "success" | "error";
}

interface ToastViewportProps {
  toasts: Toast[];
}

export default function ToastViewport({ toasts }: ToastViewportProps) {
  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[60] flex w-full max-w-sm flex-col gap-3">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`rounded-2xl border px-4 py-3 text-sm font-medium shadow-[0_18px_48px_rgba(0,0,0,0.35)] backdrop-blur-xl ${
            toast.tone === "success"
              ? "border-emerald-300/20 bg-emerald-500/12 text-emerald-50"
              : "border-rose-300/20 bg-rose-500/12 text-rose-50"
          }`}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}
