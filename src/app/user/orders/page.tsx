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
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Eye, Search } from 'lucide-react'
import { orderAPI } from '@/lib/api'

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

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [searchMemberId, setSearchMemberId] = useState('')

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async (memberId?: number) => {
    try {
      setIsLoading(true)
      const response = await orderAPI.getOrders(memberId)
      if (response.code === 200) {
        setOrders(response.data as Order[])
      }
    } catch (error) {
      console.error('載入訂單失敗:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = () => {
    if (searchMemberId.trim()) {
      loadOrders(Number(searchMemberId.trim()))
    } else {
      loadOrders()
    }
  }

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order)
    setIsDialogOpen(true)
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">訂單管理</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>訂單列表</span>
            <div className="flex items-center space-x-2">
              <Input
                placeholder="輸入會員編號搜尋"
                value={searchMemberId}
                onChange={(e) => setSearchMemberId(e.target.value)}
                className="w-48"
              />
              <Button onClick={handleSearch} variant="outline" size="sm">
                <Search className="h-4 w-4" />
              </Button>
              <Button
                onClick={() => {
                  setSearchMemberId('')
                  loadOrders()
                }}
                variant="outline"
                size="sm"
              >
                重置
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-4 text-center">載入中...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>訂單編號</TableHead>
                  <TableHead>會員編號</TableHead>
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
                    <TableCell>{order.member_id}</TableCell>
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
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>訂單詳情 #{selectedOrder?.order_id}</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">會員編號</p>
                  <p className="text-lg">{selectedOrder.member_id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">建立時間</p>
                  <p className="text-lg">
                    {formatDate(selectedOrder.create_at)}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm font-medium">總金額</p>
                  <p className="text-lg">
                    NT$ {selectedOrder.total_amount.toLocaleString()}
                  </p>
                </div>
              </div>

              {selectedOrder.order_details &&
                selectedOrder.order_details.length > 0 && (
                  <div>
                    <h3 className="mb-2 text-lg font-medium">訂單明細</h3>
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
                            <TableCell>{detail.product_name}</TableCell>
                            <TableCell>{detail.quantity}</TableCell>
                            <TableCell>
                              NT$ {Number(detail.price).toLocaleString()}
                            </TableCell>
                            <TableCell className="text-right">
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
                )}

              <div className="flex justify-end">
                <Button onClick={() => setIsDialogOpen(false)}>關閉</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
