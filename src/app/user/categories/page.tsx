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
import { Plus, Edit, Trash2 } from 'lucide-react'
import { categoryAPI } from '@/lib/api'

interface Category {
  category_id: number
  name: string
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [formData, setFormData] = useState({ name: '' })

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      setIsLoading(true)
      const response = await categoryAPI.getCategories()
      if (response.status === 200) {
        setCategories(response.data)
      }
    } catch (error) {
      console.error('載入類別失敗:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingCategory) {
        await categoryAPI.updateCategory({
          category_id: editingCategory.category_id,
          name: formData.name,
        })
      } else {
        await categoryAPI.createCategory({ name: formData.name })
      }
      setIsDialogOpen(false)
      setEditingCategory(null)
      setFormData({ name: '' })
      loadCategories()
    } catch (error) {
      console.error('操作失敗:', error)
    }
  }

  const handleEdit = (category: Category) => {
    setEditingCategory(category)
    setFormData({ name: category.name })
    setIsDialogOpen(true)
  }

  const handleDelete = async (categoryId: number) => {
    if (confirm('確定要刪除此類別嗎？')) {
      try {
        await categoryAPI.deleteCategory({ category_id: categoryId })
        loadCategories()
      } catch (error) {
        console.error('刪除失敗:', error)
      }
    }
  }

  const resetForm = () => {
    setEditingCategory(null)
    setFormData({ name: '' })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">類別管理</h1>
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
              新增類別
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingCategory ? '編輯類別' : '新增類別'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">類別名稱</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  取消
                </Button>
                <Button type="submit">
                  {editingCategory ? '更新' : '新增'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>商品類別列表</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-4">載入中...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>編號</TableHead>
                  <TableHead>名稱</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.category_id}>
                    <TableCell>{category.category_id}</TableCell>
                    <TableCell className="font-medium">
                      {category.name}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(category)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(category.category_id)}
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