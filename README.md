# Инклюзия+ — MVP (Vite + React)

Готовое SPA-приложение для платформы наставничества.

## Локальный запуск
```bash
npm i
npm run dev
```

## Продакшн-сборка
```bash
npm run build
npm run preview
```

## Переменные окружения (опционально, если нужен Supabase)
В Vercel/Netlify добавьте:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Для локального запуска через Vite можно использовать:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## Деплой на GitHub Pages (без сервера)
1. Создайте репозиторий и запушьте код.
2. Включите GitHub Pages: Settings → Pages → Source: GitHub Actions.
3. Ничего настраивать не нужно — workflow ниже всё сделает.

## Деплой на Vercel (рекомендация)
1. Импортируйте репозиторий в Vercel → **Add New Project**.
2. В *Environment Variables* добавьте ключи Supabase (если нужны).
3. Deploy — получите публичный URL.

---

### Стек
- React 18 + Vite
- Лёгкие UI-компоненты без внешних зависимостей
- PWA-манифест + SW
- Безопасные env‑переменные (без `process` в браузере)