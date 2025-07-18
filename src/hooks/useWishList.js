'use client'
import { useState, useEffect } from 'react'

export default function useWishlist() {
  const [wishlistCount, setWishlistCount] = useState(0)
  const [wishlistItems, setWishlistItems] = useState([])

  useEffect(() => {
    // Load wishlist from localStorage
    const savedWishlist = localStorage.getItem('wishlist')
    if (savedWishlist) {
      const items = JSON.parse(savedWishlist)
      setWishlistItems(items)
      setWishlistCount(items.length)
    }
  }, [])

  const addToWishlist = (product) => {
    const updatedItems = [...wishlistItems, product]
    setWishlistItems(updatedItems)
    setWishlistCount(updatedItems.length)
    localStorage.setItem('wishlist', JSON.stringify(updatedItems))
  }

  const removeFromWishlist = (productId) => {
    const updatedItems = wishlistItems.filter(item => item.id !== productId)
    setWishlistItems(updatedItems)
    setWishlistCount(updatedItems.length)
    localStorage.setItem('wishlist', JSON.stringify(updatedItems))
  }

  return {
    wishlistCount,
    wishlistItems,
    addToWishlist,
    removeFromWishlist
  }
}