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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Plus, Edit, Trash2, Shield } from 'lucide-react'

interface User {
  userId: number
  account: string
  name: string
  password?: string
  level: number
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [formData, setFormData] = useState({
    account: '',
    password: '',
    name: '',
    level: 1,
  })

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      setIsLoading(true)
      // 使用真實的後端 API
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/users`,
      )
      const result = await response.json()
      if (result.status === 200) {
        setUsers(result.data)
      }
    } catch (error) {
      console.error('載入管理員失敗:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const userData = {
        ...formData,
        ...(editingUser && { userId: editingUser.userId }),
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/users`,
        {
          method: editingUser ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        },
      )

      const result = await response.json()
      if (result.status === 200 || result.status === 201) {
        setIsDialogOpen(false)
        resetForm()
        loadUsers()
        alert(editingUser ? '管理員更新成功' : '管理員新增成功')
      } else {
        alert(result.message || '操作失敗')
      }
    } catch (error) {
      console.error('操作失敗:', error)
      alert('操作失敗')
    }
  }

  const handleEdit = (user: User) => {
    setEditingUser(user)
    setFormData({
      account: user.account,
      password: '',
      name: user.name,
      level: user.level,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (userId: number) => {
    if (!confirm('確定要刪除此管理員嗎？')) return

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/users`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId: userId }),
        },
      )

      const result = await response.json()
      if (result.status === 200) {
        loadUsers()
        alert('管理員刪除成功')
      } else {
        alert(result.message || '刪除失敗')
      }
    } catch (error) {
      console.error('刪除失敗:', error)
      alert('刪除失敗')
    }
  }

  const resetForm = () => {
    setEditingUser(null)
    setFormData({
      account: '',
      password: '',
      name: '',
      level: 1,
    })
  }

  const getLevelBadge = (level: number) => {
    const levelConfig = {
      1: { variant: 'default' as const, text: '超級管理員' },
      2: { variant: 'secondary' as const, text: '一般管理員' },
      3: { variant: 'outline' as const, text: '操作員' },
    }

    const config = levelConfig[level as keyof typeof levelConfig] || {
      variant: 'outline' as const,
      text: `Level ${level}`,
    }

    return <Badge variant={config.variant}>{config.text}</Badge>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">管理員管理</h1>
        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open)
            if (!open) resetForm()
          }}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              新增管理員
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingUser ? '編輯管理員' : '新增管理員'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="account">帳號</Label>
                <Input
                  id="account"
                  value={formData.account}
                  onChange={(e) =>
                    setFormData({ ...formData, account: e.target.value })
                  }
                  required
                  disabled={!!editingUser}
                />
              </div>
              {!editingUser && (
                <div>
                  <Label htmlFor="password">密碼</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    required
                  />
                </div>
              )}
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
                <Label htmlFor="level">權限等級</Label>
                <Select
                  value={formData.level.toString()}
                  onValueChange={(value) =>
                    setFormData({ ...formData, level: parseInt(value) })
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="選擇權限等級" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">超級管理員</SelectItem>
                    <SelectItem value="2">一般管理員</SelectItem>
                    <SelectItem value="3">操作員</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  取消
                </Button>
                <Button type="submit">{editingUser ? '更新' : '新增'}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="mr-2 h-5 w-5" />
            管理員列表
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-4 text-center">載入中...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>編號</TableHead>
                  <TableHead>帳號</TableHead>
                  <TableHead>姓名</TableHead>
                  <TableHead>權限等級</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.userId}>
                    <TableCell>{user.userId}</TableCell>
                    <TableCell className="font-medium">
                      {user.account}
                    </TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{getLevelBadge(user.level)}</TableCell>
                    <TableCell className="space-x-2 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(user)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(user.userId)}
                        disabled={user.level === 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
