Это тестовое задание представляет собой веб-приложение, реализованное на **React + TypeScript**, с динамически подгружаемой таблицей записей, формой добавления новых записей в конец таблицы, формой добавления новых полей и валидацией данных.

## Стек технологий

- **React** + **TypeScript**
- **Vite** — сборщик
- **React Hook Form** + **Zod** — для работы с формой и валидацией
- **axios** — для работы с HTTP-запросами
- **json-server** — имитация REST API
- **@mui/material** — UI-библиотека (Material UI)
- **MobX** — для централизованного управления динамической структурой колонок и синхронизации состояния между компонентами

## Быстрый запуск одной командой

```bash
npm run start
```
Устанавливает зависимости, запускает одновременно vite и json-server

## Почему выбран MobX для управления состоянием

MobX выбран в качестве стейт-менеджера, так как в этом проекте требуется:

1. **Динамическая структура данных:** Пользователь может добавлять и удалять колонки, а структура таблицы и форм должна мгновенно меняться во всех компонентах. MobX обеспечивает автоматическую реактивность: любые изменения в store сразу отражаются в UI без ручного управления.
2. **Минимум шаблонного кода:** В проекте много операций с коллекциями (колонки, записи), и MobX позволяет реализовать бизнес-логику через методы класса без сложных редьюсеров или экшенов.
3. **Гибкая синхронизация с сервером:** MobX store легко синхронизируется с сервером (db.json), а также позволяет централизованно управлять логикой добавления/удаления колонок и их отображением.
4. **Простота поддержки:** В проекте несколько форм и таблиц, которые используют одни и те же данные. MobX позволяет избежать "протаскивания" пропсов и дублирования состояния между компонентами.
