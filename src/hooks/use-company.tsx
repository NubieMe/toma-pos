"use client"

import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { companySchema } from '@/app/(session)/company/schema'
import React from 'react'
import { Company } from '@/types/company'
import { toast } from './use-toast'

export function useCompany() {
  const [company, setCompany] = React.useState<Company | null>(null)
  const [loading, setLoading] = React.useState(false)

  const {
    control,
    reset,
    handleSubmit,
    setValue,
    watch,
    formState,
  } = useForm<z.infer<typeof companySchema>>({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: '',
      address: '',
      phone: '',
      email: '',
      logo: '',
      category_auto: false,
      category_format: '',
      category_separator: null,
      user_auto: false,
      user_format: '',
      user_separator: null,
      item_auto: false,
      item_format: '',
      item_separator: null,
    },
  })

  const fetchCompany = async () => {
    const res = await fetch('/api/company')
    const data = (await res.json()).data

    setCompany(data)

    reset({
      name: data?.name || '',
      address: data?.address || '',
      phone: data?.phone || '',
      email: data?.email || '',
      logo: data?.logo || '',
      category_auto: data?.category_auto || false,
      category_format: data?.category_format || '',
      category_separator: data?.category_separator || null,
      user_auto: data?.user_auto || false,
      user_format: data?.user_format || '',
      user_separator: data?.user_separator || null,
      item_auto: data?.item_auto || false,
      item_format: data?.item_format || '',
      item_separator: data?.item_separator || null,
    })
  }

  const onSubmit = handleSubmit(async (body) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/company`, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' },
      })
      
      if (res.ok) {
        const { data, message } = await res.json()
        setCompany(data)

        toast({ description: message, variant: 'success' })
      }
    } catch (error) {
      toast({ description: (error as Error).message, variant: 'warning' })
    } finally {
      setLoading(false)
    }
  })

  return {
    fetchCompany, 
    loading, 
    onSubmit, 
    company,
    setValue,
    control,
    watch,
    formState,
  }
}