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
    register,
    watch,
    reset,
    handleSubmit,
    formState: { errors } 
  } = useForm<z.infer<typeof companySchema>>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: '',
      address: '',
      phone: '',
      email: '',
      logo: '',
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
    })
  }

  const onSubmit = handleSubmit(async (body) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/company${company ? `/${company.id}` : ''}`, {
        method: company ? 'PATCH' : 'POST',
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

  return { register, watch, errors, fetchCompany, loading, onSubmit, company }
}