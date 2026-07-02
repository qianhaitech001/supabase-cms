import { cn } from "@/lib/utils";

export function SectionHeader({
  title,
  description,
  className
}: {
  title: string;
  description?: string | undefined;
  className?: string | undefined;
}) {
  return (
    <div className={cn("inshow-section-header", className)}>
      <h2>{title}</h2>
      {description ? <p>{description}</p> : null}
    </div>
  );
}
