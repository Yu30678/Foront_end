'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Plus, Minus, Trash2, ShoppingBag } from 'lucide-react'
import { cartAPI, orderAPI } from '@/lib/api'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface CartItem {
  member_id: number
  product_id: number
  quantity: number
  create_at: string
  product_name: string
  product_price: number
  image_url: string
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const { authState } = useAuth()
  const router = useRouter()

  const loadCart = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await cartAPI.getCart(authState.user?.member_id || 0)
      if (response.code === 200) {
        setCartItems((response.data as CartItem[]) || [])
      }
    } catch (error) {
      console.error('載入購物車失敗:', error)
    } finally {
      setIsLoading(false)
    }
  }, [authState.user?.member_id])

  useEffect(() => {
    if (authState.isLoggedIn && authState.userType === 'member') {
      loadCart()
    } else {
      setIsLoading(false)
    }
  }, [authState, loadCart])

  const updateQuantity = async (productId: number, quantity: number) => {
    if (quantity <= 0) return

    try {
      setIsUpdating(true)
      await cartAPI.updateCart({
        member_id: authState.user?.member_id || 0,
        product_id: productId,
        quantity: quantity,
      })
      loadCart()
    } catch (error) {
      console.error('更新購物車失敗:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  const removeItem = async (productId: number) => {
    if (!confirm('確定要移除此商品嗎？')) return

    try {
      setIsUpdating(true)
      await cartAPI.removeFromCart(authState.user?.member_id || 0, productId)
      loadCart()
    } catch (error) {
      console.error('移除商品失敗:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  const checkout = async () => {
    if (cartItems.length === 0) return

    try {
      setIsUpdating(true)
      const response = await orderAPI.createOrder({
        member_id: authState.user?.member_id || 0,
      })

      if (response.code === 200) {
        alert('結帳完成！訂單已建立成功，即將跳轉到訂單頁面')
        setTimeout(() => {
          router.push('/order')
        }, 1000)
      } else {
        alert(response.message || '結帳失敗，請稍後再試')
      }
    } catch (error) {
      console.error('結帳失敗:', error)
      alert('結帳失敗，請稍後再試')
    } finally {
      setIsUpdating(false)
    }
  }

  const totalAmount = cartItems.reduce(
    (total, item) => total + item.product_price * item.quantity,
    0,
  )

  if (!authState.isLoggedIn || authState.userType !== 'member') {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="py-12 text-center">
            <ShoppingBag className="mx-auto mb-4 h-12 w-12 text-gray-400" />
            <p className="text-gray-500">請先登入會員帳號查看購物車</p>
            <Button className="mt-4" onClick={() => router.push('/')}>
              回到首頁
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">載入中...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto space-y-6 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">購物車</h1>
        <Badge variant="outline">{cartItems.length} 個商品</Badge>
      </div>

      {cartItems.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <ShoppingBag className="mx-auto mb-4 h-12 w-12 text-gray-400" />
            <p className="mb-4 text-gray-500">您的購物車是空的</p>
            <Button onClick={() => router.push('/product')}>開始購物</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>購物車商品</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>商品</TableHead>
                      <TableHead>單價</TableHead>
                      <TableHead>數量</TableHead>
                      <TableHead>小計</TableHead>
                      <TableHead className="text-right">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cartItems.map((item) => (
                      <TableRow key={item.product_id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            {item.image_url ? (
                              <div className="relative h-12 w-12">
                                <Image
                                  src={item.image_url}
                                  alt={item.product_name}
                                  fill
                                  className="rounded object-cover"
                                />
                              </div>
                            ) : (
                              <div className="flex h-12 w-12 items-center justify-center rounded bg-gray-200 text-xs">
                                無圖
                              </div>
                            )}
                            <span className="font-medium">
                              {item.product_name}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          NT$ {item.product_price.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                updateQuantity(
                                  item.product_id,
                                  item.quantity - 1,
                                )
                              }
                              disabled={isUpdating || item.quantity <= 1}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                updateQuantity(
                                  item.product_id,
                                  item.quantity + 1,
                                )
                              }
                              disabled={isUpdating}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>
                          NT${' '}
                          {(
                            item.product_price * item.quantity
                          ).toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeItem(item.product_id)}
                            disabled={isUpdating}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>訂單摘要</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>商品總計:</span>
                  <span>NT$ {totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>運費:</span>
                  <span>免費</span>
                </div>
                <hr />
                <div className="flex justify-between text-lg font-bold">
                  <span>總計:</span>
                  <span>NT$ {totalAmount.toLocaleString()}</span>
                </div>
                <Button
                  className="w-full"
                  onClick={checkout}
                  disabled={isUpdating || cartItems.length === 0}
                >
                  {isUpdating ? '處理中...' : '結帳'}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => router.push('/product')}
                >
                  繼續購物
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
