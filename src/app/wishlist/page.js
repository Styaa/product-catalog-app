'use client'
import Navbar from '@/components/layout/Navbar'
import useWishlist from '@/hooks/useWishList';
import { Island_Moments } from 'next/font/google';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function WishlistPage() {
    useEffect(() => {
        document.title = "My Wishlist";
    }, []);

    const [deletingId, setDeletingId] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);
    const { wishlistItems, isLoading, error, removeFromWishlist } = useWishlist()

    const handleDeleteClick = (e, product) => {
        e.preventDefault();
        e.stopPropagation();
        
        setProductToDelete(product);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!productToDelete) return;
        
        setDeletingId(productToDelete.id);
        setShowDeleteModal(false);
        
        try {
            await removeFromWishlist(productToDelete.id);
            console.log('Product removed from wishlist');
        } catch (error) {
            console.error('Error removing from wishlist:', error);
        } finally {
            setDeletingId(null);
            setProductToDelete(null);
        }
    };

    const cancelDelete = () => {
        setShowDeleteModal(false);
        setProductToDelete(null);
    };

    if (isLoading) {
        return (
        <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
        )
    }

    if (wishlistItems.length === 0) {
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
      <Navbar/>

      <main className="container mx-auto px-4 py-8">
            <div className='flex justify-between items-center mb-6'>
                <h2 className="text-2xl font-bold text-gray-200">Product List</h2>
                <p className="text-gray-500">Showing {wishlistItems.length} products</p>
            </div>
            
            <div>
                {wishlistItems.map((product) => (
                    <div key={product.id} className="block mb-8 group">
                        <div className="h-full flex flex-row gap-6 relative">
                            {/* Product Image */}
                            <Link href={`/products/${product.id}`} className="flex-shrink-0">
                                <div className="relative bg-gradient-to-br w-fit from-gray-50 to-gray-100 p-3 rounded-lg">
                                    <img 
                                        src={product.image} 
                                        alt={product.title}
                                        className="w-36 h-48 object-contain mix-blend-multiply"
                                    />
                                    <div className="absolute inset-0 bg-white/5 rounded-lg"></div>
                                </div>
                            </Link>

                            {/* Product Info */}
                            <Link href={`/products/${product.id}`} className="flex-1 py-4">
                                <h3 className="text-gray-200 text-lg mb-2 line-clamp-2 hover:text-white transition-colors">
                                    {product.title}
                                </h3>
                                <p className="text-gray-400 text-sm mb-2 capitalize">{product.category}</p>
                                <p className="text-gray-400 text-xl">${product.price}</p>
                            </Link>

                            {/* Delete Button */}
                            <button
                                onClick={(e) => handleDeleteClick(e, product)}
                                disabled={deletingId === product.id}
                                className="absolute top-2 right-2 bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white p-2 rounded-full transition-all duration-200 disabled:opacity-50 group-hover:scale-110"
                                title="Hapus dari wishlist"
                            >
                                {deletingId === product.id ? (
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-400"></div>
                                ) : (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1H8a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                ))}

                {/* Empty State */}
                {wishlistItems.length === 0 && (
                    <div className="text-center py-16">
                        <div className="bg-gray-800 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                            <svg className="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-4">Wishlist Kosong</h2>
                        <p className="text-gray-400 mb-8">Mulai tambahkan produk yang Anda sukai ke wishlist</p>
                        <Link 
                            href="/products"
                            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg inline-block transition-colors"
                        >
                            Jelajahi Produk
                        </Link>
                    </div>
                )}

                {/* Delete Confirmation Modal */}
                {showDeleteModal && productToDelete && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 border border-gray-600">
                            {/* Modal Header */}
                            <div className="flex items-center gap-3 mb-4">
                                <div className="bg-red-500/20 p-2 rounded-full">
                                    <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1H8a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </div>
                                <h3 className="text-white font-bold text-lg">Hapus dari Wishlist</h3>
                            </div>

                            {/* Product Preview in Modal */}
                            <div className="bg-gray-700/50 rounded-lg p-4 mb-6">
                                <div className="flex items-center gap-4">
                                    <img 
                                        src={productToDelete.image} 
                                        alt={productToDelete.title}
                                        className="w-16 h-16 object-contain bg-white rounded"
                                    />
                                    <div className="flex-1">
                                        <h4 className="text-white font-medium line-clamp-2 mb-1">
                                            {productToDelete.title}
                                        </h4>
                                        <p className="text-gray-400 text-sm">${productToDelete.price}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Confirmation Message */}
                            <p className="text-gray-300 mb-6">
                                Apakah Anda yakin ingin menghapus produk ini dari wishlist? 
                                <span className="block text-gray-400 text-sm mt-1">
                                    Tindakan ini tidak dapat dibatalkan.
                                </span>
                            </p>

                            {/* Action Buttons */}
                            <div className="flex gap-3">
                                <button
                                    onClick={cancelDelete}
                                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 px-4 rounded-lg transition-colors font-medium"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1H8a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    Hapus
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </main>
    </div>
  )
}