export function rupiah(n: number): string {
  return new Intl.NumberFormat("id-ID").format(n);
}

export function formatHarga(n: number): string {
  return "Rp" + new Intl.NumberFormat("id-ID").format(n);
}

export const format = { rupiah, formatHarga };
