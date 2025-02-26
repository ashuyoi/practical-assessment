import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, setLimit, setSkip } from "../redux/productsSlice";
import Table, { Column } from '../components/Table';
import { RootState } from '../App';

const columns: Column[] = [
    {key: "title", label: "Title"},
    {key: "description", label: "Description", customClassName: "w-90"},
    {key: "category", label: "Category"},
    {key: "price", label: "Price", prefix: "AED ", customClassName: "w-30"},
    {key: "discountPercentage", label: "Discount percentage", suffix: "%", customClassName: "w-10"},
    {key: "stock", label: "Stock"},
    {key: "brand", label: "Brand"},
    {key: "sku", label: "Sku"},
    {key: "warrantyInformation", label: "Warranty information"},
    {key: "shippingInformation", label: "Shipping information"},
    {key: "rating", label: "Rating"},
];

const Products = () => {
    const dispatch = useDispatch();
    const {products, total, limit, skip, status} = useSelector((state: RootState) => state.products);
    const [filter, setFilter] = useState<'ALL' | 'Laptops'>('ALL');

    useEffect(() => {
        dispatch(fetchProducts({
            skip: 0,
            limit: limit,
            laptops: filter === 'Laptops',
        }) as any);
    }, [dispatch, limit, filter]);

    const handlePageChange = useCallback((newSkip: number) => {
        dispatch(setSkip(newSkip * limit))
        dispatch(fetchProducts({
            skip: (newSkip * limit),
            limit: limit,
            laptops: filter === "Laptops",
        }) as any);
    }, [limit, dispatch, filter]);

    const onSetLimit = (limit: number) => {
        dispatch(setSkip(0));
        dispatch(setLimit(limit));
    }

    return (
        <div>
            <div className="space-x-1 mb-2">
                <button
                    onClick={() => setFilter('ALL')}
                    className={`w-25 cursor-pointer px-4 py-2 mx-1 border rounded disabled:opacity-50 ${filter === "ALL" ? "bg-[#000000] text-white border-black" : "hover:bg-gray-300"}`}
                >
                    All
                </button>
                <button
                    onClick={() => setFilter('Laptops')}
                    className={`w-25 cursor-pointer px-4 py-2 mx-1 border rounded disabled:opacity-50 ${filter === "Laptops" ? "bg-[#000000] text-white border-black" : "hover:bg-gray-300"}`}
                >
                    Laptops
                </button>
            </div>
            <Table
                data={products}
                loading={status === "loading"}
                columns={columns}
                onSetLimit={onSetLimit}
                limit={limit}
                total={total}
                skip={skip}
                handlePageChange={handlePageChange}/>
        </div>
    );
};

export default Products;
