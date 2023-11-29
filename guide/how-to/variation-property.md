# Variation Property

## Introduction

In the context of e-commerce, Variation Properties play a crucial role in enhancing product descriptions. These properties enable sellers to add custom details, thereby offering potential buyers more comprehensive information about the products. This additional information can range from ethical considerations like fair trade to multimedia enhancements such as product demonstration videos. Such details can significantly influence customer purchasing decisions.

## Use Cases

Variation Properties allow for a high degree of customization in product descriptions. Each product variation can be associated with specific groups, and properties within these groups are editable at the item level. This flexibility supports various use cases:

- Custom Badges and Labels: Sellers can create unique badges and labels for different product variations, aiding in marketing and branding efforts.
- Custom Sections: Enables the creation of distinct sections within product descriptions, allowing for better organization and presentation of information.
- Custom Content: Supports various content types, including HTML, files, and text, offering a rich medium for product description.

## How to Use Variation Property

1. Import the productPropertyGetters:
```javascript
import { productPropertyGetters } from '@plentymarkets/shop-sdk';
```

2. Use them as desired:
```javascript
const property = computed(() => productPropertyGetters.getProperty(product));
```

   [This section needs to be completed with a full detailed example.]

## Helpers

To facilitate the use and management of Variation Properties, several helper functions are provided. These helpers are categorized into three main types:

### Property Types

- isHTML: Determines if the property content is in HTML format.
- isImage: Checks if the property is an image file.
- isJpegFile: Identifies if the file type is JPEG.
- isMP4File: Checks for MP4 file format.
- isText: Determines if the property content is plain text.
- isWebpFile: Identifies if the file type is WEBP.

### Group Helpers

- hasGroup: Checks if a group exists.
- getGroup: Retrieves a specific group.
- getGroupId: Obtains the ID of a group.
- getGroupName: Retrieves the name of a group.
- getGroupDescription: Provides a description of a group.
- getPropertyCast: Casts a property to a specific type based on its content.

### Property Helpers

- hasProperty: Determines if a property exists within a variation.
- getProperty: Retrieves a specific property.
- getPropertyFromGroup: Obtains a property from a specified group.
- getProperties: Retrieves all properties associated with a variation.
- getPropertyId: Fetches the ID of a property.
- getPropertyValue: Gets the value of a property.
- getPropertyName: Retrieves the name of a property.
- getPropertyNameDescription: Provides a description of a property's name.
- getPropertyValueDescription: Offers a description of a property's value.
- getPropertyValueId: Fetches the ID associated with a property's value.
