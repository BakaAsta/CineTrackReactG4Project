"use client";

import { useDeferredValue, useEffect, useState, useTransition } from "react";
import ConfirmDeleteModal from "./components/ConfirmDeleteModal";
import FilterBar from "./components/FilterBar";
import MovieCard from "./components/MovieCard";
import MovieFormModal from "./components/MovieFormModal";
import SearchBar from "./components/SearchBar";
import StatusBadge from "./components/StatusBadge";
import ToastViewport from "./components/ToastViewport";
import { cineItems } from "./data/cine-items";
import {
  EMPTY_FORM_VALUES,
  MovieFormValues,
  SortOption,
  formatDate,
  getFormValues,
  mediaTypeMeta,
  statusMeta,
} from "./lib/cine-track";
import { CineItem } from "./models/cine-item";
import { MediaType } from "./types/media-type";
import { Status } from "./types/status";

type FormModalState =
  | { open: false; mode: "create"; item: null }
  | { open: true; mode: "create"; item: null }
  | { open: true; mode: "edit"; item: CineItem };

type Toast = {
  id: number;
  message: string;
  tone: "success" | "error";
};

const statusOrder: Status[] = ["watching", "to-watch", "completed", "dropped"];

export default function Home() {
  const [items, setItems] = useState<CineItem[]>(cineItems);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<Status | "all">("all");
  const [typeFilter, setTypeFilter] = useState<MediaType | "all">("all");
  const [sortBy, setSortBy] = useState<SortOption>("updated-desc");
  const [formModal, setFormModal] = useState<FormModalState>({
    open: false,
    mode: "create",
    item: null,
  });
  const [deleteTarget, setDeleteTarget] = useState<CineItem | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const deferredQuery = useDeferredValue(query);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!toasts.length) {
      return;
    }

    const timers = toasts.map((toast) =>
      window.setTimeout(() => {
        setToasts((current) => current.filter((entry) => entry.id !== toast.id));
      }, 2600),
    );

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [toasts]);

  const pushToast = (message: string, tone: Toast["tone"]) => {
    setToasts((current) => [...current, { id: Date.now() + current.length, message, tone }]);
  };

  const openCreateModal = () =>
    setFormModal({
      open: true,
      mode: "create",
      item: null,
    });

  const openEditModal = (item: CineItem) =>
    setFormModal({
      open: true,
      mode: "edit",
      item,
    });

  const closeFormModal = () =>
    setFormModal({
      open: false,
      mode: "create",
      item: null,
    });

  const handleSubmitForm = (values: MovieFormValues) => {
    const trimmedTitle = values.title.trim();

    if (!trimmedTitle) {
      pushToast("A title is required before saving.", "error");
      return;
    }

    startTransition(() => {
      if (formModal.mode === "edit" && formModal.item) {
        setItems((current) =>
          current.map((entry) =>
            entry.id === formModal.item.id
              ? {
                  ...entry,
                  ...values,
                  title: trimmedTitle,
                  updatedAt: new Date(),
                }
              : entry,
          ),
        );
        pushToast(`Updated "${trimmedTitle}".`, "success");
      } else {
        setItems((current) => [
          {
            id:
              current.reduce(
                (highestId, entry) => (entry.id > highestId ? entry.id : highestId),
                0,
              ) + 1,
            title: trimmedTitle,
            type: values.type,
            status: values.status,
            rating: values.rating,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          ...current,
        ]);
        pushToast(`Added "${trimmedTitle}" to your library.`, "success");
      }
    });

    closeFormModal();
  };

  const handleDelete = () => {
    if (!deleteTarget) {
      return;
    }

    const title = deleteTarget.title;

    startTransition(() => {
      setItems((current) =>
        current.filter((changedItem) => changedItem.id !== deleteTarget.id),
      );
      pushToast(`Deleted "${title}".`, "success");
    });

    setDeleteTarget(null);
  };

  const updateStatus = (id: number, status: Status) => {
    startTransition(() => {
      let updatedTitle = "";

      setItems((current) =>
        current.map((changedItem) => {
          if (changedItem.id === id) {
            updatedTitle = changedItem.title;
            return {
              ...changedItem,
              status,
              updatedAt: new Date(),
            };
          }
          return changedItem;
        }),
      );

      if (updatedTitle) {
        pushToast(
          `"${updatedTitle}" moved to ${statusMeta[status].label.toLowerCase()}.`,
          "success",
        );
      }
    });
  };

  const normalizedQuery = deferredQuery.trim().toLowerCase();
  const filteredItems = items.filter((item) => {
    const matchesQuery =
      normalizedQuery.length === 0 ||
      item.title.toLowerCase().includes(normalizedQuery) ||
      statusMeta[item.status].label.toLowerCase().includes(normalizedQuery) ||
      mediaTypeMeta[item.type].label.toLowerCase().includes(normalizedQuery);
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    const matchesType = typeFilter === "all" || item.type === typeFilter;

    return matchesQuery && matchesStatus && matchesType;
  });

  const sortedItems = [...filteredItems].sort((left, right) => {
    if (sortBy === "title-asc") {
      return left.title.localeCompare(right.title);
    }
    if (sortBy === "rating-desc") {
      return right.rating - left.rating;
    }
    if (sortBy === "created-desc") {
      return right.createdAt.getTime() - left.createdAt.getTime();
    }
    return right.updatedAt.getTime() - left.updatedAt.getTime();
  });

  const sections = statusOrder
    .map((status) => ({
      status,
      items: sortedItems.filter((item) => item.status === status),
    }))
    .filter((section) => section.items.length > 0);

  const totalCount = items.length;
  const watchingCount = items.filter((item) => item.status === "watching").length;
  const completedCount = items.filter((item) => item.status === "completed").length;
  const averageRating = items.length
    ? (items.reduce((sum, item) => sum + item.rating, 0) / items.length).toFixed(1)
    : "0.0";

  const featuredItem = [...items].sort(
    (left, right) => right.updatedAt.getTime() - left.updatedAt.getTime(),
  )[0];

  const modalInitialValues =
    formModal.mode === "edit" && formModal.item
      ? getFormValues(formModal.item)
      : EMPTY_FORM_VALUES;
  const hasActiveFilters =
    statusFilter !== "all" ||
    typeFilter !== "all" ||
    sortBy !== "updated-desc" ||
    query.trim().length > 0;

  const resetFilters = () => {
    setQuery("");
    setStatusFilter("all");
    setTypeFilter("all");
    setSortBy("updated-desc");
  };

  return (
    <>
      <main className="relative min-h-screen overflow-hidden px-4 py-6 sm:px-6 lg:px-8">
        <div className="cinetrack-grid pointer-events-none absolute inset-0 opacity-50" />
        <div className="pointer-events-none absolute left-[-12%] top-[-8%] h-72 w-72 rounded-full bg-[#7c3aed]/20 blur-[140px]" />
        <div className="pointer-events-none absolute right-[-4%] top-40 h-80 w-80 rounded-full bg-[#a855f7]/12 blur-[150px]" />

        <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-6">
          <section className="overflow-hidden rounded-[36px] border border-white/8 bg-[linear-gradient(135deg,rgba(15,15,21,0.96),rgba(18,12,27,0.92)_48%,rgba(8,8,12,0.98))] p-6 shadow-[0_32px_120px_rgba(0,0,0,0.45)] sm:p-8">
            <div className="grid gap-8 xl:grid-cols-[minmax(0,1.3fr)_360px]">
              <div className="space-y-8">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium uppercase tracking-[0.28em] text-white/68">
                      <span className="h-2.5 w-2.5 rounded-full bg-[#a855f7]" />
                      CineTrack
                    </div>
                    <h1 className="mt-6 max-w-3xl text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl lg:text-6xl">
                      Track your movies &amp; series in one cinematic library.
                    </h1>
                    <p className="mt-4 max-w-2xl text-base leading-7 text-white/62 sm:text-lg">
                      A premium dark-mode watchlist with elegant CRUD flows,
                      immersive cards and a streaming-inspired browsing rhythm.
                    </p>
                  </div>

                  <button
                    onClick={openCreateModal}
                    className="rounded-2xl bg-[linear-gradient(135deg,#7c3aed,#a855f7)] px-5 py-3 text-sm font-semibold text-white shadow-[0_20px_60px_rgba(124,58,237,0.45)] transition hover:-translate-y-0.5 hover:brightness-110"
                  >
                    Add movie
                  </button>
                </div>

                <SearchBar value={query} onChange={setQuery} />

                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="rounded-[24px] border border-white/8 bg-white/5 p-5">
                    <p className="text-xs uppercase tracking-[0.26em] text-white/42">
                      Library size
                    </p>
                    <p className="mt-3 text-3xl font-semibold text-white">
                      {totalCount}
                    </p>
                    <p className="mt-2 text-sm text-white/50">
                      Titles synced in your private collection.
                    </p>
                  </div>
                  <div className="rounded-[24px] border border-white/8 bg-white/5 p-5">
                    <p className="text-xs uppercase tracking-[0.26em] text-white/42">
                      In progress
                    </p>
                    <p className="mt-3 text-3xl font-semibold text-white">
                      {watchingCount}
                    </p>
                    <p className="mt-2 text-sm text-white/50">
                      Active sessions currently in rotation.
                    </p>
                  </div>
                  <div className="rounded-[24px] border border-white/8 bg-white/5 p-5">
                    <p className="text-xs uppercase tracking-[0.26em] text-white/42">
                      Average rating
                    </p>
                    <p className="mt-3 text-3xl font-semibold text-white">
                      {averageRating}
                    </p>
                    <p className="mt-2 text-sm text-white/50">
                      Overall score across the full library.
                    </p>
                  </div>
                </div>
              </div>

              <aside className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-6">
                <div className="absolute inset-x-10 top-0 h-28 rounded-full bg-[#a855f7]/20 blur-3xl" />
                <div className="relative flex h-full flex-col justify-between gap-6">
                  <div>
                    <p className="text-xs uppercase tracking-[0.26em] text-[#d7c8ff]">
                      Spotlight
                    </p>
                    {featuredItem ? (
                      <>
                        <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-white">
                          {featuredItem.title}
                        </h2>
                        <div className="mt-4 flex flex-wrap gap-2">
                          <StatusBadge status={featuredItem.status} />
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${mediaTypeMeta[featuredItem.type].chipClassName}`}
                          >
                            {mediaTypeMeta[featuredItem.type].label}
                          </span>
                        </div>
                      </>
                    ) : (
                      <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-white">
                        Your next obsession starts here
                      </h2>
                    )}
                    <p className="mt-4 text-sm leading-7 text-white/58">
                      {featuredItem
                        ? `Last touched on ${formatDate(featuredItem.updatedAt)}. Keep the momentum going with a quick update or continue your current streak.`
                        : "Add your first title to unlock a richer library experience."}
                    </p>
                  </div>

                  <div className="grid gap-3">
                    {statusOrder.map((status) => (
                      <div
                        key={status}
                        className="flex items-center justify-between rounded-2xl border border-white/8 bg-black/20 px-4 py-3"
                      >
                        <span className="text-sm text-white/65">
                          {statusMeta[status].label}
                        </span>
                        <span className="text-lg font-semibold text-white">
                          {items.filter((item) => item.status === status).length}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-2xl border border-emerald-300/14 bg-emerald-500/8 px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.24em] text-emerald-200/75">
                      Finished
                    </p>
                    <p className="mt-2 text-sm text-white/66">
                      {completedCount} titles already completed and archived in your
                      premium shelf.
                    </p>
                  </div>
                </div>
              </aside>
            </div>
          </section>

          <FilterBar
            totalItems={sortedItems.length}
            statusFilter={statusFilter}
            typeFilter={typeFilter}
            sortBy={sortBy}
            hasActiveFilters={hasActiveFilters}
            onStatusFilterChange={setStatusFilter}
            onTypeFilterChange={setTypeFilter}
            onSortChange={setSortBy}
            onResetFilters={resetFilters}
          />

          {sortedItems.length ? (
            <div className="flex flex-col gap-8">
              {sections.map((section) => (
                <section key={section.status} className="space-y-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-[0.28em] text-white/40">
                        {section.items.length} title
                        {section.items.length > 1 ? "s" : ""}
                      </p>
                      <h2 className="mt-1 text-2xl font-semibold text-white">
                        {statusMeta[section.status].sectionTitle}
                      </h2>
                      <p className="mt-1 text-sm text-white/52">
                        {statusMeta[section.status].sectionDescription}
                      </p>
                    </div>
                    <StatusBadge status={section.status} />
                  </div>

                  <div className="grid gap-5 xl:grid-cols-2">
                    {section.items.map((item) => (
                      <MovieCard
                        key={item.id}
                        item={item}
                        onEdit={openEditModal}
                        onDelete={setDeleteTarget}
                        onStatusChange={updateStatus}
                      />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          ) : (
            <section className="rounded-[32px] border border-dashed border-white/10 bg-[rgba(18,18,27,0.82)] px-6 py-14 text-center shadow-[0_20px_70px_rgba(0,0,0,0.28)] backdrop-blur-xl">
              <div className="mx-auto flex max-w-xl flex-col items-center">
                <div className="flex h-18 w-18 items-center justify-center rounded-[24px] border border-white/10 bg-white/5 text-3xl text-[#a855f7]">
                  +
                </div>
                <h2 className="mt-6 text-3xl font-semibold text-white">
                  No titles match the current view
                </h2>
                <p className="mt-4 text-sm leading-7 text-white/56">
                  Adjust the search, filters or sorting strategy, or add a fresh
                  title to bring the library back to life.
                </p>
                <button
                  onClick={openCreateModal}
                  className="mt-8 rounded-2xl bg-[linear-gradient(135deg,#7c3aed,#a855f7)] px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_48px_rgba(124,58,237,0.35)] transition hover:brightness-110"
                >
                  Add the first title
                </button>
              </div>
            </section>
          )}
        </div>
      </main>

      <MovieFormModal
        key={`${formModal.mode}-${formModal.item?.id ?? "new"}`}
        open={formModal.open}
        mode={formModal.mode}
        initialValues={modalInitialValues}
        onClose={closeFormModal}
        onSubmit={handleSubmitForm}
        pending={isPending}
      />

      <ConfirmDeleteModal
        item={deleteTarget}
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        pending={isPending}
      />

      <ToastViewport toasts={toasts} />
    </>
  );
}
