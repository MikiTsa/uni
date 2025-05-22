# Backend instructions

This repository contains the backend API for the Sociološki Zapiski project, built with Node.js and Express.js. It handles server-side logic, API routing, and integration with the frontend application.

---

## 🚀 Technologies Used

- **Node.js** – JavaScript runtime environment
- **Express.js** – Web framework for building APIs
- *(Include other packages, modules as needed)*

---

## 🛠️ Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/socioloski-zapiski/backend.git
cd backend
```

### 2. Create `.env` file
```bash
cp .env.example .env
nano .env # set required env variables
```

### 3. Start PostgreSQL database and run migrations
```console
$ docker compose up -d
[+] Running 3/3
 ✔ Network backend_default      Created                                    0.0s
 ✔ Container backend-psql-1     Healthy                                   12.6s
 ✔ Container backend-migrate-1  Started                                   11.2s
```
> [!NOTE]
> Also works with `podman` (using `docker-compose` extension)

To stop the database, run:
```console
$ docker compose down
[+] Running 3/3
 ✔ Container backend-migrate-1  Removed                                    0.0s
 ✔ Container backend-psql-1     Removed                                    0.5s
 ✔ Network backend_default      Removed                                    0.0s
```

### 4. Install dependencies
```bash
npm install
```

### 5. Run the server 
```bash
npm run dev
```
