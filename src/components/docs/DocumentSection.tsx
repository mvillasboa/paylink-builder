import { ReactNode } from "react";

interface DocumentSectionProps {
  title: string;
  level?: 1 | 2 | 3;
  children: ReactNode;
  id?: string;
}

export function DocumentSection({ title, level = 2, children, id }: DocumentSectionProps) {
  const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;
  const className = level === 1 
    ? "text-3xl font-bold text-foreground mb-4 mt-8"
    : level === 2
    ? "text-2xl font-semibold text-foreground mb-3 mt-6 page-break-before"
    : "text-xl font-medium text-foreground mb-2 mt-4";

  return (
    <section id={id} className="mb-8">
      <HeadingTag className={className}>{title}</HeadingTag>
      <div className="space-y-4">{children}</div>
    </section>
  );
}
