"use client";

import { useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export type ProductSortValue = "default" | "popularity" | "latest" | "price-asc" | "price-desc";

export function ProductSortSelect({
  value,
  labels
}: {
  value: ProductSortValue;
  labels: {
    sortDefault: string;
    sortPopularity: string;
    sortLatest: string;
    sortPriceAsc: string;
    sortPriceDesc: string;
  };
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  return (
    <select
      aria-label="Product sorting"
      className={`product-sort-select ${isPending ? "is-pending" : ""}`}
      disabled={isPending}
      onChange={(event) => {
        const params = new URLSearchParams(searchParams.toString());
        const nextValue = event.target.value;
        params.delete("page");
        if (nextValue === "default") {
          params.delete("sort");
        } else {
          params.set("sort", nextValue);
        }
        const query = params.toString();
        startTransition(() => {
          router.push(query ? `${pathname}?${query}` : pathname);
        });
      }}
      value={value}
    >
      <option value="default">{labels.sortDefault}</option>
      <option value="popularity">{labels.sortPopularity}</option>
      <option value="latest">{labels.sortLatest}</option>
      <option value="price-asc">{labels.sortPriceAsc}</option>
      <option value="price-desc">{labels.sortPriceDesc}</option>
    </select>
  );
}
