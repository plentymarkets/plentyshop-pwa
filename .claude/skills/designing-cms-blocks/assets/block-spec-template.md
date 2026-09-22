# Block Spec: <BlockName>

One-line purpose: <what this block shows/does, in plain language>

## Type

<content | structure>

<If structure: what does it hold as children, and why is a container the right shape (like MultiGrid/Carousel) rather than a settings-driven content block?>

## Placement

- Category: <CMS editor category, e.g. cards, media, layout>
- Access control: <comma-separated: content, productCategory, product>

## Settings fields

| Field       | Group                           | Type                      | Widget (component name)             | Default         | Notes                  |
| ----------- | ------------------------------- | ------------------------- | ----------------------------------- | --------------- | ---------------------- |
| <fieldName> | text/image/button/layout/custom | string/boolean/number/... | <component from list-components.sh> | <default value> | <anything non-obvious> |

<For structure blocks, replace this table with: what shape each child slot takes, and any layout/configuration fields (e.g. columnWidths) instead of settings.>

## Form complexity

<simple: one <BlockName>Form.vue | complex: forms/ + partials/ (only when the block has multiple independent sections/entities to edit, like UtilityBar)>

## Layout

- Default full width: <true | false>
- Padding: <true | false>
- Any block-layout.config.ts override needed: <yes, describe | no>

## Open questions

<anything still unresolved that implementation will need to make a judgment call on — or "none">
