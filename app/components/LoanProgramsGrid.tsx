"use client";

import { useMemo, useState } from "react";

type LoanProgram = {
  title: string;
  description: string;
  tag: string;
};

type LoanProgramsGridProps = {
  programs: LoanProgram[];
  initialVisible?: number;
};

export default function LoanProgramsGrid({
  programs,
  initialVisible = 4
}: LoanProgramsGridProps) {
  const [expanded, setExpanded] = useState(false);

  const visiblePrograms = useMemo(() => {
    if (expanded) return programs;
    return programs.slice(0, initialVisible);
  }, [expanded, programs, initialVisible]);

  const hasMore = programs.length > initialVisible;

  return (
    <>
      <div className="grid-3">
        {visiblePrograms.map((program) => (
          <article key={program.title} className="card card-soft">
            <span className="badge">{program.tag}</span>
            <h3>{program.title}</h3>
            <p>{program.description}</p>
          </article>
        ))}
      </div>
      {hasMore ? (
        <div className="expand-row">
          <button
            type="button"
            className="ghost-btn"
            onClick={() => setExpanded((prev) => !prev)}
          >
            {expanded ? "Show Fewer Programs" : "Show More Programs"}
          </button>
        </div>
      ) : null}
    </>
  );
}
