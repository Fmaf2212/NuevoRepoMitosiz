// import { CustomLink } from "data/types";
import React, { FC } from "react";
// import { Link } from "react-router-dom";
import twFocusClass from "utils/twFocusClass";

export interface CustomLink {
  label: string;
  onClick: () => void;
}

export interface PaginationProps {
  className?: string;
  currentPage: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
  onPaginationChange: (newPage: number) => void;
}

const Pagination: FC<PaginationProps> = ({ className = "", currentPage, totalPages, onPageChange }) => {
  const DEMO_PAGINATION: CustomLink[] = Array.from({ length: totalPages }, (_, i) => ({
    label: (i + 1).toString(),
    onClick: () => onPageChange(i + 1),
  }));
  const renderItem = (pag: CustomLink, index: number) => {
    const isActive = parseInt(pag.label) === currentPage;
    if (isActive) {
      // RETURN ACTIVE PAGINATION
      return (
        <span
          key={index}
          className={`inline-flex w-11 h-11 items-center justify-center rounded-full bg-purple-600 text-white ${twFocusClass()}`}
        >
          {pag.label}
        </span>
      );
    }
    // RETURN UNACTIVE PAGINATION
    return (
      <button
        key={index}
        className={`inline-flex w-11 h-11 items-center justify-center rounded-full bg-white hover:bg-neutral-100 border border-neutral-200 text-neutral-6000 dark:text-neutral-400 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:border-neutral-700 ${twFocusClass()}`}
        onClick={pag.onClick}
      >
        {pag.label}
      </button>
    );
  };

  return (
    <div
      className={`nc-Pagination inline-flex space-x-1 text-base font-medium ${className}`}
    >
      {DEMO_PAGINATION.map(renderItem)}
    </div>
  );
};

export default Pagination;
