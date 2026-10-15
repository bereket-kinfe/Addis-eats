export function getPaginationModel(page, totalPages) {
  const safeTotalPages = Math.max(1, Number.isSafeInteger(totalPages) ? totalPages : 1);
  const safePage = Math.min(
    Math.max(1, Number.isSafeInteger(page) ? page : 1),
    safeTotalPages,
  );

  return {
    page: safePage,
    totalPages: safeTotalPages,
    previousPage: safePage > 1 ? safePage - 1 : null,
    nextPage: safePage < safeTotalPages ? safePage + 1 : null,
    state: safeTotalPages === 1
      ? "single"
      : safePage === 1
        ? "first"
        : safePage === safeTotalPages
          ? "last"
          : "middle",
  };
}
