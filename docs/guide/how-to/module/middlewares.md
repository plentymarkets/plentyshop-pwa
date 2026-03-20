# Middleware Guide

## Introduction

This guide explains how to create a new middleware in your module or override an existing middleware in your shop repository from your module.

## Scenarios

### 1. Creating a new middleware

To create a new middleware within your module, follow these steps:

- Add the middleware to your module. We recommend using the `src/runtime/middleware/` directory.
- Register the middleware in your module by adding the following code:

```typescript
// src/module.ts
// in the setup function

addRouteMiddleware({
  name: 'example-middleware',
  path: resolve('./runtime/middleware/example-middleware'),
  global: true,
});
```

Your middleware is now registered and can be used in your shop repository. In this example, the middleware will be executed on every route because the `global` property is set to `true`.
Otherwise, the middleware can be used with `middleware: 'example-middleware'`.

### 2. Overriding an existing middleware

To replace an existing middleware in your shop repository with a custom one, follow these steps:

1. Create a middleware in your module. We recommend using the `src/runtime/middleware/` directory. The name of the middleware must be the same as the one you want to override. To just override an existing middleware it is not necessary to use the `addRouteMiddleware` function in the setup in your module.
2. Hook into the `app:resolve` hook.
3. Locate the middleware you want to override.
4. Update its `path` property to point to your custom middleware.

Example:

```typescript
// src/module.ts
// in the setup function

nuxt.hook('app:resolve', (app) => {
  const authMiddleware = app.middleware.find((m) => m.name === 'auth-guard');
  if (authMiddleware) {
    authMiddleware.path = resolve('./runtime/middleware/example-middleware');
  }
});
```

This will replace the `auth-guard` middleware in your shop repository with your custom version.
