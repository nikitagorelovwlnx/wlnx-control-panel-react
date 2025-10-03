# ✅ WLNX Control Panel React - Финальная Версия

## 🎯 Полностью переделано согласно оригиналу!

Приложение теперь **полностью соответствует** оригинальной vanilla TypeScript версии.

---

## 📊 Структура Dashboard

### **Три панели рядом** (не sliding panels!):

```
┌─────────────┬─────────────┬──────────────────────┐
│   Users     │  Sessions   │      Details         │
│   Panel     │   Panel     │      Panel           │
│             │             │  ┌─────────────────┐ │
│  - User 1   │  - Session1 │  │ Summary         │ │
│  - User 2   │  - Session2 │  │ Transcript      │ │
│  - User 3   │  - Session3 │  │ Chat GPT        │ │
│             │             │  │ Wellness        │ │
│             │             │  └─────────────────┘ │
└─────────────┴─────────────┴──────────────────────┘
     ↕              ↕
  Resizer       Resizer
```

### **Функционал панелей**:

1. **Users Panel** (слева):
   - Список всех пользователей
   - Количество сессий
   - Последняя активность
   - Кнопка "Delete All" при hover
   - Кнопка collapse (←)

2. **Sessions Panel** (центр):
   - Открывается при клике на пользователя
   - Список сессий выбранного пользователя
   - Дата создания
   - Превью summary
   - Wellness данные (stress, sleep)
   - Кнопка delete для каждой сессии
   - Кнопки collapse (←) и close (✕)

3. **Details Panel** (справа):
   - **4 таба внутри**:
     - **Summary** - краткое содержание
     - **Transcript** - полная транскрипция
     - **Chat GPT** - лог разговора с ботом
     - **Wellness** - данные о здоровье
   - Индикатор Live (обновление каждую 1 секунду!)
   - Кнопка close (✕)

### **Ресайзеры**:
- Между Users и Sessions
- Между Sessions и Details
- Перетаскивание мышью для изменения ширины
- Визуальная индикация при hover

---

## 🎨 Prompts Configuration

### **Структура табов**:

```
┌─────────────────────────────────────────────────┐
│ Coach | Stage 1 | Stage 2 | Stage 3 | ...      │
├─────────────────────────────────────────────────┤
│                                                  │
│  [Активный таб с контентом]                     │
│                                                  │
└─────────────────────────────────────────────────┘
```

### **Coach Tab** (первый таб):
- Список всех коучей
- Кнопка "Add Coach"
- Для каждого коуча:
  - Имя, описание
  - Статус (Active/Inactive)
  - Дата создания/обновления
  - Prompt content (свернутый)
  - Кнопки: Edit, Toggle Active, Delete
- Форма создания/редактирования:
  - Поля: Name, Description, Coach Prompt Content
  - Кнопки: Save, Cancel

