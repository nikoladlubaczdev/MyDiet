export const normalizeProductName = (product: string) =>
  product
    .toLocaleLowerCase('pl')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim();
