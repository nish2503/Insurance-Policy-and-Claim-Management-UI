// Backend caps page size at 100 (see PaginationUtil#validatePagination /
// #buildPageable on the Spring Boot side) — any request for size > 100
// fails with a 400 InvalidRequestException. Several screens need "every
// record" in memory at once (client-side search/filter, dashboard totals,
// "Export All" buttons), so instead of asking for one giant page, page
// through in MAX_PAGE_SIZE-sized chunks and concatenate the results.
//
// Usage:
//   const records = await fetchAllPages((page, size) =>
//     getMyPolicies({ page, size })
//   );
//
// Works with any endpoint that returns Spring's PaginatedResponseDTO shape:
// { records, currentPage, pageSize, totalRecords, totalPages, isLastPage }.
export const MAX_PAGE_SIZE = 100;

export async function fetchAllPages(fetchPage, { pageSize = MAX_PAGE_SIZE } = {}) {
  let page = 0;
  let all = [];

  // Safety valve so a misbehaving endpoint (e.g. isLastPage never true)
  // can't loop forever.
  const MAX_ITERATIONS = 1000;

  for (let i = 0; i < MAX_ITERATIONS; i++) {
    const res = await fetchPage(page, pageSize);
    const data = res.data || {};
    const records = data.records || data.content || [];

    all = all.concat(records);

    const isLastPage =
      data.isLastPage ??
      (typeof data.totalPages === "number"
        ? page + 1 >= data.totalPages
        : records.length < pageSize);

    if (isLastPage || records.length === 0) break;

    page += 1;
  }

  return all;
}

export default fetchAllPages;