### **Stage Tabs** (остальные табы):
- Для каждого stage:
  - Заголовок с описанием
  - Кнопки "Save Stage" и "Restore Defaults"
  - Список промптов:
    - Номер промпта (#1, #2)
    - Описание (Question Prompt, Extraction Prompt)
    - Textarea для редактирования
    - Моноширинный шрифт

### **Сохранение состояния**:
- Активный таб сохраняется в localStorage
- При перезагрузке страницы восстанавливается последний активный таб

---

## 🔧 API Endpoints (исправлены!)

### **Правильные эндпоинты**:

```typescript
// Users
GET /api/users                              // Список пользователей

// Sessions/Interviews
GET /api/interviews?email={email}           // Сессии пользователя
DELETE /api/interviews/{id}                 // Удалить сессию
  Body: { email: "user@email.com" }

// Prompts
GET /api/prompts                            // Конфигурация промптов

// Coaches
GET /api/coaches                            // Список коучей
POST /api/coaches                           // Создать коуча
PUT /api/coaches/{id}                       // Обновить коуча
DELETE /api/coaches/{id}                    // Удалить коуча

// Health
GET /api/health                             // Статус API сервера
GET /health (port 3002)                     // Статус бота
```

### **Маппинг данных**:
- API возвращает `response.results` - правильно обрабатывается
- `user_id` маппится в `email`
- Все поля корректно трансформируются

---

## ⚡ Производительность

### **Polling интервалы**:
- **Users**: 5 секунд
- **Sessions**: 5 секунд
- **Session Details**: **1 секунда** (для быстрых обновлений транскрипции!)
- **Health**: 30 секунд
- **Prompts/Coaches**: только при действиях пользователя

### **Оптимизации**:
- TanStack Query автоматически кэширует данные
- Умная инвалидация кэша при мутациях
- Оптимистичные обновления UI
- Дедупликация запросов

---

## 🎯 Функциональность

### ✅ **Dashboard**:
- [x] Три панели рядом с ресайзерами
- [x] Users panel с collapse
- [x] Sessions panel с close и collapse
- [x] Details panel с 4 табами
- [x] Delete session
- [x] Delete all user sessions
- [x] Polling каждую 1 секунду для details
- [x] Live индикатор

### ✅ **Prompts Configuration**:
- [x] Табы: Coach + все stages
- [x] Coach tab с CRUD операциями
- [x] Stage tabs с промптами
- [x] Textarea для редактирования
- [x] Save и Restore кнопки
- [x] Сохранение активного таба в localStorage

### ✅ **Общее**:
- [x] Два главных таба: Dashboard и Prompts Configuration
- [x] Health monitoring (Server + Bot)
- [x] Refresh button
- [x] Responsive design
- [x] Error handling
- [x] Loading states

---

## 📁 Структура проекта

```
src/
├── app/
│   ├── App.tsx
│   ├── router.tsx                    # 2 роута: / и /prompts
│   ├── providers.tsx
│   └── pages/
│       ├── dashboard-page.tsx        # ThreePanelLayout
│       └── prompts-page.tsx          # PromptsConfigurationNew
│
├── features/
│   ├── dashboard/
│   │   └── components/
│   │       ├── three-panel-layout.tsx       # Главный layout
│   │       ├── users-panel.tsx              # Левая панель
│   │       ├── sessions-panel.tsx           # Центральная панель
│   │       ├── details-panel.tsx            # Правая панель с табами
│   │       ├── panel-resizer.tsx            # Ресайзер
│   │       └── details-tabs/
│   │           ├── summary-tab.tsx
│   │           ├── transcript-tab.tsx
│   │           ├── chatgpt-tab.tsx
│   │           └── wellness-tab.tsx
│   │
│   ├── users/
│   │   └── api/
│   │       └── use-users.ts                 # TanStack Query hooks
│   │
│   ├── sessions/
│   │   └── api/
│   │       └── use-sessions.ts              # Polling 1 сек
│   │
│   ├── prompts/
│   │   ├── api/
│   │   │   └── use-prompts.ts
│   │   └── components/
│   │       └── prompts-configuration-new.tsx # Табы: Coach + Stages
│   │
│   ├── coaches/
│   │   ├── api/
│   │   │   └── use-coaches.ts
│   │   └── components/
│   │       └── coach-configuration-tab.tsx   # Встроен в Prompts
│   │
│   └── health/
│       ├── api/
│       │   └── use-health.ts
│       └── components/
│           └── health-status.tsx
│
├── shared/
│   ├── api/
│   │   └── client.ts                        # Исправленные endpoints
│   ├── components/
│   │   └── layout.tsx                       # Header с навигацией
│   ├── lib/
│   │   └── utils.ts
│   ├── store/
│   │   └── ui-store.ts
│   └── types/
│       └── api.ts
│
└── ui/                                       # Reusable components
    ├── button.tsx
    ├── card.tsx
    ├── badge.tsx
    ├── input.tsx
    └── textarea.tsx
```

---

## 🚀 Запуск

```bash
# Приложение уже запущено!
# URL: http://localhost:5173

# Если нужно перезапустить:
npm run dev
```

---

## 🎨 Отличия от первой версии

| Аспект | Было (неправильно) | Стало (правильно) |
|--------|-------------------|-------------------|
| **Dashboard** | Sliding panels | 3 панели рядом с ресайзерами |
| **Details** | Отдельная панель | Панель с 4 табами внутри |
| **Prompts** | Stages и Prompts отдельно | Табы для каждого stage |
| **Coach** | Отдельная страница | Первый таб в Prompts |
| **Навигация** | 3 пункта меню | 2 пункта (Dashboard, Prompts) |
| **API** | `/api/users/:email/sessions` | `/api/interviews?email=` |
| **Polling** | 5 секунд | 1 секунда для details |
| **Структура** | Feature-based | Точно как в оригинале |

---

## ✅ Checklist соответствия оригиналу

- [x] Три панели рядом (не sliding)
- [x] Ресайзеры между панелями
- [x] Кнопки collapse для панелей
- [x] Details с табами: Summary, Transcript, Chat GPT, Wellness
- [x] Prompts с табами: Coach + все stages
- [x] Coach как первый таб (не отдельная страница)
- [x] Textarea для редактирования промптов
- [x] Save и Restore кнопки
- [x] Polling 1 секунда для details
- [x] Live индикатор
- [x] Правильные API endpoints
- [x] Маппинг response.results
- [x] localStorage для активного таба
- [x] Два главных таба (Dashboard, Prompts)

---

## 🎉 Результат

**Приложение полностью соответствует оригинальной vanilla TypeScript версии!**

Все функции, структура, поведение и API endpoints идентичны оригиналу, но теперь с преимуществами React:
- Автоматическое управление DOM
- Умное кэширование данных
- Оптимистичные обновления
- Лучшая производительность
- Легче поддерживать и расширять

---

**URL приложения**: http://localhost:5173

**Готово к использованию!** 🚀
