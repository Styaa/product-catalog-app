'use client'
import { useState, useEffect } from 'react'

export default function ProductSearch({ searchTerm, onSearchChange, selectedCategory, onCategoryChange, placeholder = "Search products..." }) {
    const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm)
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const fetchCategory = async () => {
        try {
            const response = await fetch('https://fakestoreapi.com/products/categories')

            if(!response.ok){
                throw new Error(`Error: ${response.status}`)
            }

            let data = await response.json()
            setCategories(data)
        } catch (err){
            setError(err.message)
        }
    }

    useEffect(() => {
        fetchCategory()
    }, [])

    useEffect(() => {
        const timer = setTimeout(() => {
            onSearchChange(localSearchTerm)
        }, 300)

        return () => clearTimeout(timer)
    }, [localSearchTerm, onSearchChange])

    useEffect(() => {
        setLocalSearchTerm(searchTerm)
    }, [searchTerm])

    const handleClear = () => {
        setLocalSearchTerm('')
        onSearchChange('')
    }

    const handleCategoryClick = (category) => {
        onCategoryChange(category)
    }

    return (
        <div className="relative mb-6">
            <div className="relative">
                <input
                type="text"
                value={localSearchTerm}
                onChange={(e) => setLocalSearchTerm(e.target.value)}
                placeholder={placeholder}
                className="w-full h-14 pl-12 pr-12 py-2 text-gray-200 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                />
                
                {/* Search Icon */}
                <svg
                className="absolute left-4 top-4 h-6 w-6 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
                </svg>

                {/* Clear Button */}
                {localSearchTerm && (
                <button
                    onClick={handleClear}
                    className="absolute right-4 top-4 h-6 w-6 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                    />
                    </svg>
                </button>
                )}
            </div>

            {/* Search Results Counter */}
            {/* {localSearchTerm && (
                <div className="absolute top-full left-0 right-0 mt-1 text-sm text-gray-600 text-center">
                Search results for "{localSearchTerm}"
                </div>
            )} */}

            <div className='pt-6'>
                {loading ? (
                    // ← TAMBAH: Loading skeleton untuk categories
                    <div className="flex space-x-3">
                        {[...Array(4)].map((_, index) => (
                            <div key={index} className="h-10 w-24 bg-gray-600 rounded-lg animate-pulse"></div>
                        ))}
                    </div>
                ) : error ? (
                    // ← TAMBAH: Error state
                    <div className="text-red-400 text-sm">
                        Error loading categories: {error}
                    </div>
                ) : (
                    <div className='flex flex-wrap gap-3'>
                        {/* All Categories Button */}
                        <button 
                            className={`py-2 px-5 rounded-lg transition-all duration-200 capitalize ${
                                selectedCategory === ''
                                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/50'
                                    : 'text-gray-200 bg-gray-700 hover:bg-gray-600 hover:shadow-lg hover:shadow-blue-500/30'
                            }`}
                            onClick={() => handleCategoryClick('')}
                        >
                            All Categories
                        </button>

                        {/* Category Buttons */}
                        {categories.map((category) => (
                            <button 
                                key={category}
                                className={`py-2 px-5 rounded-lg transition-all duration-200 capitalize ${
                                    selectedCategory === category
                                        ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/50'
                                        : 'text-gray-200 bg-gray-700 hover:bg-gray-600 hover:shadow-lg hover:shadow-blue-500/30'
                                }`}
                                onClick={() => handleCategoryClick(category)}
                            >
                                {category.replace(/'/g, '')}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}