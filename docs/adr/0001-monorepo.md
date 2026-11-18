# ADR 0001 · Monorepo con pnpm workspaces y Turborepo

- **Estado:** aceptado
- **Fecha:** 2026-11-17

## Contexto

La versión anterior de MacroDetails vivía en dos repositorios (`macrodetails-modules-back` y `portal-macro`). Los tipos de la API se duplicaban a mano en el frontend y cualquier cambio de contrato se rompía en tiempo de ejecución. El proyecto lo desarrolla una sola persona y tendrá varias aplicaciones (web, API, worker y, más adelante, servicios extraídos).

## Decisión

Un solo repositorio con **pnpm workspaces** y **Turborepo**:

- `apps/*`: aplicaciones desplegables (`web`, `api`, más adelante `worker`).
- `packages/*`: código compartido (`contracts` con esquemas Zod, `config` con configuración de TypeScript).

Cada app se sigue desplegando por separado y con su propio pipeline.

## Consecuencias

- ✅ Los esquemas de `@macrodetails/contracts` se usan en la API y en la web: si cambia un contrato, el código que lo consume deja de compilar.
- ✅ Un cambio que toca API y web va en un solo PR.
- ✅ Turborepo cachea tareas y solo reconstruye lo que cambió.
- ⚠️ Más configuración inicial (workspaces, builds de paquetes internos).
- ⚠️ El CI debe filtrar por app conforme crezca el repo.
