# Integrador-Full-Stack
Curso Silicon React 

# turnos_medicos_app

Este es un proyecto para la gestión de turnos médicos, desarrollado con Node.js, Express y MySQL en el backend suma React para el frontend.
participante Sergio Orozco



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
