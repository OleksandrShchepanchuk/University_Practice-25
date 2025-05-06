# Movie Booking API

Цей API дозволяє керувати фільмами, сеансами, бронюваннями та обраними фільмами. Реалізовано з використанням **NestJS**.

## Встановлення

```bash
npm install -g @nestjs/cli

npm install

nest start --watch
```

---

## Аутентифікація

### POST `/api/auth/signup`

Реєстрація нового користувача.

**Request body:**

```json
{
  "email": "user@example.com",
  "password": "securePassword",
  "firstName": "Name",
  "lastName": "LastName"
}
```

---

## Фільми

### GET `/api/movies`

Отримати список усіх фільмів.

### GET `/api/movies/:id`

Отримати один фільм за ID.

### POST `/api/movies`

Створити новий фільм.

**Request body:**

```json
{
  "title": "Inception",
  "poster": "https://example.com/inception.jpg",
  "description": "A thief steals corporate secrets through dream-sharing technology.",
  "genre": "Sci-Fi",
  "rating": 8.8,
  "year": 2010,
  "trailer": "https://www.youtube.com/watch?v=YoHD9XEInc0",
  "cast": ["Leonardo DiCaprio", "Joseph Gordon-Levitt", "Elliot Page"]
}
```

### PATCH `/api/movies/:id`

Оновити інформацію про фільм.

### DELETE `/api/movies/:id`

Видалити фільм.

---

## Сеанси фільмів

### GET `/api/movies-session`

Отримати список усіх сеансів.

### GET `/api/movies-session/:id`

Отримати конкретний сеанс за ID.

### POST `/api/movies-session`

Створити новий сеанс.

**Request body:**

```json
{
  "movieId": "345",
  "price": "23",
  "schedule": [
    {
      "date": "2025-06-01",
      "times": ["14:00", "18:00"]
    },
    {
      "date": "2025-06-05",
      "times": ["13:00", "20:00"]
    }
  ]
}
```

### PATCH `/api/movies-session/:id`

Оновити дані сеансу.

### DELETE `/api/movies-session/:id`

Видалити сеанс.

---

## Бронювання

### GET `/api/bookings`

Отримати всі бронювання.

### POST `/api/bookings`

Створити нове бронювання.

**Request body:**

```json
{
  "sessionId": "id",
  "seats": 2,
  "totalPrice": 240
}
```

### DELETE `/api/bookings/:id`

Скасувати бронювання.

---

## Обрані фільми

### GET `/api/favorites`

Отримати список обраних фільмів користувача.

### POST `/api/favorites`

Додати фільм до обраних.

**Request body:**

```json
{
  "movieId": "123456"
}
```

### DELETE `/api/favorites/:id`

Видалити фільм з обраного.

---

## Технології

- [NestJS](https://nestjs.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [Firebase Firestore](https://firebase.google.com/docs/firestore/)
- [Firebase Authentication](https://firebase.google.com/docs/auth/)
