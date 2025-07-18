'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function ProductList({ searchTerm, selectedCategory }) {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const fetchProducts = async () => {
        try {
            setLoading(true)
            setError(null)

            const response = await fetch('https://fakestoreapi.com/products')
            
            if(!response.ok){
                throw new Error(`Error: ${response.status}`)
            }

            let data = await response.json()
            if (searchTerm?.search) {
                data = data.filter(product => 
                    product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    product.description.toLowerCase().includes(searchTerm.toLowerCase())
                )

                if(selectedCategory){
                    data = data.filter(product =>
                        product.category.includes(selectedCategory)
                    )
                }
            }
            setProducts(data)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchProducts()
    }, [searchTerm, selectedCategory])

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
                onClick={fetchProducts}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            >
                Try Again
            </button>
            </div>
        </div>
        )
    }

    if (products.length === 0) {
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
        <div className=''>
            <div className='flex justify-between items-center mb-6'>
                <h2 className="text-2xl font-bold text-gray-500">Product List</h2>
                <p className="text-gray-500">Showing {products.length} products</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                {products.map((product) => (
                <div key={product.id} className="h-full flex flex-col">
                    <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 p-3 rounded-lg">
                        <img 
                        src={product.image} 
                        alt={product.title}
                        className="w-full h-48 object-contain mix-blend-multiply"
                        />

                        <div className="absolute inset-0 bg-white/5"></div>
                    </div>
                    <div className="py-4">
                        <h3 className="text-gray-200 text-lg mb-2 line-clamp-2">{product.title}</h3>
                        <p className="text-gray-400 text-sm mb-2 capitalize">{product.category}</p>
                        <p className="text-gray-400 text-xl">${product.price}</p>
                    </div>
                </div>
                ))}
            </div>
        </div>
    )
}