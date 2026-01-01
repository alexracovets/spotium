# LanguageSwitcher Component

Компонент для перемикання мови сайту.

## Використання

```tsx
import { LanguageSwitcher } from '@/ui/components/organisms'
import { getLocale, getAvailableLocales } from '@/utils/locale'

export default async function Page() {
  const currentLocale = await getLocale()
  const availableLocales = getAvailableLocales()

  return (
    <div>
      <LanguageSwitcher 
        currentLocale={currentLocale}
        availableLocales={availableLocales}
      />
    </div>
  )
}
```

## Як це працює

1. Компонент отримує поточну локаль та доступні локалі
2. При кліку на кнопку мови:
   - Відправляє POST запит до `/api/locale`
   - Встановлює cookie `payload-locale`
   - Оновлює сторінку для застосування нової локалі

## API Route

`/api/locale` - обробляє зміну локалі:
- `POST` - встановлює нову локаль в cookie
- `GET` - повертає поточну локаль

