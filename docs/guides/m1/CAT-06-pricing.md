# CAT-06 · Cálculo de precio compartido

## Objetivo

Una sola función de precio que usen **la web** (vista previa en vivo en el detalle) y **la API** (checkout en M2). El navegador nunca decide el precio final: el servidor lo recalcula con exactamente las mismas reglas.

## Archivos

```
packages/contracts/src/catalog/pricing.ts
packages/contracts/src/catalog/pricing.spec.ts
packages/contracts/src/index.ts          (exportar)
```

## Qué escribir

```ts
type Selections = Record<string, string>;

calculateUnitPrice(basePrice: Money, options: ProductOption[], selections: Selections): Money
validateSelections(options: ProductOption[], selections: Selections): SelectionIssue[]
```

- `selections`: llave de la opción → valor elegido (`select`) o texto escrito (`text`).
- `calculateUnitPrice` suma el `priceDelta` de la opción elegida en cada `select`. Las opciones `text` no cambian el precio.
- `validateSelections` **no lanza**: devuelve la lista de problemas para que la UI los muestre todos a la vez.
  - `SelectionIssue = { key: string; reason: 'required' | 'invalid-choice' | 'too-long' | 'unknown-option' }`.
  - `required`: opción requerida sin valor (o con texto vacío tras `trim`).
  - `invalid-choice`: valor de un `select` que no está en sus `choices`.
  - `too-long`: texto que excede `maxLength`.
  - `unknown-option`: llave en `selections` que el producto no tiene.
- Define `SelectionIssueSchema` con Zod para que la API pueda devolver estos problemas y la web parsearlos.

## Pasos (TDD)

1. Escribe los tests antes que la implementación (lista abajo) y míralos fallar.
2. Implementa `validateSelections`.
3. Implementa `calculateUnitPrice` reutilizando la búsqueda de la opción elegida.
4. Exporta ambas y los tipos desde `index.ts`, y corre `pnpm --filter @macrodetails/contracts build`.

## Tests mínimos

- [ ] Sin opciones → precio base.
- [ ] Un `select` con `priceDelta` → base + delta. Referencia del seed: `ramo-rosas-rojas-clasico` con `size: '24'` → **110 000 centavos ($1,100)**.
- [ ] Dos `select` suman ambos deltas.
- [ ] Una opción `text` no cambia el precio.
- [ ] `select` opcional sin valor → precio base, sin problemas.
- [ ] Requerido faltante → `required`.
- [ ] Valor inexistente → `invalid-choice`.
- [ ] Texto más largo que `maxLength` → `too-long`.
- [ ] Llave desconocida → `unknown-option`.
- [ ] El resultado conserva la `currency` del precio base.

## Trampas

- `calculateUnitPrice` con selecciones inválidas: decide y documenta con JSDoc qué hace (recomendado: ignora lo inválido y calcula; quien llama debe validar antes).
- No uses `parseFloat` ni decimales: todo es entero en centavos.
- Este paquete se consume compilado: si la web no ve tus cambios, falta el `build` (o tener `pnpm dev` corriendo, que lo vigila).

## Criterios de aceptación

- [ ] Tests en verde en `pnpm --filter @macrodetails/contracts test`.
- [ ] Funciones y tipos exportados desde `@macrodetails/contracts`.
- [ ] Sin comentarios inline; JSDoc solo donde la regla no sea obvia.

---

## Si te atoras

<details>
<summary>Buscar la opción elegida</summary>

```ts
function selectedChoice(option: ProductOption, selections: Selections) {
  if (option.type !== 'select') return undefined;
  return option.choices.find((choice) => choice.value === selections[option.key]);
}
```

`ProductOption` es una unión discriminada por `type`; el `if` hace que TypeScript sepa que `choices` existe.
</details>

<details>
<summary>Esqueleto del precio</summary>

```ts
const delta = options.reduce(
  (sum, option) => sum + (selectedChoice(option, selections)?.priceDelta ?? 0),
  0,
);
return { amount: basePrice.amount + delta, currency: basePrice.currency };
```

</details>
