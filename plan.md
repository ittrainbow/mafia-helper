# План миграции: Firebase → GitHub Pages

## Контекст

- Раньше: Firebase Hosting (`https://circle-38cc7.web.app/`) + Firebase Storage для `.mp3`.
- Репозиторий: `https://github.com/ittrainbow/mafia-helper.git`
- Piano loop удалён; аудио — 4 локальных трека + опциональные колокола.

## Цель

Статический CRA на **GitHub Pages**, аудио в репозитории, без Firebase.

## Решения по умолчанию

| Вопрос | Решение |
| --- | --- |
| URL | `https://ittrainbow.github.io/mafia-helper/` |
| Аудио | `public/audio/*.mp3` |
| Загрузка | при старте создаём `HTMLAudioElement` на трек (`preload=auto`), по клику `play`/`pause` |
| Деплой | GitHub Actions → GitHub Pages |

## Статус аудио

| Файл | Назначение |
| --- | --- |
| `01-roles.mp3` | Роли |
| `03-dogovorka.mp3` | Договорка |
| `04-night.mp3` | Ночь |
| `02-countdown.mp3` | Перерыв |
| `bell-single.mp3` | колокол за 10с до конца |
| `bell-double.mp3` | колокол в конце |

## Шаги

### 1. Собрать аудио в `public/audio/` — ✅

### 2. Убрать Firebase из кода — ✅

- Player/Timer на локальных URL, preload `HTMLAudioElement`
- Удалены `src/db/firebase.ts`, `firebase.json`, зависимость `firebase`
- Почищен `public/sw.js`, обновлён README

### 3. Подготовить CRA под GitHub Pages — ✅

- `homepage`: `https://ittrainbow.github.io/mafia-helper`
- SW регистрируется как `${PUBLIC_URL}/sw.js`, base path внутри SW из `self.location`
- `manifest.json`: `start_url` / `scope` = `"."`

### 4. CI/CD — ✅

- `.github/workflows/deploy.yml`: push в `master` → `yarn build` → GitHub Pages.
- После первого пуша: Settings → Pages → Source = **GitHub Actions** (если не переключится само).

### 5. Домен (опционально)

- По умолчанию `*.github.io`.
- Кастомный домен: `public/CNAME` + DNS.

### 6. Проверка — ❌ пропускаем

### 7. Выход из Firebase Hosting

- Отключить сайт в Firebase Console после стабильного Pages.

## Чеклист

| # | Задача | Статус |
| --- | --- | --- |
| 1 | Аудио + убрать piano loop | ✅ |
| 2 | Preload Audio + выпилить Firebase | ✅ |
| 3 | Колокольчики `bell-single` / `bell-double` | ✅ |
| 4 | `homepage` + SW под base path | ✅ |
| 5 | Workflow + Pages | ✅ |
| 6 | Smoke-test | ❌ skip |
| 7 | Отключить Firebase Hosting | после Pages |
