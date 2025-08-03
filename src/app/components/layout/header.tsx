'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '@/hooks/useAuth'
import { LoginForm, RegisterForm, type AdminLoginForm } from '@/types/auth'

const loginSchema = z.object({
  email: z.string().email('請輸入有效的電子郵件地址'),
  password: z.string().min(4, '密碼至少需要4個字元'),
})

const registerSchema = z.object({
  name: z.string().min(2, '姓名至少需要2個字元'),
  email: z.string().email('請輸入有效的電子郵件地址'),
  password: z.string().min(4, '密碼至少需要4個字元'),
  phone: z.string().regex(/^09\d{8}$/, '請輸入有效的手機號碼'),
  address: z.string().min(5, '地址至少需要5個字元'),
})

const adminLoginSchema = z.object({
  account: z.string().min(2, '帳號至少需要2個字元'),
  password: z.string().min(3, '密碼至少需要3個字元'),
})

type LoginType = 'member' | 'admin'
type FormType = 'login' | 'register'

const getNavItems = (userType: 'admin' | 'member' | null) => {
  const baseItems = [
    { label: '首頁', href: '/' },
    { label: '產品', href: '/product' },
  ]

  if (userType === 'admin') {
    return [
      ...baseItems,
      { label: '管理後台', href: '/user' },
      { label: '類別管理', href: '/user/categories' },
      { label: '商品管理', href: '/user/products' },
      { label: '會員管理', href: '/user/members' },
      { label: '訂單管理', href: '/user/orders' },
      { label: '管理員管理', href: '/user/users' },
    ]
  }

  return [
    ...baseItems,
    { label: '購物車', href: '/cart' },
    { label: '會員', href: '/member' },
    { label: '訂單', href: '/order' },
  ]
}

const MemberLoginForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const { login } = useAuth()

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (data: LoginForm) => {
    console.log('MemberLoginForm: 開始提交登入表單', data)
    setIsLoading(true)
    setMessage('')

    try {
      const result = await login(data)
      console.log('MemberLoginForm: 登入結果:', result)

      if (result.success) {
        setMessage(result.message)
        setTimeout(() => {
          onSuccess()
        }, 300)
      } else {
        setMessage(result.message)
      }
    } catch (error) {
      console.error('會員登入錯誤:', error)
      setMessage('登入過程發生錯誤')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>電子郵件</FormLabel>
              <FormControl>
                <Input type="email" placeholder="請輸入電子郵件" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>密碼</FormLabel>
              <FormControl>
                <Input type="password" placeholder="請輸入密碼" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {message && (
          <p
            className={`text-sm ${message.includes('成功') ? 'text-green-600' : 'text-red-600'}`}
          >
            {message}
          </p>
        )}
        <Button type="submit" disabled={isLoading}>
          {isLoading ? '登入中...' : '會員登入'}
        </Button>
      </form>
    </Form>
  )
}

const AdminLoginFormComponent = ({ onSuccess }: { onSuccess: () => void }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const { adminLogin } = useAuth()

  const form = useForm<AdminLoginForm>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      account: '',
      password: '',
    },
  })

  const onSubmit = async (data: AdminLoginForm) => {
    console.log('AdminLoginForm: 開始提交管理員登入表單', data)
    setIsLoading(true)
    setMessage('')

    try {
      const result = await adminLogin(data)
      console.log('AdminLoginForm: 登入結果:', result)

      if (result.success) {
        setMessage(result.message)
        setTimeout(() => {
          onSuccess()
        }, 300)
      } else {
        setMessage(result.message)
      }
    } catch (error) {
      console.error('管理員登入錯誤:', error)
      setMessage('登入過程發生錯誤')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="account"
          render={({ field }) => (
            <FormItem>
              <FormLabel>帳號</FormLabel>
              <FormControl>
                <Input type="text" placeholder="請輸入帳號" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>密碼</FormLabel>
              <FormControl>
                <Input type="password" placeholder="請輸入密碼" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {message && (
          <p
            className={`text-sm ${message.includes('成功') ? 'text-green-600' : 'text-red-600'}`}
          >
            {message}
          </p>
        )}
        <Button type="submit" disabled={isLoading}>
          {isLoading ? '登入中...' : '管理員登入'}
        </Button>
      </form>
    </Form>
  )
}

const RegisterFormComponent = ({ onSuccess }: { onSuccess: () => void }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const { register } = useAuth()

  const form = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      phone: '',
      address: '',
    },
  })

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true)
    setMessage('')

    try {
      const result = await register(data)

      if (result.success) {
        setMessage(result.message)
        setTimeout(() => onSuccess(), 2000)
      } else {
        setMessage(result.message)
      }
    } catch (error) {
      console.error('註冊錯誤:', error)
      setMessage('註冊過程發生錯誤')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>姓名</FormLabel>
              <FormControl>
                <Input placeholder="請輸入姓名" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>電子郵件</FormLabel>
              <FormControl>
                <Input type="email" placeholder="請輸入電子郵件" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>密碼</FormLabel>
              <FormControl>
                <Input type="password" placeholder="請輸入密碼" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>手機號碼</FormLabel>
              <FormControl>
                <Input placeholder="請輸入手機號碼" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>地址</FormLabel>
              <FormControl>
                <Input placeholder="請輸入地址" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {message && (
          <p
            className={`text-sm ${message.includes('成功') ? 'text-green-600' : 'text-red-600'}`}
          >
            {message}
          </p>
        )}
        <Button type="submit" disabled={isLoading}>
          {isLoading ? '註冊中...' : '註冊'}
        </Button>
      </form>
    </Form>
  )
}

