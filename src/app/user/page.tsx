'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Users, Package, ShoppingCart, TrendingUp, Plus } from 'lucide-react'
import { authAPI, productAPI, orderAPI, categoryAPI } from '@/lib/api'
import Link from 'next/link'

interface DashboardStats {
  totalMembers: number
  totalProducts: number
  totalOrders: number
  totalCategories: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalMembers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalCategories: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setIsLoading(true)
      const [membersRes, productsRes, ordersRes, categoriesRes] =
        await Promise.all([
          authAPI.getMembers(),
          productAPI.getAdminProducts(),
          orderAPI.getOrders(),
          categoryAPI.getCategories(),
        ])

      setStats({
        totalMembers: Array.isArray(membersRes.data)
          ? membersRes.data.length
          : 0,
        totalProducts: Array.isArray(productsRes.data)
          ? productsRes.data.length
          : 0,
        totalOrders: Array.isArray(ordersRes.data) ? ordersRes.data.length : 0,
        totalCategories: Array.isArray(categoriesRes.data)
          ? categoriesRes.data.length
          : 0,
      })
    } catch (error) {
      console.error('載入儀表板資料失敗:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const dashboardCards = [
    {
      title: '總會員數',
      value: stats.totalMembers.toString(),
      icon: Users,
      href: '/user/members',
    },
    {
      title: '商品總數',
      value: stats.totalProducts.toString(),
      icon: Package,
      href: '/user/products',
    },
    {
      title: '總訂單數',
      value: stats.totalOrders.toString(),
      icon: ShoppingCart,
      href: '/user/orders',
    },
    {
      title: '商品類別',
      value: stats.totalCategories.toString(),
      icon: TrendingUp,
      href: '/user/categories',
    },
  ]

  const quickActions = [
    { title: '新增商品', href: '/user/products', icon: Package },
    { title: '管理類別', href: '/user/categories', icon: Plus },
    { title: '查看訂單', href: '/user/orders', icon: ShoppingCart },
    { title: '會員管理', href: '/user/members', icon: Users },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">管理員儀表板</h1>
        <Badge variant="secondary">管理員模式</Badge>
      </div>

      {isLoading ? (
        <div className="py-4 text-center">載入中...</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {dashboardCards.map((card) => {
            const IconComponent = card.icon
            return (
              <Link key={card.title} href={card.href}>
                <Card className="hover:bg-accent transition-colors">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {card.title}
                    </CardTitle>
                    <IconComponent className="text-muted-foreground h-4 w-4" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{card.value}</div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>快速操作</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {quickActions.map((action) => {
              const IconComponent = action.icon
              return (
                <Link key={action.title} href={action.href}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    size="sm"
                  >
                    <IconComponent className="mr-2 h-4 w-4" />
                    {action.title}
                  </Button>
                </Link>
              )
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>最近活動</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2 text-sm">
              <Badge variant="outline">新訂單</Badge>
              <span>會員 #1247 下單購買 iPhone 15</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <Badge variant="outline">庫存</Badge>
              <span>MacBook Pro 庫存不足</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <Badge variant="outline">會員</Badge>
              <span>新會員註冊：張小明</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
