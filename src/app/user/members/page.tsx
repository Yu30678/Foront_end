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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, Edit, Trash2, Search } from 'lucide-react'
import { authAPI } from '@/lib/api'

interface Member {
  member_id: number
  name: string
  email: string
  phone: string
  address: string
  create_at: string
}

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingMember, setEditingMember] = useState<Member | null>(null)
  const [searchId, setSearchId] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    create_at: '',
  })

  useEffect(() => {
    loadMembers()
  }, [])

  const loadMembers = async (memberId?: string) => {
    try {
      setIsLoading(true)
      const response = await authAPI.getMembers(memberId)
      if (response.code === 200) {
        setMembers(
          Array.isArray(response.data) ? response.data : [response.data],
        )
      }
    } catch (error) {
      console.error('載入會員失敗:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const memberData = {
        ...formData,
        ...(editingMember && { member_id: editingMember.member_id }),
      }

      if (editingMember) {
        await authAPI.updateMember(memberData)
      } else {
        await authAPI.createMember(memberData)
      }

      setIsDialogOpen(false)
      resetForm()
      loadMembers()
    } catch (error) {
      console.error('操作失敗:', error)
    }
  }

  const handleEdit = (member: Member) => {
    setEditingMember(member)
    setFormData({
      name: member.name,
      email: member.email,
      phone: member.phone,
      address: member.address,
      password: '',
      create_at: member.create_at,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (memberId: number) => {
    if (confirm('確定要刪除此會員嗎？')) {
      try {
        await authAPI.deleteMember({ member_id: memberId })
        loadMembers()
      } catch (error) {
        console.error('刪除失敗:', error)
      }
    }
  }

  const handleSearch = () => {
    if (searchId.trim()) {
      loadMembers(searchId.trim())
    } else {
      loadMembers()
    }
  }

  const resetForm = () => {
    setEditingMember(null)
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      password: '',
      create_at: '',
    })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-TW')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">會員管理</h1>
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
              新增會員
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingMember ? '編輯會員' : '新增會員'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
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
                    setFormData({ ...formData, address: e.target.value })
                  }
                  required
                />
              </div>
              {!editingMember && (
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
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  取消
                </Button>
                <Button type="submit">{editingMember ? '更新' : '新增'}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>會員列表</span>
            <div className="flex items-center space-x-2">
              <Input
                placeholder="輸入會員編號搜尋"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                className="w-48"
              />
              <Button onClick={handleSearch} variant="outline" size="sm">
                <Search className="h-4 w-4" />
              </Button>
              <Button
                onClick={() => {
                  setSearchId('')
                  loadMembers()
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
                  <TableHead>編號</TableHead>
                  <TableHead>姓名</TableHead>
                  <TableHead>電子郵件</TableHead>
                  <TableHead>電話</TableHead>
                  <TableHead>地址</TableHead>
                  <TableHead>註冊日期</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((member) => (
                  <TableRow key={member.member_id}>
                    <TableCell>{member.member_id}</TableCell>
                    <TableCell className="font-medium">{member.name}</TableCell>
                    <TableCell>{member.email}</TableCell>
                    <TableCell>{member.phone}</TableCell>
                    <TableCell>{member.address}</TableCell>
                    <TableCell>{formatDate(member.create_at)}</TableCell>
                    <TableCell className="space-x-2 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(member)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(member.member_id)}
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
