'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { User, Edit, Trash2, UserCheck, Key } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { memberAPI } from '@/lib/api'

interface Member {
  member_id: number
  name: string
  email: string
  phone: string
  address: string
  create_at: string
}

export default function MemberPage() {
  const [memberData, setMemberData] = useState<Member | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  })
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const { authState, logout } = useAuth()
  const router = useRouter()

  const loadMemberData = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await memberAPI.getMemberData(
        authState.user?.member_id || 0,
      )

      if (response.code === 200) {
        const memberData = response.data as Member
        setMemberData(memberData)
        setFormData({
          name: memberData.name,
          email: memberData.email,
          phone: memberData.phone,
          address: memberData.address,
        })
      }
    } catch (error) {
      console.error('載入會員資料失敗:', error)
    } finally {
      setIsLoading(false)
    }
  }, [authState.user?.member_id])

  useEffect(() => {
    if (authState.isLoggedIn && authState.userType === 'member') {
      loadMemberData()
    } else {
      setIsLoading(false)
    }
  }, [authState, loadMemberData])

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setIsUpdating(true)
      const response = await memberAPI.updateMemberData({
        member_id: memberData?.member_id,
        ...formData,
      })

      if (response.code === 200) {
        setMemberData(response.data as Member)
        setIsEditDialogOpen(false)
        alert('會員資料更新成功')
      } else {
        alert(response.message || '更新失敗')
      }
    } catch (error) {
      console.error('更新會員資料失敗:', error)
      alert('更新失敗')
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('確定要刪除會員帳號嗎？此操作無法復原！')) return

    try {
      const response = await memberAPI.deleteMemberAccount({
        member_id: memberData?.member_id,
      })

      if (response.code === 200) {
        alert('會員帳號已刪除')
        logout()
        router.push('/')
      } else {
        alert(response.message || '刪除失敗')
      }
    } catch (error) {
      console.error('刪除會員帳號失敗:', error)
      alert('刪除失敗')
    }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('新密碼與確認密碼不符')
      return
    }

    if (passwordData.newPassword.length < 4) {
      alert('新密碼至少需要4個字元')
      return
    }

    try {
      setIsUpdating(true)
      const response = await memberAPI.changePassword({
        member_id: memberData?.member_id || 0,
        old_password: passwordData.oldPassword,
        new_password: passwordData.newPassword,
      })

      if (response.code === 200) {
        alert('密碼修改成功')
        setIsPasswordDialogOpen(false)
        setPasswordData({
          oldPassword: '',
          newPassword: '',
          confirmPassword: '',
        })
      } else {
        alert(response.message || '密碼修改失敗')
      }
    } catch (error) {
      console.error('修改密碼失敗:', error)
      alert('修改密碼失敗')
    } finally {
      setIsUpdating(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
  }

  if (!authState.isLoggedIn || authState.userType !== 'member') {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="py-12 text-center">
            <User className="mx-auto mb-4 h-12 w-12 text-gray-400" />
            <p className="text-gray-500">請先登入會員帳號</p>
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
        <h1 className="text-3xl font-bold">會員中心</h1>
        <Badge variant="outline">
          <UserCheck className="mr-2 h-4 w-4" />
          已驗證會員
        </Badge>
      </div>

      {memberData && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>個人資料</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      姓名
                    </Label>
                    <p className="text-lg">{memberData.name}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      會員編號
                    </Label>
                    <p className="text-lg">#{memberData.member_id}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      電子郵件
                    </Label>
                    <p className="text-lg">{memberData.email}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      電話
                    </Label>
                    <p className="text-lg">{memberData.phone}</p>
                  </div>
                  <div className="col-span-2">
                    <Label className="text-sm font-medium text-gray-600">
                      地址
                    </Label>
                    <p className="text-lg">{memberData.address}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      註冊日期
                    </Label>
                    <p className="text-lg">
                      {formatDate(memberData.create_at)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>帳號管理</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Dialog
                  open={isEditDialogOpen}
                  onOpenChange={setIsEditDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button className="w-full" variant="outline">
                      <Edit className="mr-2 h-4 w-4" />
                      編輯資料
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>編輯會員資料</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleUpdate} className="space-y-4">
                      <div>
                        <Label htmlFor="name">姓名</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">電子郵件</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">電話</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData({ ...formData, phone: e.target.value })
                          }
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="address">地址</Label>
                        <Input
                          id="address"
                          value={formData.address}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              address: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsEditDialogOpen(false)}
                        >
                          取消
                        </Button>
                        <Button type="submit" disabled={isUpdating}>
                          {isUpdating ? '更新中...' : '更新'}
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>

                <Dialog
                  open={isPasswordDialogOpen}
                  onOpenChange={setIsPasswordDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button className="w-full" variant="outline">
                      <Key className="mr-2 h-4 w-4" />
                      修改密碼
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>修改密碼</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handlePasswordChange} className="space-y-4">
                      <div>
                        <Label htmlFor="oldPassword">舊密碼</Label>
                        <Input
                          id="oldPassword"
                          type="password"
                          value={passwordData.oldPassword}
                          onChange={(e) =>
                            setPasswordData({
                              ...passwordData,
                              oldPassword: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="newPassword">新密碼</Label>
                        <Input
                          id="newPassword"
                          type="password"
                          value={passwordData.newPassword}
                          onChange={(e) =>
                            setPasswordData({
                              ...passwordData,
                              newPassword: e.target.value,
                            })
                          }
                          required
                          minLength={4}
                        />
                      </div>
                      <div>
                        <Label htmlFor="confirmPassword">確認新密碼</Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={passwordData.confirmPassword}
                          onChange={(e) =>
                            setPasswordData({
                              ...passwordData,
                              confirmPassword: e.target.value,
                            })
                          }
                          required
                          minLength={4}
                        />
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setIsPasswordDialogOpen(false)
                            setPasswordData({
                              oldPassword: '',
                              newPassword: '',
                              confirmPassword: '',
                            })
                          }}
                        >
                          取消
                        </Button>
                        <Button type="submit" disabled={isUpdating}>
                          {isUpdating ? '修改中...' : '修改密碼'}
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>

                <Button
                  className="w-full"
                  variant="destructive"
                  onClick={handleDelete}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  刪除帳號
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>快速連結</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => router.push('/order')}
                >
                  查看我的訂單
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => router.push('/cart')}
                >
                  購物車
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
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
