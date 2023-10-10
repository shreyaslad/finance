import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { PlusIcon } from 'lucide-react'
import Image from 'next/image'

export default function Home() {
  return (
    <div className='grid grid-cols-8 gap-8 m-8'>
      <div className='flex flex-row justify-between col-span-full'>
        <h2 className="text-3xl font-semibold tracking-tight transition-colors scroll-m-20 first:mt-0">
          Dashboard
        </h2>

        <div className='flex flex-row justify-between gap-2'>
          <Button variant={'outline'}>Export CSV</Button>
          <Button><PlusIcon className='w-6 h-6 pr-2' /> Add</Button>
        </div>
      </div>
    </div>
  )
}
