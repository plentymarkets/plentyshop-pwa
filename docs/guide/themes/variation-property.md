# Variation properties

In the context of e-commerce, variation properties play a crucial role in enhancing product descriptions. These properties enable sellers to add custom details, thereby offering potential buyers more comprehensive information about the products.

The additional information provided by properties can range from ethical considerations like fair trade to multimedia enhancements such as product demonstration videos. Such details can significantly influence customer purchasing decisions.

## Use cases

Variation properties allow for a high degree of customization in product descriptions. Each product variation can be associated with specific groups, and properties within these groups are editable at the item level. This flexibility supports various use cases:

- **Custom badges and labels**: Sellers can create unique badges and labels for different product variations, aiding in marketing and branding efforts.
- **Custom sections**: Enables the creation of distinct sections within product descriptions, allowing for better organization and presentation of information.
- **Custom content**: Supports various content types, including HTML, files, and text, offering a rich medium for product descriptions.

## Example

This example demonstrates how to extract a specific property from `variationProperties`, specifically the URL of a PDF. To get the URL, carry out the following steps:

1. Import the helpers from the `@plentymarkets/shop-sdk` package.
2. Create a function that iterates through the variation properties, checks for the desired property using the helper functions, and returns the PDF URL.

```ts
import { productPropertyGetters } from '@plentymarkets/shop-sdk';

function getPDFUrlFromVariationProperties(variationProperties) {
  for (let variation of variationProperties) {
    for (let property of variation.properties) {
      if (
        productPropertyGetters.getPropertyName(property) === 'PDF URL' &&
        productPropertyGetters.getPropertyCast(property) === 'text'
      ) {
        return productPropertyGetters.getPropertyValue(property);
      }
    }
  }

  return null;
}
```

The `getPDFUrlFromVariationProperties` function performs the following actions:

- Iterate through each variation and its properties.
- Use `getPropertyName` and `getPropertyCast` to identify the property with the name `'PDF URL'` and the cast type `'text'`.
- Once found, `getPropertyValue` is used to retrieve the URL.

## Helpers

To facilitate the use and management of variation properties, the SDK provides several helper functions. These helpers are categorized into three main types:

### Property Types

- `isHTML`: Determines if the property content is in HTML format.
- `isImage`: Checks if the property is an image file.
- `isJpegFile`: Identifies if the file type is JPEG.
- `isMP4File`: Checks for MP4 file format.
- `isText`: Determines if the property content is plain text.
- `isWebpFile`: Identifies if the file type is WEBP.

### Group Helpers

- `hasGroup`: Checks if a group exists.
- `getGroup`: Retrieves a specific group.
- `getGroupId`: Obtains the ID of a group.
- `getGroupName`: Retrieves the name of a group.
- `getGroupDescription`: Provides a description of a group.
- `getPropertyCast`: Casts a property to a specific type based on its content.

### Property Helpers

- `hasProperty`: Determines if a property exists within a variation.
- `getProperty`: Retrieves a specific property.
- `getPropertyFromGroup`: Obtains a property from a specified group.
- `getProperties`: Retrieves all properties associated with a variation.
- `getPropertyId`: Fetches the ID of a property.
- `getPropertyValue`: Gets the value of a property.
- `getPropertyName`: Retrieves the name of a property.
- `getPropertyNameDescription`: Provides a description of a property's name.
- `getPropertyValueDescription`: Offers a description of a property's value.
- `getPropertyValueId`: Fetches the ID associated with a property's value.
