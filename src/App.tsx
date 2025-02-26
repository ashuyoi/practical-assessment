import React from "react";
import { BrowserRouter as Router, Navigate, NavLink, Route, Routes } from "react-router";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "./redux/usersSlice";
import productsReducer from "./redux/productsSlice";
import Users from "./pages/Users";
import Products from "./pages/Products";
import "./index.css";

const store = configureStore({
    reducer: {
        users: usersReducer,
        products: productsReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;

const App: React.FC = () => {
    return (
        <Provider store={store}>
            <Router>
                <div className="p-4 bg-[#ebebeb] min-h-screen font-[\'Neutra Text\']">
                    <nav className="mb-4 flex gap-2">
                        <NavLink to="/users" className={({isActive}) =>
                            `text-[#000000] font-bold ${
                                isActive ? 'bg-[#fdc936]' : ''
                            }`
                        }>Users</NavLink>
                        /
                        <NavLink to="/products" className={({isActive}) =>
                            `text-[#000000] font-bold ${
                                isActive ? 'bg-[#fdc936]' : ''
                            }`
                        }>Products</NavLink>
                    </nav>
                    <Routes>
                        <Route path="/" element={<Navigate to="/users"/>}/>
                        <Route path="/users" element={<Users/>}/>
                        <Route path="/products" element={<Products/>}/>
                    </Routes>
                </div>
            </Router>
        </Provider>
    );
};

export default App;
