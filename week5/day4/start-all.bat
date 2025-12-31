@echo off
echo Starting E-Commerce Backend Services...

echo.
echo Starting Express Backend (Port 5000)...
start "Express Backend" cmd /k "cd backend && npm run dev"

echo.
echo Starting NestJS Reviews Service (Port 3001)...
start "NestJS Reviews" cmd /k "cd reviews-service && npm run start:dev"

echo.
echo Starting React Frontend (Port 5173)...
start "React Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo All services are starting...
echo Express Backend: http://localhost:5000
echo NestJS Reviews: http://localhost:3001
echo React Frontend: http://localhost:5173
echo.
pause