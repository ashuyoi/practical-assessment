import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { FetchParams, User } from './types';

interface UsersState {
    limit: number;
    skip: number;
    total: number;
    users: User[];
    status: "idle" | "succeeded" | "loading" | "failed";
}

export const fetchUsers = createAsyncThunk(
    'users/fetchUsers',
    async ({filterKey, filterValue, limit, skip}: FetchParams) => {
        let url = `https://dummyjson.com/users?limit=${limit}&skip=${skip}`;
        if (filterKey && filterValue) {
            url = `https://dummyjson.com/users/filter?key=${filterKey}&value=${filterValue}&limit=${limit}&skip=${skip}`;
        }
        const response = await axios.get(url);
        return response.data;
    }
);

const initialState: UsersState = {
    limit: 5, skip: 0, total: 0, users: [], status: 'idle'
}

const usersSlice = createSlice({
    name: 'users',
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
            .addCase(fetchUsers.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.total = action.payload.total;
                state.users = action.payload.users;
            })
            .addCase(fetchUsers.rejected, (state) => {
                state.status = 'failed';
            });
    },
});

export const {setLimit, setSkip} = usersSlice.actions;

export default usersSlice.reducer;
