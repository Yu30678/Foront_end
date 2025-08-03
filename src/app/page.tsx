'use client'

import { Button } from '@/components/ui/button'
import { getAPI } from '@/lib/api'

export default function Home() {
  return (
    <>
      <Button onClick={() => getAPI('/product')}>Click me</Button>
    </>
  )
}
