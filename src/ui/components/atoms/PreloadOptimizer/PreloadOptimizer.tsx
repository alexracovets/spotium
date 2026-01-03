'use client'

import { useEffect } from 'react'

/**
 * Компонент для оптимізації попереднього завантаження CSS
 * Видаляє preload теги для CSS файлів локалізованих layout, які не використовуються одразу
 * Це вирішує попередження про невикористані preload ресурси
 */
export function PreloadOptimizer() {
  useEffect(() => {
    // Невелика затримка для того, щоб Next.js встиг додати всі preload теги
    const timeoutId = setTimeout(() => {
      // Знаходимо всі preload теги для CSS
      const preloadLinks = document.querySelectorAll('link[rel="preload"][as="style"]')

      preloadLinks.forEach((link) => {
        const href = link.getAttribute('href') || ''
        
        // Перевіряємо чи це CSS файл для локалізованого layout
        // Next.js генерує URL з [locale] або %5Blocale%5D (URL-encoded)
        if (href.includes('[locale]') || href.includes('%5Blocale%5D')) {
          // Видаляємо preload тег, оскільки ці CSS файли не використовуються одразу
          // Вони завантажуються тільки при навігації до відповідної локалі
          link.remove()
        }
      })
    }, 100)

    return () => clearTimeout(timeoutId)
  }, [])

  return null
}

