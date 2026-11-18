# ADR 0003 · NestJS para la API

- **Estado:** aceptado
- **Fecha:** 2026-11-17

## Contexto

La API anterior usaba Express con Inversify configurado a mano para la inyección de dependencias, tsoa para OpenAPI y Joi para validación. El cableado manual era una fuente constante de código repetido.

## Decisión

Usar **NestJS** (sobre Express) con ESM, Vitest y Zod para validación.

## Consecuencias

- ✅ Módulos e inyección de dependencias integrados, que se alinean con el monolito modular (ADR 0002).
- ✅ Paquetes oficiales para lo que viene en el roadmap: configuración, Mongoose, colas (BullMQ), throttling y transporte de microservicios.
- ✅ Se sigue usando el stack conocido: Node, TypeScript, Express y MongoDB.
- ⚠️ Los decoradores de NestJS no deben filtrarse a la capa de dominio (regla 1 del ADR 0002).
