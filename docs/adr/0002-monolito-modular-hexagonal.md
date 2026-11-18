# ADR 0002 · Monolito modular con arquitectura hexagonal por módulo

- **Estado:** aceptado
- **Fecha:** 2026-11-17

## Contexto

El primer intento aplicó Clean Architecture con capas **globales** (`domain/`, `application/`, `infrastructure/`, `presentation/`). Una sola funcionalidad quedaba repartida en cuatro carpetas lejanas, y además convivía con una estructura anterior (`Collections/`), con modelos duplicados.

Hay interés en llegar a microservicios, pero hoy no hay usuarios, el equipo es de una persona y el flujo central (pagar, reservar capacidad del proveedor, programar la entrega) necesita consistencia.

## Decisión

La API es un **monolito modular**. Primero se divide por **módulo de negocio** (`catalog`, `orders`, `vendors`, `recipients`, `ai`, …) y dentro de cada módulo por capas:

```
modules/<módulo>/
  domain/          entidades, reglas, eventos y puertos (interfaces)
  application/     casos de uso
  infrastructure/  adaptadores (Mongo, Stripe, S3, LLM)
  presentation/    controladores y DTOs
  <módulo>.module.ts
  index.ts         API pública del módulo
```

Reglas:

1. Las dependencias apuntan hacia adentro: el dominio no importa NestJS, Mongoose ni SDKs externos.
2. Un módulo solo usa a otro a través de su `index.ts` o de eventos de dominio. Nunca lee colecciones ajenas.
3. Dominio rico solo donde hay reglas (`orders`, `payments`, `delivery`). Los módulos técnicos o casi CRUD (`health`, `tags`) pueden ser planos.

## Consecuencias

- ✅ Cada funcionalidad vive en un solo lugar.
- ✅ La regla 2 permite extraer un módulo a un servicio independiente (previsto en la Fase 3 para notificaciones y AI) sin reescribirlo.
- ✅ Un solo despliegue y transacciones locales mientras el producto valida su mercado.
- ⚠️ Las reglas dependen de disciplina; más adelante se pueden reforzar con reglas de lint de dependencias.
