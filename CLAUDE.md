# GanaControl — contexto del proyecto (frontend)

Frontend de GanaControl (gestión ganadera): React 19 + Vite, **HashRouter** (rutas tipo `/#/ganado`), CSS por módulo. Es el frontend completo del equipo (origen: michaell010/frontend-2) adaptado a Vercel. El backend es el repo hermano `ganacontrol-backend` (ver su `CLAUDE.md` para el contexto completo, producción, usuarios demo y variables).

- Producción: https://ganacontrol-frontend.vercel.app (despliega solo con push a `main`).
- Local: `npm install`, crear `.env` con `VITE_API_URL=http://localhost:3000/api` (o la URL de Railway + `/api`, sin slash final), `npm run dev`.
- Opcional: `VITE_GOOGLE_CLIENT_ID` activa el botón "Continuar con Google".
- Contrato con la API: `src/services/*.js` (respuesta `{ ok, mensaje, data }`; errores con `errores[{campo, mensaje}]`).
- Login: `src/pages/public/Login.jsx` es el panel animado de las vacas (`styles/LoginAnimado.css`, GIF `assets/login-vacas.gif`). El login moderno del equipo está en `LoginModerno.jsx` (sin ruta).
- Permisos: las rutas privadas usan `ProtectedPermission` en `src/routes/AppRouter.jsx` (`ganado.ver`, `ventas.ver`, `cockpit.ver`, ...); el Administrador entra a todo.
- Calidad: `npx eslint src` y `npx vite build` deben quedar limpios.
- Commits: autor NicolasP03.
