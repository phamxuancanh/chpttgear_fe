import React, { useState } from "react";
import { FiSearch, FiShoppingCart } from "react-icons/fi";
import ProductCard from "../components/ProductCard";
import { useEffect } from "react";
import { findAllCategory, getSuggestions } from "../routers/ApiRoutes";
import { Pagination } from '@mui/material'
import { styled } from '@mui/system'
import { useLocation, useNavigate } from 'react-router-dom'
import ROUTES from '../constants/Page';
import { debounce } from 'lodash'

export default function Home() {
    const navigate = useNavigate()
    const CustomPagination = styled(Pagination)({
        '.MuiPagination-ul': {
            display: 'inline-flex',
            fontSize: 'large',
            listStyle: 'none',
            margin: '10px',
            '@media (max-width: 600px)': {
                margin: '5px'
            }
        },
        '.MuiPaginationItem-root': {
            fontSize: 'large',
            fontWeight: 'bold',
            borderRadius: '4px',
            margin: '2px',
            border: '1px solid #cbd5e0',
            backgroundColor: 'white',
            color: '#718096',
            '&:hover': {
                backgroundColor: '#667eea',
                color: 'white'
            },
            '@media (max-width: 600px)': {
                margin: '0px'
            }
        },
        '.MuiPaginationItem-firstLast': {
            borderRadius: '4px'
        },
        '.MuiPaginationItem-previousNext': {
            borderRadius: '4px',
            margin: '10px',
            '@media (min-width: 600px)': {
                margin: '20px'
            },
            '@media (max-width: 600px)': {
                fontSize: 'medium',
                margin: '0px'
            }
        },
        '.MuiPaginationItem-page.Mui-selected': {
            color: '#667eea',
            fontWeight: 'bold',
            border: '2px solid #667eea',
            backgroundColor: 'white',
            '&:hover': {
                backgroundColor: '#667eea',
                color: 'white'
            }
        },
        '.MuiPaginationItem-ellipsis': {
            color: '#a0aec0',
            border: '1px solid #cbd5e0',
            backgroundColor: 'white',
            padding: '2px',
            margin: '0',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center'
        }
    })
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [categories, setCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const fetchSuggestions = debounce(async (value) => {
        try {
            const response = await getSuggestions(value);
            console.log(response);
            setSuggestions(response.data);
        } catch (error) {
            console.error('Error fetching suggestions:', error);
        }
    }, 300);
    console.log(suggestions);
    useEffect(() => {
        const fetchCategories = async () => {
            const response = await findAllCategory();
            console.log(response.data);
            const data = response.data;
            setCategories(data);
        };
        fetchCategories();
    }, []);

    const handleCategoryChange = (categoryName) => {
        setSelectedCategories((prev) =>
            prev.includes(categoryName)
                ? prev.filter((name) => name !== categoryName)
                : [...prev, categoryName]
        );
    };

    const handleSearchClick = async () => {
        // const response = await searchProducts({ params: { search: searchTerm } });
        // console.log(response.data);
        setSuggestions([])
        const encodedSearchTerm = encodeURIComponent(searchTerm);
        navigate(`${ROUTES.SEARCH_RESULTS.path}?name=${encodedSearchTerm}`);
    };

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchTerm(value);

        if (value.length > 1) {
            fetchSuggestions(value);
        } else {
            setSuggestions([]);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearchClick();
        }
    };
    const recommendedProducts = [
        {
            id: 1,
            name: "AMD Ryzen 9 5950X",
            price: "$699",
            // image: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?ixlib=rb-4.0.3",
        },
        {
            id: 2,
            name: "NVIDIA RTX 4080",
            price: "$1199",
            // image: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?ixlib=rb-4.0.3",
        },
        {
            id: 3,
            name: "ASUS ROG Maximus",
            price: "$599",
            // image: "https://images.unsplash.com/photo-1592664474505-51c764ec6666?ixlib=rb-4.0.3",
        },
        {
            id: 4,
            name: "Corsair Vengeance 32GB",
            price: "$159",
            // image: "https://images.unsplash.com/photo-1562976540-1502c2145186?ixlib=rb-4.0.3",
        },
    ];

    const hotProducts = [
        {
            id: 5,
            name: "Samsung 2TB NVMe SSD",
            price: "$229",
            // image: "https://images.unsplash.com/photo-1628557044797-f21654f9008b?ixlib=rb-4.0.3",
        },
        {
            id: 6,
            name: "Intel Core i9-13900K",
            price: "$589",
            // image: "https://images.unsplash.com/photo-1555680202-c86f0e12f086?ixlib=rb-4.0.3",
        },
        {
            id: 7,
            name: "MSI Gaming X Trio",
            price: "$799",
            // image: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?ixlib=rb-4.0.3",
        },
        {
            id: 8,
            name: "G.Skill Trident Z5",
            price: "$189",
            // image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?ixlib=rb-4.0.3",
        },
    ];

    const bestSellers = [
        {
            id: 9,
            name: "WD Black SN850X 1TB",
            price: "$149",
            // image: "https://images.unsplash.com/photo-1597872200928-9c0974483413?ixlib=rb-4.0.3",
        },
        {
            id: 10,
            name: "AMD Ryzen 7 7800X3D",
            price: "$449",
            // image: "https://images.unsplash.com/photo-1592664474504-8afb0e869925?ixlib=rb-4.0.3",
        },
        {
            id: 11,
            name: "ASUS TUF Gaming B650",
            price: "$219",
            // image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?ixlib=rb-4.0.3",
        },
        {
            id: 12,
            name: "Crucial RAM 64GB",
            price: "$259",
            // image: "https://images.unsplash.com/photo-1591799264319-96c15fdb541c?ixlib=rb-4.0.3",
        },
    ];



    return (
        <div className="min-h-screen bg-background">
            <header className="bg-card shadow-sm top-0 z-10">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex-1 w-full flex items-center">
                        <div className="relative flex-grow">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={handleSearch}
                                onKeyDown={handleKeyPress}
                                placeholder="Search for components..."
                                className="w-full py-2 px-4 pr-10 rounded-md border border-input focus:outline-none focus:ring-2 focus:ring-ring bg-card text-foreground"
                            />
                            <FiSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />

                            {suggestions?.length > 0 && (
                                <ul className="absolute left-0 top-full mt-1 bg-white border border-gray-300 w-full max-h-96 overflow-y-auto z-50 shadow-2xl rounded-b-lg">
                                    {suggestions.map((suggestion) => (
                                        <li
                                            key={suggestion.id}
                                            className="p-2 hover:bg-gray-100 hover:font-bold cursor-pointer"
                                            onClick={() => setSearchTerm(suggestion.name)}
                                        >
                                            {suggestion.name}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        <button
                            onClick={handleSearchClick}
                            className="ml-4 px-4 py-2 bg-green-200  text-black rounded-md hover:bg-primary-dark transition-colors"
                        >
                            Tìm kiếm
                        </button>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                <section className="mb-12">
                    <h2 className="text-2xl font-bold text-foreground mb-6">Categories</h2>
                    <div className="flex flex-wrap gap-4">
                        {categories.map((category) => (
                            <label
                                key={category.id}
                                className="flex items-center space-x-2 bg-card p-3 rounded-md cursor-pointer hover:bg-muted transition-colors"
                            >
                                <input
                                    type="checkbox"
                                    checked={selectedCategories.includes(category.name)}
                                    onChange={() => handleCategoryChange(category.name)}
                                    className="form-checkbox h-5 w-5 text-primary rounded border-input"
                                />
                                <span className="text-foreground">{category.name}</span>
                            </label>
                        ))}
                    </div>
                </section>

                <section className="mb-12">
                    <h2 className="text-2xl font-bold text-foreground mb-6">Recommended Products</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {recommendedProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </section>
                <section className="mb-12">
                    <h2 className="text-2xl font-bold text-foreground mb-6">Hot Products</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {hotProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </section>
                <section className="mb-12">
                    <h2 className="text-2xl font-bold text-foreground mb-6">Best Sellers</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {bestSellers.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </section>
                <div className="flex justify-center">
                    <CustomPagination
                        count={10}
                        page={1}
                        // onChange={(_, page) => handleChangePaginationNew(page)}
                        boundaryCount={1}
                        siblingCount={1}
                    />
                </div>
            </main>


        </div>
    );
};
