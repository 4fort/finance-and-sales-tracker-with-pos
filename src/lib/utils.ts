import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { ZodObject, ZodOptional, ZodType, z } from 'zod'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

export type TypeToZod<T> = {
  [K in keyof T]-?: T[K] extends
    | Date
    | string
    | number
    | boolean
    | null
    | undefined
    ? undefined extends T[K]
      ? ZodOptional<ZodType<Exclude<T[K], undefined>>>
      : ZodType<T[K]>
    : ZodObject<TypeToZod<T[K]>>
}

export const createZodObject = <T>(obj: TypeToZod<T>) => {
  return z.object(obj)
}
