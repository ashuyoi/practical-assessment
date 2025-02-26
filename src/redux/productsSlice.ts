import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { FetchParams, Product } from './types';

interface ProductFetchParams extends FetchParams {
    laptops?: boolean;
}

interface ProductsState {
    limit: number;
    skip: number;
    total: number;
    products: Product[];
    status: "idle" | "succeeded" | "loading" | "failed";
}

export const fetchProducts = createAsyncThunk(
    'products/fetchProducts',
    async ({filterKey, filterValue, limit, skip, laptops}: ProductFetchParams) => {
        let url = `https://dummyjson.com/products?limit=${limit}&skip=${skip}`;
        if (laptops) url = `https://dummyjson.com/products/category/laptops?limit=${limit}&skip=${skip}`;
        if (filterKey && filterValue) {
            url = `https://dummyjson.com/products/filter?key=${filterKey}&value=${filterValue}&limit=${limit}&skip=${skip}`;
        }
        const response = await axios.get(url);
        return response.data;
    }
);

const initialState: ProductsState = {
    limit: 5, skip: 0, total: 0, products: [], status: 'idle'
}

const productsSlice = createSlice({
    name: 'products',
    initialState: initialState,
    reducers: {
        setLimit: (state, action) => {
            state.limit = action.payload;
        },
        setSkip: (state, action) => {
            state.skip = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.skip = action.payload.skip;
                state.total = action.payload.total;
                state.products = action.payload.products;
            })
            .addCase(fetchProducts.rejected, (state) => {
                state.status = 'failed';
            });
    },
});

export const {setLimit, setSkip} = productsSlice.actions;

export default productsSlice.reducer;
