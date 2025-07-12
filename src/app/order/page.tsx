'use client'

import { useState, useEffect } from 'react'
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Eye, ShoppingBag } from 'lucide-react'
import { orderAPI } from '@/lib/api'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'

interface OrderDetail {
  product_id: number
  product_name: string
  quantity: number
  price: string
}

interface Order {
  order_id: number
  member_id: number
  total_amount: number
  create_at: string
  order_details?: OrderDetail[]
}

export default function OrderPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { authState } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (authState.isLoggedIn && authState.userType === 'member') {
      loadOrders()
    } else {
      setIsLoading(false)
    }
  }, [authState])

  const loadOrders = async () => {
    try {
      setIsLoading(true)
      const response = await orderAPI.getOrders(authState.user?.member_id)
      if (response.status === 200) {
        setOrders(response.data || [])
      }
    } catch (error) {
      console.error('載入訂單失敗:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }


  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order)
    setIsDialogOpen(true)
  }

  if (!authState.isLoggedIn || authState.userType !== 'member') {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="text-center py-12">
            <ShoppingBag className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500">請先登入會員帳號查看訂單</p>
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
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">我的訂單</h1>
        <Badge variant="outline">{orders.length} 筆訂單</Badge>
      </div>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <ShoppingBag className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500 mb-4">您還沒有任何訂單</p>
            <Button onClick={() => router.push('/product')}>
              開始購物
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>訂單列表</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>訂單編號</TableHead>
                  <TableHead>總金額</TableHead>
                  <TableHead>建立時間</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.order_id}>
                    <TableCell className="font-medium">
                      #{order.order_id}
                    </TableCell>
                    <TableCell>
                      NT$ {order.total_amount.toLocaleString()}
                    </TableCell>
                    <TableCell>{formatDate(order.create_at)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetails(order)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>訂單詳情 #{selectedOrder?.order_id}</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">訂單編號</p>
                  <p className="text-lg">#{selectedOrder.order_id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">建立時間</p>
                  <p className="text-lg">{formatDate(selectedOrder.create_at)}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm font-medium text-gray-600">總金額</p>
                  <p className="text-lg font-bold text-blue-600">
                    NT$ {selectedOrder.total_amount.toLocaleString()}
                  </p>
                </div>
              </div>

              {selectedOrder.order_details &&
                selectedOrder.order_details.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium mb-3">訂單明細</h3>
                    <div className="border rounded-lg overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>商品編號</TableHead>
                            <TableHead>商品名稱</TableHead>
                            <TableHead>數量</TableHead>
                            <TableHead>單價</TableHead>
                            <TableHead className="text-right">小計</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedOrder.order_details.map((detail, index) => (
                            <TableRow key={index}>
                              <TableCell>{detail.product_id}</TableCell>
                              <TableCell className="font-medium">
                                {detail.product_name}
                              </TableCell>
                              <TableCell>{detail.quantity}</TableCell>
                              <TableCell>
                                NT$ {Number(detail.price).toLocaleString()}
                              </TableCell>
                              <TableCell className="text-right font-medium">
                                NT${' '}
                                {(
                                  Number(detail.price) * detail.quantity
                                ).toLocaleString()}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                )}

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  關閉
                </Button>
                <Button onClick={() => router.push('/product')}>
                  繼續購物
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}