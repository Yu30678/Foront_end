'use client'

import { useState, useEffect } from 'react'
import { productAPI, cartAPI } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ShoppingCart, Plus, Minus } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import Image from 'next/image'

interface Product {
  product_id: number
  name: string
  price: string
  soh: number
  category_id: number
  is_active: boolean
  image_url?: string
}

const formatPrice = (price: string) => {
  return Number(price).toLocaleString('zh-TW')
}

export default function ProductPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [cartItems, setCartItems] = useState<{ [key: number]: number }>({})
  const { authState } = useAuth()

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      setIsLoading(true)
      const response = await productAPI.getProducts()
      if (response.status === 200) {
        setProducts(response.data.filter((product: Product) => product.is_active))
      }
    } catch (error) {
      console.error('載入商品失敗:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const addToCart = async (productId: number) => {
    if (!authState.isLoggedIn || authState.userType !== 'member') {
      alert('請先登入會員帳號')
      return
    }

    try {
      const quantity = cartItems[productId] || 1
      await cartAPI.addToCart({
        member_id: authState.user?.member_id || 0,
        product_id: productId,
        quantity: quantity,
      })
      alert('商品已加入購物車')
      setCartItems({ ...cartItems, [productId]: 1 })
    } catch (error) {
      console.error('加入購物車失敗:', error)
      alert('加入購物車失敗')
    }
  }

  const updateQuantity = (productId: number, increment: boolean) => {
    const currentQuantity = cartItems[productId] || 1
    const newQuantity = increment
      ? currentQuantity + 1
      : Math.max(1, currentQuantity - 1)
    setCartItems({ ...cartItems, [productId]: newQuantity })
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">載入中...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">商品列表</h1>
        <Badge variant="outline">{products.length} 個商品</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <Card key={product.product_id} className="overflow-hidden">
            <div className="aspect-square relative">
              {product.image_url ? (
                <Image
                  src={product.image_url}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">無圖片</span>
                </div>
              )}
            </div>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{product.name}</CardTitle>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-blue-600">
                  NT$ {formatPrice(product.price)}
                </span>
                <Badge variant="secondary">庫存: {product.soh}</Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">數量:</span>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(product.product_id, false)}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-8 text-center">
                      {cartItems[product.product_id] || 1}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(product.product_id, true)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <Button
                  className="w-full"
                  onClick={() => addToCart(product.product_id)}
                  disabled={product.soh === 0}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  {product.soh === 0 ? '缺貨' : '加入購物車'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">目前沒有可用的商品</p>
        </div>
      )}
    </div>
  )
}
