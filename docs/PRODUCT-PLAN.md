# MacroDetails — Plan de producto

> Asistente de regalos con memoria sobre un marketplace curado de artesanos locales.
> Ciudad inicial: Campeche. Expansión: Ciudad del Carmen → Mérida → península.
>
> Este documento describe la visión, las decisiones de stack y las fases del producto.
> El backlog ejecutable (ítems, prioridades, estado y DoD) vive en [ROADMAP.md](ROADMAP.md).

Última actualización: 17 nov 2026

---

## Decisiones base

| Área          | Decisión                                                                                                                                    |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Repositorio   | **Monorepo** (pnpm + Turborepo). Despliegues independientes por app                                                                         |
| Frontend      | **Next.js** (App Router) + TypeScript + Tailwind + shadcn/ui + TanStack Query + React Hook Form + Zod                                       |
| Backend       | **NestJS** (Node + TS) como **monolito modular** con arquitectura hexagonal por módulo                                                      |
| Base de datos | **MongoDB Atlas** + Mongoose 8 (Atlas Vector Search para búsqueda semántica)                                                                |
| Colas / jobs  | Redis + BullMQ (`apps/worker`)                                                                                                              |
| Archivos      | **AWS S3** privado + CloudFront, subida con URLs prefirmadas                                                                                |
| AWS           | S3, CloudFront, Lambda (procesamiento de imágenes), SES, Secrets Manager, CloudWatch, SQS/SNS o EventBridge (Fase 3), **CDK en TypeScript** |
| Pagos         | Stripe México o Mercado Pago (tarjeta, OXXO, SPEI)                                                                                          |
| AI            | LLM con tool use + salidas estructuradas, embeddings, visión; Langfuse; evals en CI                                                         |
| Calidad       | Vitest/Jest, Supertest, Testcontainers, Playwright, GitHub Actions                                                                          |

### Estructura objetivo

```
macrodetails/
  apps/web            Next.js: (tienda) (proveedor) (admin)
  apps/api            NestJS: monolito modular
  apps/worker         BullMQ: recordatorios, programados, notificaciones
  apps/ai-service     (Fase 3) concierge / agente extraído
  packages/contracts  esquemas Zod + tipos compartidos front/back
  packages/config     tsconfig, eslint, prettier
  infra/              AWS CDK
  docs/adr/           decisiones de arquitectura
```

### Reglas de arquitectura

1. Organizar por **módulo de negocio**, capas dentro de cada módulo (`domain`, `application`, `infrastructure`, `presentation`).
2. Las dependencias apuntan hacia adentro: el dominio no conoce Mongo, NestJS ni Stripe.
3. Un módulo solo se usa a través de su `index.ts` público o de **eventos de dominio**. Nunca se leen colecciones de otro módulo.
4. Dominio rico solo donde hay reglas (`orders`, `payments`, `delivery`); CRUD simple donde no (`catalog`, `tags`).
5. Microservicios solo cuando se justifiquen (Fase 3), cada uno con su ADR.

---

## ⭐ Fase Demo · Vertical slice para portafolio (17 nov – 1 dic 2026)

**Objetivo:** una demo **desplegada, pública y funcional** que muestre el flujo completo y la AI como protagonista, construida sobre la arquitectura final. No es un prototipo que se tira: es la primera rebanada del producto real.

**Supuesto:** dedicación de tiempo completo (~6–8 h/día).

### Alcance

**Sí entra**

- Monorepo, NestJS, Next.js, contratos compartidos, Docker Compose, CI, deploy público.
- Catálogo con 40–60 productos de 6–8 proveedores ficticios (imágenes propias, libres de derechos o generadas y marcadas como demo).
- Tienda: inicio, explorar por ocasión y categoría, detalle con opciones de personalización, búsqueda.
- **Concierge de regalos con AI**: chat en streaming, agente con herramientas (`search_catalog`, `check_delivery`, `add_to_cart`, `save_recipient`), tarjetas de producto dentro del chat con el "por qué".
- **Búsqueda híbrida** (texto + vectorial) con Atlas Vector Search.
- Carrito, checkout con **Stripe en modo test**, webhook idempotente, pedido con máquina de estados y línea de tiempo.
- **Panel de proveedor**: subir foto → la AI de visión propone título, descripción, etiquetas y alérgenos → el proveedor aprueba.
- Ayuda con el mensaje de tarjeta.
- Destinatarios y ocasiones en versión ligera ("Próximas fechas").
- **Evals** (25–30 escenarios) corriendo en CI con resultados en el README.
- Langfuse (trazas, costo por conversación), rate limiting y tope diario de gasto de AI.
- Botones de **"Entrar como cliente demo" / "Entrar como proveedor demo"**.
- README de nivel profesional, diagrama de arquitectura, 3 ADRs, video de 2–3 min.

**No entra (queda para fases siguientes)**

- WhatsApp (requiere verificación de Meta), pagos reales, Google OAuth, worker de recordatorios, panel admin completo, CDK completo, microservicios.