export const Header = () => {
  const { authState, logout, isInitialized } = useAuth()
  const [currentForm, setCurrentForm] = useState<FormType>('login')
  const [loginType, setLoginType] = useState<LoginType>('member')
  const [isOpen, setIsOpen] = useState(false)
  const [shouldClosePopover, setShouldClosePopover] = useState(false)

  // 調試：監控authState變化
  useEffect(() => {
    console.log('Header: authState已更新:', authState)
    console.log('Header: isLoggedIn:', authState.isLoggedIn)
    console.log('Header: user:', authState.user)
    console.log('Header: userType:', authState.userType)
    console.log('Header: isInitialized:', isInitialized)

    // 如果用戶已登入且應該關閉彈窗，則關閉彈窗
    if (authState.isLoggedIn && shouldClosePopover) {
      console.log('Header: 登入狀態已更新，關閉彈窗')
      setIsOpen(false)
      setShouldClosePopover(false)
    }
  }, [authState, isInitialized, shouldClosePopover])

  const handleFormSuccess = () => {
    console.log('Header: handleFormSuccess被調用')
    setCurrentForm('login')
    setShouldClosePopover(true)
  }

  const handleLogout = () => {
    console.log('Header: handleLogout被調用')
    logout()
  }

  // 等待初始化完成
  if (!isInitialized) {
    return (
      <header className="flex items-center justify-between p-4">
        <NavigationMenu>
          <NavigationMenuList>
            {getNavItems(null).map((item) => (
              <NavigationMenuItem key={item.label}>
                <NavigationMenuLink asChild>
                  <Link href={item.href}>{item.label}</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
        <div className="flex items-center gap-2">
          <Button disabled>載入中...</Button>
        </div>
      </header>
    )
  }

  const navItems = getNavItems(authState.userType)

  return (
    <header className="flex items-center justify-between p-4">
      <NavigationMenu>
        <NavigationMenuList>
          {navItems.map((item) => (
            <NavigationMenuItem key={item.label}>
              <NavigationMenuLink asChild>
                <Link href={item.href}>{item.label}</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>

      <div className="flex items-center gap-2">
        {authState.isLoggedIn ? (
          <div className="flex items-center gap-2">
            <span className="text-sm">
              歡迎，{authState.user?.name} (
              {authState.userType === 'member' ? '會員' : '管理員'})
            </span>
            <Button variant="outline" onClick={handleLogout}>
              登出
            </Button>
          </div>
        ) : (
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <Button>登入 / 註冊</Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="flex flex-col gap-4">
                <div className="flex gap-2">
                  <Button
                    variant={currentForm === 'login' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setCurrentForm('login')}
                  >
                    登入
                  </Button>
                  <Button
                    variant={currentForm === 'register' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setCurrentForm('register')}
                  >
                    註冊
                  </Button>
                </div>

                {currentForm === 'login' && (
                  <>
                    <div className="flex gap-2">
                      <Button
                        variant={loginType === 'member' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setLoginType('member')}
                      >
                        會員登入
                      </Button>
                      <Button
                        variant={loginType === 'admin' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setLoginType('admin')}
                      >
                        管理員登入
                      </Button>
                    </div>
                    {loginType === 'member' ? (
                      <MemberLoginForm onSuccess={handleFormSuccess} />
                    ) : (
                      <AdminLoginFormComponent onSuccess={handleFormSuccess} />
                    )}
                  </>
                )}

                {currentForm === 'register' && (
                  <RegisterFormComponent onSuccess={handleFormSuccess} />
                )}
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>
    </header>
  )
}
