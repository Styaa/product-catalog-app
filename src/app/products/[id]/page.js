'use client'
import Navbar from "@/components/layout/Navbar";
import useWishlist from "@/hooks/useWishList";
import { useEffect, useState, use, useMemo } from "react";
import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button} from "@heroui/react";

export default function DetailProductPage({ params }) {
    useEffect(() => {
        document.title = "Detail Product";
    }, []);

    const [product, setProduct] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const [nama, setNama] = useState('');
    const [email, setEmail] = useState('');
    const [selectedKeys, setSelectedKeys] = useState(new Set(["0"]))
    const [komentar, setKomentar] = useState('')

    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const ratingOptions = {
        "5": { stars: "★★★★★", label: "Excellent", color: "text-green-400" },
        "4": { stars: "★★★★☆", label: "Good", color: "text-blue-400" },
        "3": { stars: "★★★☆☆", label: "Average", color: "text-yellow-400" },
        "2": { stars: "★★☆☆☆", label: "Poor", color: "text-orange-400" },
        "1": { stars: "★☆☆☆☆", label: "Terrible", color: "text-red-400" },
        "0": { stars: "☆☆☆☆☆", label: "Select rating", color: "text-gray-400" }
    }

    const selectedValue = useMemo(() => {
        const selected = Array.from(selectedKeys)[0];
        const option = ratingOptions[selected];
        
        return (
            <div className="flex items-center gap-2">
                <span className={option.color}>{option.stars}</span>
                <span className="text-gray-200">{option.label}</span>
            </div>
        );
    }, [selectedKeys])

    const handleSelectionChange = (keys) => {
        const newRating = Array.from(keys)[0];
        if (newRating === "0") return;
        
        setSelectedKeys(keys);
    }

    const { id } = use(params)

    const {
        isInWishlist,
        toggleWishlist,
        isLoading: wishlistLoading,
        error: wishlistError,
        wishlistCount
    } = useWishlist()

    useEffect(() => {
        fetchProduct()
    }, [id])

    const fetchProduct = async () => {
        try {
            setLoading(true)
            setError(null)

            const response = await fetch(`https://fakestoreapi.com/products/${id}`)

            if(!response.ok){
                throw new Error(`Error: ${response.status}`)
            }

            let data = await response.json()
            setProduct(data)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleWishlistToggle = async () => {
        try {
            if (product) {
                await toggleWishlist(product);
            }
        } catch (error) {
            console.error('Failed to update wishlist:', error);
        } 
    };

    const handleKomentarChange = (event) => {
        setKomentar(event.target.value);
      };

    const handleSubmit = (e) => {
        e.preventDefault();
        const selectedRating = Array.from(selectedKeys)[0];
        
        // Validation checks
        if (!nama.trim()) {
            setErrorMessage('Nama harus diisi!');
            setShowErrorModal(true);
            return;
        }
        
        if (!email.trim()) {
            setErrorMessage('Email harus diisi!');
            setShowErrorModal(true);
            return;
        }
        
        if (!email.includes('@')) {
            setErrorMessage('Format email tidak valid!');
            setShowErrorModal(true);
            return;
        }
        
        if (selectedRating === '0') {
            setErrorMessage('Rating harus dipilih!');
            setShowErrorModal(true);
            return;
        }
        
        setShowSuccessModal(true)
        
        // Reset form
        setNama('');
        setEmail('');
        setSelectedKeys(new Set(['0']));
        setKomentar('');
    };

    const closeErrorModal = () => {
        setShowErrorModal(false);
        setErrorMessage('');
    };

    const closeSuccessModal = () => {
        setShowSuccessModal(false);
    };

    const isProductInWishlist = isInWishlist(product.id);

    if (loading) {
        return (
        <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
        )
    }

    if (error) {
        return (
        <div className="text-center py-8">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-red-800 font-medium mb-2">Error</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button 
                onClick={fetchProduct}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            >
                Try Again
            </button>
            </div>
        </div>
        )
    }

    if (!product) {
        return (
        <div className="text-center py-8">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <h3 className="text-gray-800 font-medium mb-2">No Products Found</h3>
            <p className="text-gray-600">Please try again later</p>
            </div>
        </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#171b24]">
            <Navbar />

            <main className="container mx-auto px-4 py-8">
                <div>
                    <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 p-3 rounded-lg">
                            <img 
                            src={product.image} 
                            alt={product.title}
                            className="w-full h-120 object-contain mix-blend-multiply"
                            />

                            <div className="absolute inset-0 bg-white/5"></div>
                        </div>

                    <div className="pt-8 space-y-4">
                        <div>
                            <h1 className="text-gray-100 font-bold text-3xl md:text-4xl mb-4 line-clamp-2">
                                {product.title}
                            </h1>

                            <div className="inline-flex items-center">
                                <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm font-medium capitalize backdrop-blur-sm">{product.category}</span>
                            </div>
                        </div>
                        <div className="prose prose-invert max-w-none">
                            <p className="text-gray-300 line-clamp-4 text-lg leading-relaxed">
                                {product.description}
                            </p>
                        </div>
                        <p className="text-gray-500 line-clamp-4 text-lg tracking-wider">
                            Avarage Rating: {product.rating['rate']} stars ({product.rating['count']} reviews)
                        </p>
                        <h2 className="text-gray-100 font-bold text-3xl line-clamp-2">
                            ${product.price}
                        </h2>
                    </div>

                    <div className="pt-8">
                        <button
                            onClick={handleWishlistToggle}
                            disabled={wishlistLoading}
                            className={`
                                group relative flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 min-w-[160px]
                                ${isProductInWishlist 
                                    ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg' 
                                    : 'bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white border border-gray-600 hover:border-gray-500'
                                }
                                ${wishlistLoading ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}
                            `}
                        >
                            {wishlistLoading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    <span>Loading...</span>
                                </>
                            ) : (
                                <>
                                    <svg 
                                        className={`w-5 h-5 transition-transform duration-200 ${isProductInWishlist ? 'scale-110' : 'group-hover:scale-110'}`}
                                        fill={isProductInWishlist ? 'currentColor' : 'none'}
                                        stroke="currentColor" 
                                        viewBox="0 0 24 24"
                                    >
                                        <path 
                                            strokeLinecap="round" 
                                            strokeLinejoin="round" 
                                            strokeWidth={isProductInWishlist ? 0 : 2}
                                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                        />
                                    </svg>
                                    <span className="font-medium">
                                        {isProductInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
                                    </span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
                <div className="pt-8">
                    <div>
                        <h1 className="text-gray-100 font-bold text-3xl md:text-4xl mb-4 line-clamp-2">
                            Customer Review
                        </h1>

                        <div>
                            <form onSubmit={handleSubmit}>
                                <div className="flex gap-6 pb-6">
                                    <input 
                                        className="w-1/2 h-10 pl-6 pr-12 text-gray-200 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors" 
                                        type="text" 
                                        placeholder="Nama" 
                                        value={nama}
                                        onChange={(e) => setNama(e.target.value)}
                                        
                                    />

                                    <input 
                                        className="w-1/2 h-10 pl-6 pr-12 text-gray-200 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors" 
                                        type="email" 
                                        placeholder="Email" 
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        
                                    />
                                </div>

                                <div className="pb-6">
                                    <Dropdown className="w-full">
                                        <DropdownTrigger>
                                            <Button 
                                                className="h-12 pl-4 pr-8 text-gray-200 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors flex items-center gap-2 min-w-[200px] justify-start" 
                                                variant="bordered"
                                            >
                                                {selectedValue}
                                                <svg className="w-4 h-4 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </Button>
                                        </DropdownTrigger>
                                        <DropdownMenu
                                            className="bg-gray-700 rounded-md border border-gray-600 shadow-lg min-w-[220px]"
                                            selectedKeys={selectedKeys}
                                            selectionMode="single"
                                            variant="flat"
                                            onSelectionChange={handleSelectionChange}
                                        >
                                            {Object.entries(ratingOptions).slice(1, 6).map(([key, option]) => (
                                                <DropdownItem 
                                                    key={key}
                                                    className="text-gray-200 hover:bg-gray-600 transition-colors py-3"
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <span className={`${option.color} text-lg`}>{option.stars}</span>
                                                            <span className="font-medium">{option.label}</span>
                                                        </div>
                                                        {/* <span className="text-sm text-gray-400">{key}</span> */}
                                                    </div>
                                                </DropdownItem>
                                            ))}
                                        </DropdownMenu>
                                    </Dropdown>
                                </div>

                                <textarea
                                    className="w-full h-24 p-4 text-gray-200 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                                    placeholder="Tulis review Anda..."
                                    value={komentar}
                                    onChange={handleKomentarChange}
                                />

                                <div className="pt-4">
                                    <button 
                                        type="submit"
                                        className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md transition-colors"
                                    >
                                        Submit Review
                                    </button>
                                </div>
                            </form>


                            {showErrorModal && (
                                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                                    <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 border border-gray-600">
                                        <div className="flex items-center gap-3 mb-4">
                                            <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                            </svg>
                                            <h3 className="text-white font-bold text-lg">Data Tidak Lengkap</h3>
                                        </div>
                                        <p className="text-gray-300 mb-6">{errorMessage}</p>
                                        <div className="flex justify-end">
                                            <button
                                                onClick={closeErrorModal}
                                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors"
                                            >
                                                OK
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {showSuccessModal && (
                                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                                    <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 border border-gray-600">
                                        <div className="flex items-center gap-3 mb-4">
                                            <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <h3 className="text-white font-bold text-lg">Review Berhasil Dikirim!</h3>
                                        </div>
                                        <p className="text-gray-300 mb-6">
                                            Terima kasih! Review Anda telah berhasil dikirim dan akan membantu pembeli lain.
                                        </p>
                                        <div className="flex justify-end">
                                            <button
                                                onClick={closeSuccessModal}
                                                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-colors"
                                            >
                                                OK
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}