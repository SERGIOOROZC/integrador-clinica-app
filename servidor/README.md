# turnos_medicos_app

Este es un proyecto para la gestión de turnos médicos, desarrollado con Node.js, Express y MySQL.

## Instalación

1.  Clona este repositorio:
    `git clone https://github.com/SERGIOOROZC/turnos-medicos-app.git`
2.  Navega al directorio `src`:
    `cd turnos-medicos-app/src`
3.  Instala las dependencias:
    `npm install`

## Configuración

Crea un archivo `.env` en el directorio `src` con las siguientes variables de entorno para la conexión a la base de datos:

```
DB_HOST=your_database_host
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=your_database_name
```

## Uso

El servidor se ejecutará en:
👉 http://localhost:3000

🗂️ Entidades principales

Usuario 👤
Representa la cuenta en el sistema. Tiene un rol (admin, medico, paciente) y credenciales de acceso.

Paciente 🧑‍🤝‍🧑
Información personal de los pacientes vinculados a un usuario.

Médico 🩺
Datos de los médicos (nombre, apellido, especialidad).

Turno 📅
Representa una cita médica, con fecha, hora, médico y paciente asignado.

📌 Endpoints principales

/usuarios → CRUD de usuarios (solo admin)

/pacientes → CRUD de pacientes

/medicos → CRUD de médicos y ver turnos asignados

/turnos → CRUD de turnos (crear, listar, borrar)

/auth/login → Autenticación con email y contraseña

/auth/register → Registro de usuarios

/auth/perfil → Datos del usuario autenticado