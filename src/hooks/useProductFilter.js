'use client'
import { useState, useEffect, useMemo } from 'react'

export default function useProductSearch() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [products, setProducts] = useState([])
  const [categories, setcategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [categoriesLoading, setCategoriesLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch Category
  const fetchCategory = async () =>  {
    try{
      setCategoriesLoading(true)
      const response = await fetch('https://fakestoreapi.com/products/categories')

      if(!response.ok){
        throw new Error(`Error: ${response.status}`)
      }

      const data = await response.json()

      setcategories(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setCategoriesLoading(false)
    }
  }

  // Fetch products
  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('https://fakestoreapi.com/products')
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }
      
      const data = await response.json()
      setProducts(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Filter products berdasarkan search term
  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim() && selectedCategory == '') {
      return products
    }

    if (searchTerm) {
      return products.filter(product =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    } else {
      return products.filter(product =>
        product.category.includes(selectedCategory.toLowerCase())
      )
    }
  }, [products, searchTerm])

  useEffect(() => {
    fetchCategory()
  }, [])
  
  // Load data saat hook pertama kali digunakan
  useEffect(() => {
    fetchProducts()
  }, [selectedCategory])

  // Functions
  const handleSearchChange = (term) => {
    setSearchTerm(term)
  }

  const handleCategoryChange = (category) => {
    setSelectedCategory(category)
  }

  const clearSearch = () => {
    setSearchTerm('')
    setSelectedCategory('')
  }

    const hasActiveFilters = searchTerm || selectedCategory !== ''

  return {
    searchTerm,
    selectedCategory,
    products: filteredProducts,
    allProducts: products,
    categories,
    loading,
    categoriesLoading,
    error,
    hasActiveFilters,
    handleSearchChange,
    handleCategoryChange,
    clearSearch,
    refetch: fetchProducts
  }
}