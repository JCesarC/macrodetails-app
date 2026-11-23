# M1 · Guías de implementación

Guías para los ítems de M1 que se implementan a mano. Cada una tiene objetivo, archivos, pasos con pistas, trampas, tests mínimos y criterios de aceptación. Al final, **"Si te atoras"** trae esqueletos y el porqué de cada decisión: intenta primero sin abrirla.

| Ítem            | Guía                                                                        | Rama sugerida                        | Depende de        |
| --------------- | --------------------------------------------------------------------------- | ------------------------------------ | ----------------- |
| CAT-06          | [Cálculo de precio compartido](CAT-06-pricing.md)                           | `feat/m1-cat-06-shared-unit-pricing` | —                 |
| WEB-05 + WEB-06 | [Detalle de producto y formulario de opciones](WEB-05-06-product-detail.md) | `feat/m1-web-05-product-detail-page` | CAT-06, WEB-01/02 |
| WEB-07          | [Home](WEB-07-home.md)                                                      | `feat/m1-web-07-home-page`           | WEB-01/02         |

Mientras `feat/day-3-storefront-base` (WEB-01…03) no esté en `main`, crea estas ramas **a partir de ella**.

## Recordatorios de convenciones

- Sin comentarios en el código; JSDoc solo si el contrato no es obvio por la firma ([CONTRIBUTING](../../../CONTRIBUTING.md)).
- Textos de UI en JSON de i18n; los Client Components reciben sus textos por props.
- Dinero en centavos y `formatPrice` solo al mostrar.
- Antes del PR: `pnpm format:check && pnpm lint && pnpm typecheck && pnpm test && pnpm build`.