### Plan día por día

| Día   | Entregable                                                                                                      |
| ----- | --------------------------------------------------------------------------------------------------------------- |
| 1     | Monorepo, esqueletos Next + NestJS, `packages/contracts`, Docker Compose, CI, **deploy "hola mundo" a staging** |
| 2     | Módulos `catalog` y `vendors`, script de seed, imágenes en S3 + CloudFront                                      |
| 3–4   | Tienda: inicio, ocasiones, categorías, detalle con personalización, búsqueda por texto; diseño mobile-first     |
| 5     | Auth (email + usuarios demo), carrito, checkout Stripe test, webhook, pedido con estados                        |
| 6     | Embeddings + búsqueda híbrida con Atlas Vector Search                                                           |
| 7–8   | **Concierge**: agente con herramientas, UI en streaming, tarjetas de producto, guardar destinatario             |
| 9     | Panel de proveedor con AI de visión + ayuda de mensaje de tarjeta                                               |
| 10    | Evals en CI, Langfuse, rate limiting y tope de gasto                                                            |
| 11    | Pulido visual, e2e con Playwright del flujo feliz, tests de la máquina de estados                               |
| 12    | README, diagrama, ADRs, video, publicación en LinkedIn                                                          |
| 13–14 | Colchón                                                                                                         |

### Si el tiempo no alcanza, se recorta en este orden

1. Ayuda de mensaje de tarjeta
2. Destinatarios y ocasiones
3. Panel de proveedor con visión
4. Evals reducidas a 10 escenarios

**Nunca se recorta:** deploy público, concierge, checkout, README + video.

### Cómo se presenta en el CV

- **Implementado:** monorepo TS, NestJS modular/hexagonal, Next.js, MongoDB Atlas Vector Search, agente de AI con tool use, visión, evals en CI, observabilidad de LLM, Stripe, S3/CloudFront, CI/CD, e2e.
- **En roadmap:** WhatsApp, recordatorios programados, microservicios por eventos en AWS, B2B, MCP.
- Siempre como "demo funcional en desarrollo activo", con link en vivo, repo y video.

---

## Fase 1 · MVP comercial (2 dic 2026 – 31 ene 2027)

- Completar fundaciones: Google OAuth, refresh tokens, roles, CDK para S3/CloudFront/Lambda.
- Proveedores reales (5–8), capacidad diaria y tiempo de preparación.
- Entregas por zona y horario, foto de entrega, panel admin.
- `apps/worker` + notificaciones por correo (SES) y WhatsApp.
- Pagos reales (Stripe MX / Mercado Pago, OXXO, SPEI).
- Aviso de privacidad y términos.
- **En paralelo (diciembre):** piloto manual de regalos navideños por WhatsApp/Instagram.
- **Hito:** lanzamiento suave a finales de enero y preventa del 14 de febrero.
- **Plan B:** si falta algo, se opera a mano y la web funciona como vitrina y checkout.

## 14 feb 2027 · Lanzamiento y aprendizaje

- Operar, medir (pedidos, ticket promedio, entregas a tiempo, quejas) y escribir el post-mortem.

## Fase 2 · Diferenciador con AI (mar – abr 2027, meta 10 de mayo)

- Perfiles de destinatarios completos y calendario de ocasiones.
- Recordatorios automáticos por WhatsApp con 3 opciones listas para pagar.
- Concierge también en WhatsApp.
- Evals ampliadas (50–100 escenarios), guardrails, control de costos con enrutamiento entre modelos.
- Recomendaciones híbridas: embeddings + reglas + compras conjuntas.
- **Hito:** 10 de mayo con recordatorios activos.

## Fase 3 · Crecimiento y microservicios (may – ago 2027)

- Extraer **servicio de notificaciones** y **servicio de AI**.
- Eventos con SQS/SNS o EventBridge, patrón outbox, idempotencia, colas de mensajes fallidos, OpenTelemetry.
- CDK completo, alarmas y monitoreo.
- B2B corporativo con CFDI, suscripciones, regalos en grupo, "que quien recibe elija", regalos a distancia.

## Fase 4 · Expansión (sep 2027 en adelante)

- Servidor MCP y protocolos de comercio con agentes.
- Pronóstico de demanda para proveedores.
- Configuración multi-ciudad: Ciudad del Carmen, Mérida.
- Panel de métricas del negocio.

---

## Lo que deja cada fase en el portafolio

| Fase | Evidencia                                                            |
| ---- | -------------------------------------------------------------------- |
| Demo | Demo en vivo, agente de AI, búsqueda vectorial, evals, CI/CD, video  |
| 1    | Producto real con pagos, primeros pedidos reales, IaC                |
| 2    | AI en producción con evals, observabilidad y costo por pedido medido |
| 3    | Microservicios por eventos justificados, trazas distribuidas         |
| 4    | Comercio con agentes (MCP), datos y caso de negocio escrito          |
