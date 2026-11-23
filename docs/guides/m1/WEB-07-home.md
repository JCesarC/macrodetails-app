# WEB-07 · Home

## Objetivo

Que en cinco segundos se entienda qué es MacroDetails y que haya un camino claro para explorar: hero, ocasiones y productos destacados.

## Archivos

```
apps/web/src/app/page.tsx
apps/web/src/components/home/hero.tsx
apps/web/src/components/home/occasion-grid.tsx
apps/web/src/components/home/featured-products.tsx
apps/web/src/i18n/messages/es-MX/home.json
```

## Pasos

1. **Hero:** título, subtítulo y dos botones: "Explorar regalos" → `/products` y "Pídele ideas al asistente" → `/concierge` (llega en M3; por ahora puede apuntar a `/products`).
2. **Ocasiones** (`id="occasions"`, el menú ya apunta ahí): las 9 de `OCCASIONS` (`@macrodetails/contracts`), con la etiqueta de `catalog.occasions` y un ícono de `lucide-react` por ocasión. Cada tarjeta enlaza a `/products?occasion=<key>`. Tipa el mapa de íconos como `Record<Occasion, LucideIcon>` para que TypeScript te avise si se agrega una ocasión.
3. **Destacados:** `listProducts({ limit: 8, sort: 'newest' })` con `ProductGrid` dentro de `<Suspense fallback={<ProductGridSkeleton />}>`.
4. **ApiStatus:** sácalo del hero; muévelo al footer en pequeño o elimínalo junto con `lib/api.ts` si ya no se usa.

## Trampa principal

Con Cache Components, todo lo que no depende del request se **prerenderiza en el build**. "Destacados" usa datos cacheados, así que `next build` intentará llamar a la API; en Vercel la API todavía no existe y el build fallará. Investiga `connection()` de `next/server`: llamarlo antes de pedir los datos marca ese componente como dinámico.

## Criterios de aceptación

- [ ] Las 9 ocasiones enlazan al catálogo filtrado.
- [ ] Destacados muestra 8 productos con skeleton mientras carga.
- [ ] `pnpm build` pasa **con la API apagada**.
- [ ] A 375 px no hay scroll horizontal.
- [ ] Ningún texto escrito directo en el JSX.

---

## Si te atoras

<details>
<summary>Componente dinámico con connection()</summary>

```tsx
import { connection } from 'next/server';

export async function FeaturedProducts() {
  await connection();
  const { items } = await listProducts({ limit: 8, sort: 'newest' });
  return <ProductGrid products={items} />;
}
```

`connection()` le dice a Next que esto se resuelve por request, así que no lo intenta en el build. La caché de `listProducts` sigue funcionando entre requests.
</details>
