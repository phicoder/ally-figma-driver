The package has been configured successfully!

## Define contract mapping

Make sure to first define the mapping inside the `contracts/ally.ts` file as follows.

```ts
import { FigmaDriver, FigmaDriverConfig } from 'ally-figma-driver/build/standalone'

declare module '@ioc:Adonis/Addons/Ally' {
  interface SocialProviders {
    // ... other mappings
    figma: {
      config: FigmaDriverConfig
      implementation: FigmaDriver
    }
  }
}
```

## Add driver config

Make sure to add the driver inside the `config/ally.ts` file as follows.

```ts
const allyConfig: AllyConfig = {
    // ... other mappings

    /*
    |--------------------------------------------------------------------------
    | Figma driver
    |--------------------------------------------------------------------------
    */
    figma: {
      driver: 'figma',
      clientId: Env.get('FIGMA_CLIENT_ID'),
      clientSecret: Env.get('FIGMA_CLIENT_SECRET'),
      callbackUrl: 'http://localhost:3333/figma/callback',
      scopes: ['file_read']
    },
  }
}
```

## Validating environment variables

Ally config relies on environment variables for the client id and secret. We recommend you to validate environment variables inside the `env.ts` file.

### Variables for Figma provider

```ts
FIGMA_CLIENT_ID: Env.schema.string(),
FIGMA_CLIENT_SECRET: Env.schema.string(),
```
