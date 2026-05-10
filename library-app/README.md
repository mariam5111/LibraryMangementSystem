# LibSystem: React + Vite + Tailwind CSS


## Routes till now

| Role       | Routes                                                                         |
|------------|--------------------------------------------------------------------------------|
| Admin      | `/admin/dashboard`, `/admin/users`                                             |
| Librarian  | `/librarian/dashboard`, `/librarian/requests`, `/librarian/borrows`, `/librarian/books` |
| Member     | `/member/dashboard`, `/member/books`, `/member/borrows`                        |

## Auth

- JWT token is stored in `localStorage` (`lib_token` key)
- Roles are parsed from the JWT
- Routes are protected by role at wrong role -> redirects to `/`

## Tech stack

- React 18
- React Router v6
- Vite 5
- Tailwind CSS 3

## Known bugs:
- At borrowing a book count not updating
- No option for returning a book -> hence no state of return
- the statscard for issued today and returned today infinitely loading
