# WEB-05 + WEB-06 · Detalle de producto y formulario de opciones

## Objetivo

La página donde se decide la compra: fotos, proveedor, descripción, alérgenos, tiempo de preparación y un formulario de personalización que actualiza el precio en vivo con CAT-06.

## Archivos

```
apps/web/src/app/products/[slug]/page.tsx
apps/web/src/components/catalog/product-gallery.tsx
apps/web/src/components/catalog/product-options-form.tsx     ('use client')
apps/web/src/i18n/messages/es-MX/product-detail.json          (namespace nuevo)
apps/web/src/i18n/messages.ts                                  (registrar el namespace)
```

## WEB-05 · Página (Server Component)

1. **Tipos y params.** Usa `PageProps<'/products/[slug]'>`. En Next 16, `params` es una `Promise`.
2. **Suspense.** Con Cache Components, leer `params` es un dato de request: hazlo **dentro** de un componente async envuelto en `<Suspense>`. Es el mismo patrón que `app/products/page.tsx`. Si lo haces fuera, el build falla con un mensaje explícito.
3. **Datos.** `getProduct(slug)` de `lib/api/catalog.ts`. Si devuelve `null` → `notFound()` de `next/navigation`.
4. **Metadata.** `generateMetadata` con título, descripción y `openGraph.images` (primera foto si existe). Sirve para las vistas previas al compartir por WhatsApp.
5. **Diseño** (mobile-first, dos columnas desde `md`):
   - Izquierda: `ProductGallery` (imagen principal con `ProductImage` y `priority`, miniaturas si hay más de una).
   - Derecha: proveedor (link a `/products?vendor=<slug>`), nombre con `font-heading`, precio base con `formatPrice`, ocasiones como `Badge` con las etiquetas de `catalog.occasions`, descripción, alérgenos (o "sin alérgenos declarados"), tiempo de preparación y el formulario.

## WEB-06 · Formulario de opciones (Client Component)

1. **Props:** `options`, `basePrice` y un objeto `labels` con los textos. El componente **no importa** diccionarios (mira `MobileNav`).
2. **Estado:** `selections` con `useState<Record<string, string>>`. Inicializa los `select` requeridos con su primera opción si eso tiene sentido de negocio, o vacíos para forzar la elección (decide y justifícalo en el PR).
3. **Controles:**
   - `select` con 3 o menos opciones → `RadioGroup`; más de 3 → `Select`. Muestra el `+$` del delta junto a cada opción.
   - `text` → `Textarea` (o `Input` si `maxLength <= 40`) con contador de caracteres restantes.
4. **Precio:** `calculateUnitPrice` en cada render (es barato) y `formatPrice` para mostrarlo.
5. **Enviar:** `validateSelections`; si hay problemas, muestra el mensaje junto a cada campo (`aria-invalid` y `aria-describedby`). Si no hay, por ahora muestra un aviso de "Carrito disponible pronto" (el carrito llega en M2).

## i18n (`product-detail.json`)

Llaves sugeridas: `vendor`, `occasions`, `allergens`, `noAllergens`, `readyIn`, `options`, `total`, `addToCart`, `cartComingSoon`, `charactersLeft`, `issues.required`, `issues.invalid-choice`, `issues.too-long`, `issues.unknown-option`.

## Trampas

- `generateMetadata` y la página llaman a `getProduct` dos veces: está bien, la función usa `'use cache'` y la segunda llamada no vuelve a pedir a la API.
- No pases el producto completo al Client Component si no lo necesita; solo `options`, `basePrice` y `labels`.
- Un `Select` de Radix no acepta `value=""`: usa `undefined` para "sin elegir".

## Criterios de aceptación

- [ ] `/products/ramo-rosas-rojas-clasico`: al elegir 24 rosas, el total muestra **$1,100**.
- [ ] `/products/no-existe` → 404.
- [ ] Mensaje de la tarjeta con contador; al pasar el límite muestra el error.
- [ ] A 375 px no hay scroll horizontal y el formulario queda debajo de la galería.
- [ ] Ningún texto escrito directo en el JSX.
- [ ] `pnpm build` pasa (valida el uso de `params` con Suspense).

---

## Si te atoras

<details>
<summary>Estructura de la página</summary>

```tsx
export default function ProductPage({ params }: PageProps<'/products/[slug]'>) {
  return (
    <main className="…">
      <Suspense fallback={<ProductDetailSkeleton />}>
        <ProductDetail params={params} />
      </Suspense>
    </main>
  );
}

async function ProductDetail({ params }: Pick<PageProps<'/products/[slug]'>, 'params'>) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();
  …
}
```

</details>

<details>
<summary>Textos para el Client Component</summary>

En el servidor arma `const labels = { total: t.total, … }` con `getMessages()['product-detail']` y pásalo como prop. Tipar `labels` como `Messages['product-detail']` te avisa si falta una llave.
</details>
