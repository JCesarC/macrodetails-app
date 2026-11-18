# MacroDetails

> Asistente de regalos con AI sobre un marketplace curado de artesanos locales. Ciudad inicial: Campeche, México.

Le cuentas a quién quieres sorprender, para qué ocasión y cuánto quieres gastar; MacroDetails te recomienda detalles reales del catálogo (flores, postres, chocolates, arreglos personalizados), los programa para la fecha exacta y te recuerda las fechas importantes del año.

**Estado:** demo en construcción (Fase Demo, 17 nov – 1 dic 2026). Ver el [roadmap](docs/ROADMAP.md).

## Stack

| Capa      | Tecnología                                                          |
| --------- | ------------------------------------------------------------------- |
| Web       | Next.js 16 (App Router, Cache Components), React 19, Tailwind CSS 4 |
| API       | NestJS 12 (ESM), Mongoose 9, Zod 4                                  |
| Datos     | MongoDB Atlas (Vector Search), Redis                                |
| Contratos | `@macrodetails/contracts`: esquemas Zod compartidos por web y API   |
| Calidad   | Vitest, Supertest, oxlint, ESLint, Prettier, GitHub Actions         |
| Monorepo  | pnpm workspaces + Turborepo                                         |

## Estructura

```
apps/
  web/        Next.js: tienda, panel de proveedor y admin
  api/        NestJS: monolito modular (ver docs/adr/0002)
packages/
  contracts/  esquemas Zod y tipos compartidos
  config/     configuración compartida de TypeScript
infra/        AWS CDK: bucket S3 privado + CloudFront para imágenes
docs/
  ROADMAP.md
  adr/        decisiones de arquitectura
```

## Correr en local

Requisitos: Node 24 (`.nvmrc`), pnpm (vía `corepack enable pnpm`) y Docker.

```bash
pnpm install
cp .env.example .env                     # credenciales de Mongo local
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local
pnpm infra:up                            # MongoDB (Atlas local, con auth) + Redis
pnpm --filter @macrodetails/api seed     # 6 proveedores y 42 productos de demo
pnpm dev                                 # web en :3000, API en :4000
```

- Web: http://localhost:3000
- Salud de la API: http://localhost:4000/api/v1/health
- Catálogo: http://localhost:4000/api/v1/products?category=flowers&occasion=birthday

Para usar MongoDB Atlas en lugar del contenedor local solo cambia `MONGODB_URI` en `apps/api/.env`.

## Scripts

| Comando                                        | Qué hace                                              |
| ---------------------------------------------- | ----------------------------------------------------- |
| `pnpm dev`                                     | Levanta todas las apps en modo desarrollo             |
| `pnpm build`                                   | Compila paquetes y apps                               |
| `pnpm lint` / `pnpm typecheck`                 | Lint y revisión de tipos en todo el monorepo          |
| `pnpm test`                                    | Tests unitarios                                       |
| `pnpm test:e2e`                                | Tests e2e de la API (requiere `pnpm infra:up`)        |
| `pnpm format`                                  | Formatea con Prettier                                 |
| `pnpm --filter @macrodetails/api seed`         | Carga proveedores y productos de demo (idempotente)   |
| `pnpm --filter @macrodetails/infra synth`      | Genera las plantillas de CloudFormation               |
| `pnpm --filter @macrodetails/infra cdk:deploy` | Despliega la infraestructura (requiere `AWS_PROFILE`) |

## Convenciones

- **Código en inglés:** identificadores, comentarios, nombres de tests, logs y mensajes de error.
- **Textos de la UI fuera del código:** viven en diccionarios JSON en `apps/web/src/i18n/messages/<locale>/<namespace>.json` y se leen con `getMessages()`. Hoy existe `es-MX`; para agregar otro idioma se crea su carpeta con las mismas llaves.

## Decisiones de arquitectura

- [0001 · Monorepo con pnpm y Turborepo](docs/adr/0001-monorepo.md)
- [0002 · Monolito modular con arquitectura hexagonal por módulo](docs/adr/0002-monolito-modular-hexagonal.md)
- [0003 · NestJS para la API](docs/adr/0003-nestjs.md)
- [0004 · Estructura de cuentas y región de AWS](docs/adr/0004-cuentas-y-region-aws.md)
