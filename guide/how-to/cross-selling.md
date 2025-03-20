# Product Cross-Selling

::: info
The cross-selling feature is available with `@plentymarkets/shop-api` version 0.95.0
:::

With `useSdk().plentysystems.getFacet` we are able to load cross-selling items.
We can make use of the `useProducts` composable where we wrap the sdk call to be used in nuxt.

Required `getFacet` params for a cross-selling are the `itemId`, `type: cross_selling` and optional `crossSellingRelation`.

You can get the itemId by using `useProduct()`, if you are on the product page `product.value` is already available.

Example
```ts
const { data: product, fetchProduct } = useProduct(productId);
const itemId = productGetters.getItemId(product.value)
```

### Fetch cross-selling data:

``` ts
const itemId = productGetters.getItemId(product.value)

// the param for useProducts is your state key, if you want to have multiple item lists, this identifier must be unique
const { fetchProducts: fetchCrossSelling, data: crossSellingItems } = useProducts('crossSelling' + itemId + 'Similar');

fetchCrossSelling({
  itemId: itemId,
  type: 'cross_selling',
  crossSellingRelation: 'Similar'
});

```

### Fetch multiple cross-selling lists by relation type

Available `crossSellingRelation` types: `Accessory`, `ReplacementPart`, `Similar`, `Bundle`

``` ts

// the param for useProducts is your state key, if you want to have multiple item lists, this identifier must be unique
const { fetchProducts: fetchCrossSelling, data: crossSellingItems } = useProducts(productId + 'Similar');

fetchCrossSelling({
  itemId: productGetters.getItemId(product.value),
  type: 'cross_selling',
  crossSellingRelation: 'Similar'
});

// type Accessory
const { fetchProducts: fetchCrossSellingAccessory, data: crossSellingItemsAccessory } = useProducts(productId + 'Accessory');

fetchCrossSellingAccessory({
  itemId: productGetters.getItemId(product.value),
  type: 'cross_selling',
  crossSellingRelation: 'Accessory'
});

// type Bundle
const { fetchProducts: fetchCrossSellingBundle, data: crossSellingItemsBundle } = useProducts(productId + 'Bundle');

fetchCrossSellingBundle({
  itemId: productGetters.getItemId(product.value),
  type: 'cross_selling',
  crossSellingRelation: 'Bundle'
});

// type ReplacementPart
const { fetchProducts: fetchCrossSellingReplacementPart, data: crossSellingItemsReplacementPart } = useProducts(productId + 'ReplacementPart');

fetchCrossSellingReplacementPart({
  itemId: productGetters.getItemId(product.value),
  type: 'cross_selling',
  crossSellingRelation: 'ReplacementPart'
});

```

### Render with ProductSlider


``` html
<ProductSlider v-if="crossSellingItemsAccessory" :items="crossSellingItemsAccessory.products"></ProductSlider>
```

``` ts

const itemId = productGetters.getItemId(product.value)
const { fetchProducts: fetchCrossSellingAccessory, data: crossSellingItemsAccessory } = useProducts(itemId + 'Accessory');

fetchCrossSellingAccessory({
  itemId: itemId,
  type: 'cross_selling',
  crossSellingRelation: 'Accessory'
});
```
