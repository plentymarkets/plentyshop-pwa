# Custom icons

Customising icons in your shop can give your shop a unique look and feel.

This guide will walk you through the process of adding or replacing icons in your shop.

For further information, you can also refer to the [Storefront UI Documentation](https://docs.storefrontui.io/v2/vue/components/iconbase#custom-icon).

## Adding a custom icon

To add a new icon to your shop, follow these steps:

1. **Choose an icon**: Select an SVG icon file and obtain the SVG path.
2. **Insert the icon**: To display the new icon in your shop, add or adjust the following code at the desired location:

   ```html
   <SfIconBase
     viewBox="[Custom-Size]"
     size="[any valid size: 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl']"
     class="[tailwind | custom class]"
   >
     <path d="[SVG path]" />
   </SfIconBase>
   ```

   Replace `[SVG path]` with the SVG path you obtained in step 1. If you want to replace an existing icon with your custom one, simply substitute the existing path with your custom SVG path. Don't forget to set the desired size for the icon using the `size` attribute. Then set the `class` attribute as needed to achieve your preferred look and feel.

## Example

This example demonstrates how to integrate an SVG icon into your shop using the SfIconBase component. Adjust the viewBox, size, and class attributes to suit your needs.

```html
<SfIconBase @click="openReviewEdit" viewBox="0 0 32 32" size="xs" class="fill-primary-900 cursor-pointer">
  <path
    d="M31.25 7.003c0-0 0-0.001 0-0.001 0-0.346-0.14-0.659-0.365-0.886l-5-5c-0.227-0.226-0.539-0.366-0.885-0.366s-0.658 
        0.14-0.885 0.366v0l-20.999 20.999c-0.146 0.146-0.256 0.329-0.316 0.532l-0.002 0.009-2 7c-0.030 0.102-0.048 0.22-0.048 0.342
        0 0.691 0.559 1.251 1.25 1.252h0c0.126-0 0.248-0.019 0.363-0.053l-0.009 0.002 6.788-2c0.206-0.063 0.383-0.17 0.527-0.311l-0 
        0 21.211-21c0.229-0.226 0.37-0.539 0.371-0.886v-0zM8.133 26.891l-4.307 1.268 1.287-4.504 14.891-14.891 3.219 3.187zM25
        10.191l-3.228-3.196 3.228-3.228 3.229 3.228z"
  />
</SfIconBase>
```
