import { ArrowRight } from "lucide-react";
import Link from "next/link";

export interface CategoryShowcaseItem {
  title: string;
  subtitle?: string | undefined;
  href: string;
  image: string;
}

export function CategoryShowcase({ items }: { items: CategoryShowcaseItem[] }) {
  return (
    <div className="category-showcase">
      {items.map((tile) => (
        <Link className="category-tile group" href={tile.href} key={tile.title}>
          <img src={tile.image} alt={tile.title} />
          <div className="category-tile__body">
            <h3>{tile.title}</h3>
            {tile.subtitle ? <p>{tile.subtitle}</p> : null}
            <span className="category-tile__button">
              Details <ArrowRight size={18} />
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
