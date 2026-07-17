# Product Cross-Selling

::: info
The cross-selling feature is available with `@plentymarkets/shop-api` version 0.95.0
:::

You can use `useSdk().plentysystems.getFacet` to load cross-selling items.
You can make use of the `useProducts` composable, in which you wrap the SDK call to be used in Nuxt.

The required `getFacet` parameters for a cross-selling item are `itemId`, `type: cross_selling`; the `crossSellingRelation` is optional.

You can get the `itemId` by using `useProduct()`; if you are on the product page `product.value` is already available.

> [!NOTE]
> The cross-selling fetch needs to be called only after the product has been fetched.

Example

```ts
const { data: product, fetchProduct } = useProduct(productId);
const itemId = productGetters.getItemId(product.value);
```

### Fetch cross-selling data:

```ts
const itemId = productGetters.getItemId(product.value);

// the param for useProducts is your state key; if you want to have multiple item lists, this identifier must be unique
const { fetchProducts: fetchCrossSelling, data: crossSellingItems } = useProducts('crossSelling' + itemId + 'Similar');

fetchCrossSelling({
  itemId: itemId,
  type: 'cross_selling',
  crossSellingRelation: 'Similar',
});
```

### Fetch multiple cross-selling lists by relation type

The available `crossSellingRelation` types are:
`Accessory`, `ReplacementPart`, `Similar`, `Bundle`

```ts
// the param for useProducts is your state key; if you want to have multiple item lists, this identifier must be unique
// type Similar
const { fetchProducts: fetchCrossSelling, data: crossSellingItems } = useProducts(productId + 'Similar');

fetchCrossSelling({
  itemId: productGetters.getItemId(product.value),
  type: 'cross_selling',
  crossSellingRelation: 'Similar',
});

// type Accessory
const { fetchProducts: fetchCrossSellingAccessory, data: crossSellingItemsAccessory } = useProducts(
  productId + 'Accessory',
);

fetchCrossSellingAccessory({
  itemId: productGetters.getItemId(product.value),
  type: 'cross_selling',
  crossSellingRelation: 'Accessory',
});

// type Bundle
const { fetchProducts: fetchCrossSellingBundle, data: crossSellingItemsBundle } = useProducts(productId + 'Bundle');

fetchCrossSellingBundle({
  itemId: productGetters.getItemId(product.value),
  type: 'cross_selling',
  crossSellingRelation: 'Bundle',
});

// type ReplacementPart
const { fetchProducts: fetchCrossSellingReplacementPart, data: crossSellingItemsReplacementPart } = useProducts(
  productId + 'ReplacementPart',
);

fetchCrossSellingReplacementPart({
  itemId: productGetters.getItemId(product.value),
  type: 'cross_selling',
  crossSellingRelation: 'ReplacementPart',
});
```

### Render with ProductSlider

```html
<ProductSlider v-if="crossSellingItemsAccessory" :items="crossSellingItemsAccessory.products"></ProductSlider>
```

```ts
const itemId = productGetters.getItemId(product.value);
const { fetchProducts: fetchCrossSellingAccessory, data: crossSellingItemsAccessory } = useProducts(
  itemId + 'Accessory',
);

fetchCrossSellingAccessory({
  itemId: itemId,
  type: 'cross_selling',
  crossSellingRelation: 'Accessory',
});
```
