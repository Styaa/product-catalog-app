'use client'
import ProductList from "@/components/products/ProductList";
import ProductSearch from "@/components/products/ProductSearch";
import useProductFilter from '@/hooks/useProductFilter';

export default function ProductPage() {
   const {
        searchTerm,
        selectedCategory,
        products,
        categories,
        loading,
        categoriesLoading,
        error,
        hasActiveFilters,
        handleCategoryChange,
        handleSearchChange,
        clearSearch,
        refetch
    } = useProductFilter()
  
  return (
    <div className="min-h-screen">
        <div className="container mx-auto px-4 py-8">
        <ProductSearch
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
            categories={categories}
            categoriesLoading={categoriesLoading}
            placeholder="Search products..."
        />
        <ProductList 
          products={products}
          loading={loading}
          error={error}
          searchTerm={searchTerm}
          selectedCategory={selectedCategory}
          onRetry={refetch}
        />
        </div>
    </div>
  )
}