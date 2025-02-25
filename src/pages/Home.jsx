import React, { useState } from "react";
import { FiSearch, FiShoppingCart } from "react-icons/fi";
import ProductCard from "../components/ProductCard";
import { useEffect } from "react";
import { findAllCategory, getAllProduct, getSuggestions } from "../routers/ApiRoutes";
import { Pagination } from '@mui/material'
import { styled } from '@mui/system'
import { useLocation, useNavigate } from 'react-router-dom'
import ROUTES from '../constants/Page';
import { debounce } from 'lodash'
import Loading from "../utils/Loading";

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
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(false)

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


        const fetchData = async () => {
            try {
                const res1 = await getAllProduct();

                setProducts(res1.data)

            } catch (error) {
                console.error("Error fetching inventory:", error);
            }
        };
        setLoading(true)
        fetchCategories();
        fetchData();
        setLoading(false)
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


    return (
        <div className="min-h-screen bg-background">
            {loading ? <Loading /> : <main className="container mx-auto px-4 py-8">
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
                        {products.slice(0, 4).map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </section>
                <section className="mb-12">
                    <h2 className="text-2xl font-bold text-foreground mb-6">Hot Products</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {products.slice(0, 4).map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </section>
                <section className="mb-12">
                    <h2 className="text-2xl font-bold text-foreground mb-6">Best Sellers</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {products.slice(0, 4).map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </section>
                {/* <div className="flex justify-center">
                    <CustomPagination
                        count={10}
                        page={1}
                        // onChange={(_, page) => handleChangePaginationNew(page)}
                        boundaryCount={1}
                        siblingCount={1}
                    />
                </div> */}
            </main>}


        </div>
    );
};
