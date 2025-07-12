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
import { Plus, Edit, Trash2, Upload, X } from 'lucide-react'
import { productAPI, categoryAPI, uploadAPI } from '@/lib/api'
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

interface Category {
  category_id: number
  name: string
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    soh: 0,
    category_id: '',
    is_active: true,
    image_url: '',
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>('')
  const [isUploading, setIsUploading] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setIsLoading(true)
      const [productsResponse, categoriesResponse] = await Promise.all([
        productAPI.getAdminProducts(),
        categoryAPI.getCategories(),
      ])
      
      if (productsResponse.status === 200) {
        setProducts(productsResponse.data)
      }
      if (categoriesResponse.status === 200) {
        setCategories(categoriesResponse.data)
      }
    } catch (error) {
      console.error('載入資料失敗:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  const handleUploadImage = async () => {
    if (!selectedFile) return

    try {
      setIsUploading(true)
      const response = await uploadAPI.uploadImage(selectedFile)
      if (response.status === 200) {
        setFormData({ ...formData, image_url: response.data.fullUrl })
        setSelectedFile(null)
        if (previewUrl) {
          URL.revokeObjectURL(previewUrl)
        }
        setPreviewUrl('')
      }
    } catch (error) {
      console.error('圖片上傳失敗:', error)
    } finally {
      setIsUploading(false)
    }
  }

  const removeImage = () => {
    setFormData({ ...formData, image_url: '' })
    setSelectedFile(null)
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }
    setPreviewUrl('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const productData = {
        ...formData,
        soh: Number(formData.soh),
        category_id: Number(formData.category_id),
        ...(editingProduct && { product_id: editingProduct.product_id }),
      }

      if (editingProduct) {
        await productAPI.updateProduct(productData)
      } else {
        await productAPI.createProduct(productData)
      }
      
      setIsDialogOpen(false)
      resetForm()
      loadData()
    } catch (error) {
      console.error('操作失敗:', error)
    }
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      price: product.price,
      soh: product.soh,
      category_id: product.category_id.toString(),
      is_active: product.is_active,
      image_url: product.image_url || '',
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (productId: number) => {
    if (confirm('確定要刪除此商品嗎？')) {
      try {
        await productAPI.deleteProduct({ product_id: productId })
        loadData()
      } catch (error) {
        console.error('刪除失敗:', error)
      }
    }
  }

  const resetForm = () => {
    setEditingProduct(null)
    setFormData({
      name: '',
      price: '',
      soh: 0,
      category_id: '',
      is_active: true,
      image_url: '',
    })
    setSelectedFile(null)
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }
    setPreviewUrl('')
  }

  const getCategoryName = (categoryId: number) => {
    const category = categories.find((cat) => cat.category_id === categoryId)
    return category?.name || '未知類別'
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">商品管理</h1>
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
              新增商品
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? '編輯商品' : '新增商品'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">商品名稱</Label>
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
                <Label htmlFor="price">價格</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="soh">庫存數量</Label>
                <Input
                  id="soh"
                  type="number"
                  value={formData.soh}
                  onChange={(e) =>
                    setFormData({ ...formData, soh: Number(e.target.value) })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="category">商品類別</Label>
                <Select
                  value={formData.category_id}
                  onValueChange={(value) =>
                    setFormData({ ...formData, category_id: value })
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="選擇類別" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem
                        key={category.category_id}
                        value={category.category_id.toString()}
                      >
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="is_active">狀態</Label>
                <Select
                  value={formData.is_active.toString()}
                  onValueChange={(value) =>
                    setFormData({ ...formData, is_active: value === 'true' })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">上架</SelectItem>
                    <SelectItem value="false">下架</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>商品圖片</Label>
                <div className="space-y-2">
                  {formData.image_url ? (
                    <div className="relative">
                      <div className="w-32 h-32 relative border rounded">
                        <Image
                          src={formData.image_url}
                          alt="商品圖片"
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute -top-2 -right-2"
                        onClick={removeImage}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        disabled={isUploading}
                      />
                      {selectedFile && (
                        <div className="space-y-2">
                          <div className="w-32 h-32 relative border rounded">
                            <Image
                              src={previewUrl}
                              alt="預覽"
                              fill
                              className="object-cover rounded"
                            />
                          </div>
                          <Button
                            type="button"
                            onClick={handleUploadImage}
                            disabled={isUploading}
                            size="sm"
                          >
                            <Upload className="mr-2 h-4 w-4" />
                            {isUploading ? '上傳中...' : '上傳圖片'}
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
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
                  {editingProduct ? '更新' : '新增'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>商品列表</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-4">載入中...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>編號</TableHead>
                  <TableHead>圖片</TableHead>
                  <TableHead>商品名稱</TableHead>
                  <TableHead>價格</TableHead>
                  <TableHead>庫存</TableHead>
                  <TableHead>類別</TableHead>
                  <TableHead>狀態</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.product_id}>
                    <TableCell>{product.product_id}</TableCell>
                    <TableCell>
                      {product.image_url ? (
                        <div className="w-12 h-12 relative">
                          <Image
                            src={product.image_url}
                            alt={product.name}
                            fill
                            className="object-cover rounded"
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-xs">
                          無圖片
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">
                      {product.name}
                    </TableCell>
                    <TableCell>NT$ {Number(product.price).toLocaleString()}</TableCell>
                    <TableCell>{product.soh}</TableCell>
                    <TableCell>{getCategoryName(product.category_id)}</TableCell>
                    <TableCell>
                      <Badge
                        variant={product.is_active ? 'default' : 'secondary'}
                      >
                        {product.is_active ? '上架' : '下架'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(product)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(product.product_id)}
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