import Link from 'next/link'
import ProductPage from '@/app/products/page'
import Navbar from '@/components/layout/Navbar'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#171b24]">
      <Navbar/>

      <main className="container mx-auto px-4 py-8">
        <ProductPage />
      </main>
    </div>
  )
}