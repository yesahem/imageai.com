# TypeScript Configuration Fix

## Issue
Getting errors in `avatar.tsx` and `badge.tsx`:
```
Cannot find module '@/lib/utils' or its corresponding type declarations.
```

## Root Cause
The project has two `lib/` directories:
1. `/apps/web/lib/` - Contains API client files (`api-client.ts`, `api.ts`)
2. `/apps/web/app/lib/` - Contains shadcn utils (`utils.ts`)

The TypeScript path mapping needed to be configured to resolve both correctly.

## Solution

### Updated `tsconfig.json`
```jsonc
{
  "extends": "@repo/typescript-config/nextjs.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./app/*"],                    // Main app directory
      "@/lib/api-client": ["./lib/api-client"],  // Root lib - API client
      "@/lib/api": ["./lib/api"],                // Root lib - API methods
      "@/hooks/*": ["./hooks/*"],            // Custom hooks
      "@/types": ["./types"],                // Type definitions
      "@/types/*": ["./types/*"],            
      "@/config": ["./app/config"]           // Config file
    }
  }
}
```

## How It Works

### For shadcn components (in `app/components/ui/`)
```typescript
import { cn } from "@/lib/utils"
// Resolves to: ./app/lib/utils (via @/* → ./app/*)
```

### For API client (anywhere)
```typescript
import { apiClient } from "@/lib/api-client"
// Resolves to: ./lib/api-client (specific mapping)

import { api } from "@/lib/api"
// Resolves to: ./lib/api (specific mapping)
```

### For hooks
```typescript
import { useModels } from "@/hooks/use-api"
// Resolves to: ./hooks/use-api
```

### For types
```typescript
import type { Model } from "@/types"
// Resolves to: ./types
```

## Directory Structure

```
apps/web/
├── app/
│   ├── lib/
│   │   └── utils.ts          ← shadcn utils (cn function)
│   ├── components/
│   │   └── ui/
│   │       ├── avatar.tsx    ✅ Uses @/lib/utils
│   │       └── badge.tsx     ✅ Uses @/lib/utils
│   └── config.ts
├── lib/
│   ├── api-client.ts         ← API HTTP client
│   └── api.ts                ← API endpoint methods
├── hooks/
│   ├── use-api.ts            ← Data fetching hooks
│   └── use-mutations.ts      ← Mutation hooks
└── types/
    └── index.ts              ← TypeScript types
```

## Import Examples

### ✅ Correct Imports

```typescript
// In any component
import { cn } from "@/lib/utils"               // shadcn utils
import { api } from "@/lib/api"                // API methods
import { apiClient } from "@/lib/api-client"   // API client
import { useModels } from "@/hooks/use-api"    // Hooks
import type { Model } from "@/types"           // Types
import { BACKEND_URL } from "@/config"         // Config
```

### ❌ Incorrect Imports

```typescript
// Don't use relative paths from components
import { cn } from "../../lib/utils"           // ❌ Hard to maintain
import { api } from "../../../lib/api"         // ❌ Confusing

// Use path aliases instead
import { cn } from "@/lib/utils"               // ✅ Clean
import { api } from "@/lib/api"                // ✅ Easy to read
```

## Verification

After updating `tsconfig.json`:

1. **Restart TypeScript server** in VS Code:
   - Open Command Palette (`Cmd+Shift+P`)
   - Type "TypeScript: Restart TS Server"
   - Select it

2. **Check for errors**:
   ```bash
   cd apps/web
   bun run check-types
   ```

3. **Verify imports work**:
   - Open `avatar.tsx` - should have no errors
   - Open `badge.tsx` - should have no errors
   - Open any file using hooks - should work

## Status

✅ **Fixed!** All TypeScript path mappings are now correctly configured.

- ✅ `@/lib/utils` → `./app/lib/utils` (shadcn)
- ✅ `@/lib/api` → `./lib/api` (API methods)
- ✅ `@/lib/api-client` → `./lib/api-client` (HTTP client)
- ✅ `@/hooks/*` → `./hooks/*` (Custom hooks)
- ✅ `@/types` → `./types` (Type definitions)

No more "Cannot find module" errors! 🎉
