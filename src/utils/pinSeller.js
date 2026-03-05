export function pinSellerFirst(list, pinnedSellerId) {
  const arr = Array.isArray(list) ? list : [];
  const pinnedIdStr = String(pinnedSellerId);

  // de-duplicate by seller id (important with infinite pages)
  const seen = new Set();
  const unique = [];
  for (const s of arr) {
    const id = String(s?.id ?? s?.seller_id ?? s?.seller?.seller_id ?? '');
    if (!id) continue;
    if (seen.has(id)) continue;
    seen.add(id);
    unique.push(s);
  }

  const idx = unique.findIndex((s) => String(s?.id ?? s?.seller_id) === pinnedIdStr);
  if (idx === -1) return unique;

  const [pinned] = unique.splice(idx, 1);
  return [pinned, ...unique];
}