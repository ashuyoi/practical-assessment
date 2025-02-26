import React, { useMemo, useState } from "react";

export interface Column {
    key: string;
    label: string;
    suffix?: string;
    prefix?: string;
    customClassName?: string;
}

export interface FilterKey {
    filterKey: string;
    label: string;
}

interface TableProps<T extends Record<string, any>> {
    columns: Column[];
    data: T[];
    onSetLimit: (limit: number) => void;
    limit: number;
    skip: number;
    total: number;
    handlePageChange: (page: number) => void;
    loading?: boolean;
    filters?: FilterKey[];
    filterKey?: string;
    filterValue?: string;
    onSetFilterKey?: (filterKey: string) => void;
    onSetFilterValue?: (filterValue: string) => void;
    onSearch?: () => void;
    onReset?: () => void;
}

const Table = <T extends Record<string, any>, >(props: TableProps<T>) => {
    const {
        columns,
        data,
        limit,
        onSetLimit,
        skip,
        total,
        handlePageChange,
        loading,
        filters,
        filterKey,
        filterValue,
        onSetFilterKey,
        onSetFilterValue,
        onSearch,
        onReset,
    } = props;

    const [searchVisible, setSearchVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const getNestedValue = (obj: T, path: string) => {
        return path.split('.').reduce((acc, key) => (acc && acc[key] != null) ? acc[key] : null, obj) as unknown as string;
    };

    const searchInObject = (obj: any, query: string): boolean => {
        if (typeof obj === "string") {
            return obj.toLowerCase().includes(query.toLowerCase());
        } else if (typeof obj === "object" && obj !== null) {
            return Object.values(obj).some(value => searchInObject(value, query));
        }
        return false;
    };

    const filteredData = data.filter((item: T) => searchInObject(item, searchQuery));

    const totalPages = useMemo(() => {
        return Math.ceil(total / limit);
    }, [total, limit]);

    const currentPage = useMemo(() => {
        return (skip / limit);
    }, [skip, limit]);

    const FiltersComponent = useMemo(() => {
        return <Filters
            filters={filters}
            filterKey={filterKey}
            filterValue={filterValue}
            onSetFilterKey={onSetFilterKey}
            onSetFilterValue={onSetFilterValue}
            onReset={onReset}
            onSearch={onSearch}/>
    }, [filters, filterKey, filterValue, onSetFilterKey, onSetFilterValue, onReset, onSearch]);

    return (
        <>
            {
                loading ?
                    <div className="fixed inset-0 flex justify-center items-center z-50">
                        <div
                            className="w-16 h-16 border-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
                    </div> :
                    <>
                        <div className="flex items-center space-x-2 mb-2">
                            <select
                                id="limit"
                                onChange={(e) => onSetLimit(Number(e.target.value))}
                                value={limit}
                                className="cursor-pointer hover:bg-gray-300 mt-1 block px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-[#000000] focus:border-[#000000]"
                            >
                                {[5, 10, 20, 50].map((num) => (
                                    <option key={num} value={num}>{num}</option>
                                ))}
                            </select>
                            <span className="text-md">Entries</span>
                            <span style={{borderWidth: '0.5px'}} className="border-l border h-5"></span>
                            <button
                                onClick={() => setSearchVisible(!searchVisible)}
                                className="cursor-pointer focus:ring-[#000000] focus:ring-1 focus:border-[#000000] p-2 rounded-full border hover:bg-gray-300 focus:outline-none"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                     strokeWidth={1.5}
                                     stroke="currentColor" className="size-5">
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                          d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"/>
                                </svg>
                            </button>

                            {searchVisible ?
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="me-auto lg:me-2 w-full lg:w-auto bg-white focus:ring-[#000000] focus:ring-1 focus:border-[#000000] px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
                                /> : null}

                            <span style={{borderWidth: '0.5px'}} className="hidden lg:block border-l border h-5"></span>

                            {filters && filters.length > 0 ? <div className={"hidden lg:flex space-x-1"}>
                                {FiltersComponent}
                            </div> : null}
                        </div>


                        {filters && filters.length > 0 ? <div className={"block lg:hidden space-y-2 mb-2"}>
                            {FiltersComponent}
                        </div> : null}

                        <div className="overflow-x-auto relative">
                            <table className="min-w-full bg-white border border-gray-300 table-fixed">
                                <thead>
                                <tr className="bg-[#c0e3e5] uppercase">
                                    {columns.map((col) => (
                                        <th key={col.key}
                                            className={`border px-4 py-2 text-left ${col.customClassName ? col.customClassName : ""}`}>
                                            {col.label}
                                        </th>
                                    ))}
                                </tr>
                                </thead>
                                <tbody>
                                {filteredData.map((row, rowIndex) => (
                                    <tr key={rowIndex} className="border-t hover:bg-[#ebebeb]">
                                        {columns.map((col) => {
                                            // Use the helper function to get the nested value
                                            const value = getNestedValue(row, col.key) || "-";
                                            return (
                                                <td key={col.key + rowIndex} className="border border-black px-4 py-2">
                                                    {col.prefix ? col.prefix : ""}{value}{col.suffix ? col.suffix : ""}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                            {filteredData.length === 0 ?
                                <div className="flex justify-center items-center py-4">
                                    <p className="text-center text-gray-500">No results found</p>
                                </div> : null}
                        </div>

                        {searchQuery || totalPages === 0 ? null :
                            <Pagination totalPages={totalPages} currentPage={currentPage}
                                        onPageChange={handlePageChange}/>}

                    </>}
        </>
    );
};

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({currentPage, totalPages, onPageChange}) => {
    const rangeSize = 5; // Always show 5 page buttons
    const pageNumbers: (string | number)[] = [];

    const handlePageClick = (page: number | string) => {
        if (page === '...') {
            return; // Don't allow clicking on "..."
        } else {
            onPageChange(page as any - 1); // Adjust for 0-based index
        }
    };

    const generatePageNumbers = () => {
        // Case when the number of pages is less than or equal to the rangeSize (5)
        if (totalPages <= rangeSize) {
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            // Always show the first page
            pageNumbers.push(1);

            // Display "..." if currentPage is more than 2 pages away from the first page
            if (currentPage > 2) {
                pageNumbers.push('...');
            }

            // Display the 3 pages around the current page (currentPage - 1, currentPage, currentPage + 1)
            let startPage = Math.max(2, currentPage); // Start one before the current page if not at the edge
            let endPage = Math.min(totalPages - 1, currentPage + 2); // End one after the current page if not at the edge

            // Adjust start and end pages so that there are always 5 page numbers (including 1 and last)
            if (currentPage === 0 || currentPage === 1 || currentPage === 2) {
                startPage = 2; // On the first page, start from 2
                endPage = 5; // Show 5 pages starting from 2
            } else if (currentPage === totalPages - 1 || currentPage === totalPages - 2 || currentPage === totalPages - 3) {
                startPage = totalPages - 4; // On the last page, show the last 5 pages
                endPage = totalPages - 1; // Show up to the last page
            }

            for (let i = startPage; i <= endPage; i++) {
                pageNumbers.push(i);
            }

            // Display "..." if currentPage is more than 2 pages away from the last page
            if (currentPage < totalPages - 3) {
                pageNumbers.push('...');
            }

            // Always show the last page
            if (!pageNumbers.includes(totalPages)) {
                pageNumbers.push(totalPages);
            }
        }
    };

    generatePageNumbers();

    const handleEllipsisClick = (direction: 'left' | 'right') => {
        if (direction === 'left') {
            onPageChange(currentPage - 1);
        } else {
            onPageChange(currentPage + 1);
        }
    };

    return (
        <div className="flex justify-center mt-4 flex-col items-center">
            <div className="flex">
                <button
                    className={`md:w-25 px-4 md:px-2 md:py-2 mx-1 md:border rounded disabled:opacity-50 ${currentPage === 0 ? "" : "cursor-pointer hover:bg-gray-200"}`}
                    disabled={currentPage === 0}
                    onClick={() => onPageChange(currentPage - 1)}
                >
                    Previous
                </button>

                {pageNumbers.map((page, index) => {
                    const isLeftEllipsis = index === 1; // Check if it's the first "..."
                    if (page === '...') {
                        return (
                            <span
                                key={index}
                                className="md:px-4 px-1 md:py-2 py-0 mx-1 cursor-pointer"
                                onClick={() => handleEllipsisClick(isLeftEllipsis ? 'left' : 'right')}
                            >
                ...
              </span>
                        );
                    }

                    return (
                        <button
                            key={index}
                            className={`cursor-pointer md:px-4 px-1 py-0 md:py-2 mx-1 md:border rounded ${currentPage === page as any - 1 ? 'bg-[#000000] text-white border-black' : 'hover:bg-gray-300'}`}
                            onClick={() => handlePageClick(page)}
                        >
                            {page}
                        </button>
                    );
                })}

                <button
                    className={`md:w-25 px-4 md:px-2 md:py-2 mx-1 md:border rounded disabled:opacity-50 ${currentPage === totalPages - 1 ? "" : "cursor-pointer hover:bg-gray-300"}`}
                    disabled={currentPage === totalPages - 1}
                    onClick={() => onPageChange(currentPage + 1)}
                >
                    Next
                </button>
            </div>

            <span className="px-4 py-2 mt-2">
        Page {currentPage + 1} of {totalPages}
      </span>
        </div>
    );
};

interface FiltersProps<T extends Record<string, any>> extends Pick<TableProps<T>, "filters" | "onSearch" | "filterValue" | "filterKey" | "onSetFilterValue" | "onSetFilterKey" | "onReset"> {
}

const Filters = <T extends Record<string, any>, >(props: FiltersProps<T>) => {
    const {filters, onSearch, filterKey, filterValue, onSetFilterKey, onSetFilterValue, onReset} = props;
    return <>
        {
            filters?.map(filter => (
                <input
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            onSearch?.();
                        }
                    }}
                    key={filter.filterKey}
                    type="text"
                    placeholder={`Search ${filter.label}`}
                    value={filterKey === filter.filterKey ? filterValue : ''}
                    onChange={(e) => {
                        onSetFilterValue?.(e.target.value);
                        onSetFilterKey?.(filter.filterKey);
                    }}
                    className="bg-white focus:ring-[#000000] focus:ring-1 focus:border-[#000000] px-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none"
                />
            ))
        }
        <div className={"flex space-x-1"}>
            <button
                onClick={onSearch}
                className="w-20 cursor-pointer focus:ring-[#000000] focus:ring-1 focus:border-[#000000] p-2 rounded border hover:bg-gray-300 focus:outline-none">
                Search
            </button>
            <button
                onClick={onReset}
                className="w-20 cursor-pointer focus:ring-[#000000] focus:ring-1 focus:border-[#000000] p-2 rounded border hover:bg-gray-300 focus:outline-none">
                Reset
            </button>
        </div>
    </>;
}

export default Table;
