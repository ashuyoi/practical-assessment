import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, setLimit, setSkip } from "../redux/usersSlice";
import Table, { Column } from '../components/Table';
import { RootState } from '../App';

const columns: Column[] = [
    {key: "firstName", label: "First name"},
    {key: "lastName", label: "Last name"},
    {key: "maidenName", label: "Maiden name"},
    {key: "age", label: "Age"},
    {key: "gender", label: "Gender"},
    {key: "birthDate", label: "Birth date"},
    {key: "email", label: "Email"},
    {key: "username", label: "Username"},
    {key: "bloodGroup", label: "Bloodgroup"},
    {key: "eyeColor", label: "Eyecolor"},
    {key: "hair.color", label: "Hair color"},
    {key: "hair.type", label: "Hair type"},
    {key: "address.country", label: "Country"}
];

const filters = [
    {filterKey: "firstName", label: "First Name"},
    {filterKey: "lastName", label: "Last Name"},
    {filterKey: "gender", label: "Gender"},
    {filterKey: "birthDate", label: "Birth Date"},
];

const Users = () => {
    const dispatch = useDispatch();
    const {users, total, limit, skip, status} = useSelector((state: RootState) => state.users);

    const [filterValue, setFilterValue] = useState<string | undefined>();
    const [filterKey, setFilterKey] = useState('');

    const handlePageChange = useCallback((newSkip: number) => {
        dispatch(setSkip(newSkip * limit))
        dispatch(fetchUsers({
            skip: (newSkip * limit),
            limit: limit,
            filterKey: filterKey,
            filterValue: filterValue
        }) as any);
    }, [limit, filterKey, filterValue, dispatch]);

    const onSetLimit = (limit: number) => {
        dispatch(setSkip(0));
        dispatch(setLimit(limit));
    }

    useEffect(() => {
        dispatch(fetchUsers({skip: 0, limit: limit}) as any);
    }, [limit, dispatch]);

    const onSearch = useCallback(() => {
        if (filterValue !== '' && filterKey !== '') {
            dispatch(fetchUsers({skip: 0, limit: limit, filterKey: filterKey, filterValue: filterValue}) as any);
        } else {
            dispatch(fetchUsers({skip: 0, limit: limit}) as any);
        }
    }, [dispatch, filterKey, filterValue, limit]);

    const onReset = useCallback(() => {
        setFilterValue("");
        setFilterKey("")
        dispatch(setSkip(0));
        dispatch(fetchUsers({skip: 0, limit: limit}) as any);
    }, [dispatch, limit]);

    return (
        <Table
            data={users}
            loading={status === "loading"}
            columns={columns}
            onSetLimit={onSetLimit}
            limit={limit}
            total={total}
            skip={skip}
            handlePageChange={handlePageChange}
            filters={filters}
            onSetFilterKey={setFilterKey}
            onSetFilterValue={setFilterValue}
            filterKey={filterKey}
            filterValue={filterValue}
            onSearch={onSearch}
            onReset={onReset}/>
    );
};

export default Users;
