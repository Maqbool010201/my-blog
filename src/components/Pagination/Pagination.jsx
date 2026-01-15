// components/Pagination/Pagination.jsx
"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

const Pagination = ({ totalPosts, postsPerPage, basePath, currentPage }) => {
  const searchParams = useSearchParams();
  const totalPages = Math.ceil(totalPosts / postsPerPage);

  if (totalPages <= 1) return null;

  // Function to create URL with page parameter
  const createPageUrl = (pageNum) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", pageNum.toString());
    return `${basePath}?${params.toString()}`;
  };

  // Show limited page numbers for better UX
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    // Adjust start page if we're near the end
    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex flex-col items-center justify-center mt-8 space-y-4">
      {/* Show current page info */}
      <p className="text-sm text-gray-600">
        Page {currentPage} of {totalPages}
      </p>

      <div className="flex flex-wrap justify-center gap-2">
        {/* Previous Button */}
        {currentPage > 1 && (
          <Link
            href={createPageUrl(currentPage - 1)}
            scroll={false} // Keep scroll position
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center min-w-[80px]"
          >
            Previous
          </Link>
        )}

        {/* First Page */}
        {currentPage > 3 && (
          <>
            <Link
              href={createPageUrl(1)}
              scroll={false} // Keep scroll position
              className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors duration-200"
            >
              1
            </Link>
            {currentPage > 4 && (
              <span className="px-2 py-2 text-gray-500">...</span>
            )}
          </>
        )}

        {/* Page Numbers */}
        {pageNumbers.map((num) => (
          <Link
            key={num}
            href={createPageUrl(num)}
            scroll={false} // Keep scroll position
            className={`px-4 py-2 rounded-lg border transition-colors duration-200 ${
              num === currentPage
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-blue-600 border-blue-300 hover:bg-blue-50"
            }`}
          >
            {num}
          </Link>
        ))}

        {/* Last Page */}
        {currentPage < totalPages - 2 && (
          <>
            {currentPage < totalPages - 3 && (
              <span className="px-2 py-2 text-gray-500">...</span>
            )}
            <Link
              href={createPageUrl(totalPages)}
              scroll={false} // Keep scroll position
              className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors duration-200"
            >
              {totalPages}
            </Link>
          </>
        )}

        {/* Next Button */}
        {currentPage < totalPages && (
          <Link
            href={createPageUrl(currentPage + 1)}
            scroll={false} // Keep scroll position
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center min-w-[80px]"
          >
            Next
          </Link>
        )}
      </div>
    </div>
  );
};

export default Pagination;
