"use client";

import type { ProductCategory } from "@global-trade/core";
import { ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { categoryPath, categoryTitle } from "@/lib/frontend-helpers";

export function CategoryAccordion({ categories }: { categories: ProductCategory[] }) {
  const topCategories = useMemo(() => categories.filter((category) => !category.parentId), [categories]);
  const initialOpenId = topCategories.find((category) => categories.some((item) => item.parentId === category.id))?.id;
  const [openIds, setOpenIds] = useState<Set<string>>(() => new Set(initialOpenId ? [initialOpenId] : []));

  function toggle(categoryId: string) {
    setOpenIds((current) => {
      const next = new Set(current);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
  }

  return (
    <ul id="category-accordion">
      {topCategories.map((category) => {
        const children = categories.filter((item) => item.parentId === category.id);
        const isOpen = openIds.has(category.id);

        return (
          <li className={`category-item level-0 ${children.length ? "has-children" : ""} ${isOpen ? "selected" : ""}`} key={category.id}>
            <div className="category-header">
              <Link className="category-title-link" href={categoryPath(category, categories)}>
                {category.image?.publicUrl && <img src={category.image.publicUrl} alt={categoryTitle(category)} />}
                <span className="category-header-text">
                  <span>{categoryTitle(category)}</span>
                </span>
              </Link>
              {children.length > 0 ? (
                <button
                  className="category-toggle"
                  onClick={() => toggle(category.id)}
                  type="button"
                  aria-label={`${isOpen ? "Collapse" : "Expand"} ${categoryTitle(category)}`}
                  aria-expanded={isOpen}
                >
                  {isOpen ? <ChevronUp size={16} strokeWidth={2.6} /> : <ChevronDown size={16} strokeWidth={2.6} />}
                </button>
              ) : null}
            </div>
            {children.length > 0 && isOpen && (
              <ul className="subcategory-list">
                {children.map((child) => (
                  <li className="category-item level-1" key={child.id}>
                    <Link className="category-header" href={categoryPath(child, categories)}>
                      {child.image?.publicUrl && <img src={child.image.publicUrl} alt={categoryTitle(child)} />}
                      <span className="category-header-text">
                        <span>{categoryTitle(child)}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        );
      })}
    </ul>
  );
}
