import React, { useState, useEffect } from "react";
import { FaArrowRightLong } from "react-icons/fa6";
import { IoSearch } from "react-icons/io5";
import axios from "axios";
import { BsCartPlus } from "react-icons/bs";
const API_URl = "https://dummyjson.com";
import "./Srock.css";

const Stock = () => {
    const [products, setProducts] = useState(null);
    const [categories, setCategories] = useState(null);
    const [selectCategory, setSelectCategory] = useState("");
    const [loading, setLoading] = useState(false);
    const [offset, setOffset] = useState(1);
    const [total, setTotal] = useState(0);
    const limit = 4;

    useEffect(() => {
        fetch(`https://dummyjson.com/products?limit=8`)
            .then((res) => res.json())
            .then((data) => {
                setSearch(data);
            })
            .catch((err) => console.log(err));
    }, []);

    const [data, setData] = useState([]);
    const [search, setSearch] = useState([]);

    const searchForm = (value) => {
        const res = search.products.filter((f) =>
            f.title.toLowerCase().includes(value)
        );
        setData(res);
        if (value === "") {
            setData([]);
        }
    };

    useEffect(() => {
        axios
            .get(`${API_URl}/products/category-list`)
            .then((res) => setCategories(res.data))
            .catch((err) => console.log(err));
    }, []);

    useEffect(() => {
        setLoading(true);
        axios
            .get(`${API_URl}/products${selectCategory}`, {
                params: {
                    limit: limit * offset,
                },
            })
            .then((res) => {
                setTotal(res.data.total);
                setProducts(res.data.products);
            })
            .catch((err) => console.log(err))
            .finally(() => setLoading(false));
    }, [offset, selectCategory]);

    const skeletonItem = new Array(4).fill().map((_, inx) => (
        <div
            key={inx}
            className="good__item sm:w-72 relative transition-all rounded-3xl">
            <div className="w-full bg-gray-200 h-40 sm:h-56 rounded-2xl"></div>
            <div className="w-4/5 h-7 bg-gray-200 mt-2 rounded-2xl"></div>
            <div className="w-full h-7 bg-gray-200 mt-2 rounded-2xl"></div>
            <div className="w-2/5 h-9 bg-gray-200 mt-2 rounded-2xl"></div>
        </div>
    ));

    const categoryItem = categories?.map((category) => (
        <option
            className="font-semibold"
            key={category}
            value={`/category/${category}`}>
            {category.charAt(0).toUpperCase() + category.slice(1)}
        </option>
    ));

    const proitem = products?.map((item) => (
        <li
            className="good__item sm:w-72 relative pt-3 pb-16 border border-white transition-all rounded-3xl hover:bg-slate-50 hover:border hover:border-slate-200"
            key={item.id}>
            <img
                className="w-full h-40 sm:h-56 object-contain"
                src={item.images[0]}
                alt={item.title}
            />
            <div className="px-3">
                <h3 className="mb-2 text-ellipsis overflow-hidden whitespace-nowrap max-w-full text-sm md:text-lg">
                    {item.title}
                </h3>
                <p
                    title={item.description}
                    className="text-xs md:text-base text-ellipsis overflow-hidden whitespace-nowrap max-w-full">
                    {item.description}
                </p>
                <p className="text-xs md:text-sm">117x190 см</p>
                <p className="text-xl md:text-3xl font-bold flex items-end gap-x-2">
                    {item.price} Br
                </p>
            </div>
            <div className="flex w-full justify-between items-center px-3 absolute good__box">
                <select className="border rounded-3xl flex items-center">
                    <option value="1">1 шт.</option>
                    <option value="1">2 шт.</option>
                    <option value="1">3 шт.</option>
                </select>
                <button className="w-11 h-11 rounded-full bg-yellow-500 flex items-center justify-center">
                    <BsCartPlus className="text-xl text-white" />
                </button>
            </div>
        </li>
    ));
    return (
        <section className="pb-16">
            <div className="container max-w-7xl mx-auto px-3 xl:px-0">
                <div className="flex items-center gap-x-1 sm:gap-x-3 mb-9">
                    <h2 className="text-xl font-bold sm:text-3xl">
                        Товары в наличии
                    </h2>
                    <a href="#" className="text-sm font-normal">
                        Все товары в категории
                    </a>
                    <FaArrowRightLong />
                </div>
                <div className="flex flex-col gap-x-4 md:flex-row">
                    <select
                        className="border py-2 w-60 md:w-80 px-4 mb-4 rounded-3xl shadow-inner bg-slate-50 font-semibold "
                        value={selectCategory}
                        onChange={(e) => setSelectCategory(e.target.value)}>
                        <option value="">All</option>
                        {categoryItem}
                    </select>
                    <div className="relative">
                        <div className="flex items-center justify-between border  w-60 md:w-80 mb-4 rounded-3xl shadow-inner bg-slate-50 font-semibold relative">
                            <input
                                onChange={(e) => searchForm(e.target.value)}
                                className="w-full py-2 bg-slate-50 rounded-3xl pl-7 pr-3 shadow-inner"
                                autoComplete="off"
                                type="search"
                                name="search"
                                placeholder="Что желаете найти?"
                            />
                            <IoSearch className="absolute left-2 top-[13px] text-slate-600" />
                        </div>
                        <div className="border border-t-0 border-b-0 w-full absolute top-11 left-0 z-10 bg-slate-50 rounded-3xl">
                            {data.map((d, i) => (
                                <div
                                    className="flex items-center last:border-b-0 py-2 pl-2 cursor-pointer hover:bg-slate-200 hover:rounded-3xl border-b"
                                    key={i}>
                                    <img
                                        className="w-8 h-8 object-contain"
                                        src={d.images[0]}
                                        alt="images"
                                    />
                                    <h3 className="pl-2">{d.title}</h3>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <ul className="flex flex-wrap justify-between gap-y-4 md:justify-around gap-x-1">
                    {proitem}
                    {loading && skeletonItem}
                </ul>
                {limit * offset <= total && (
                    <button
                        onClick={() => setOffset((p) => p + 1)}
                        className="py-2 px-10 mt-3 rounded-3xl bg-yellow-500 text-white block mx-auto transition-all hover:opacity-60">
                        See more
                    </button>
                )}
            </div>
        </section>
    );
};

export default Stock;
