# Claude Agent Instructions

## Code Generation Policy

For ALL code generation tasks, including adding new components, routes, or backend logic:

1.  **Always provide the complete code diff** for every file that needs to be changed
2.  **Do not use the `@agent` command** to split work into smaller tasks
3.  **Do not create or modify `AGENTS.md`** files

## Current State

**Current Agent Configuration:**
- ✅ Code Reviewer

**Action Required:**
None - Claude is already configured with the necessary agents for code review. No further agent setup is needed.

## Implementation Details

**Frontend Framework:**
- Next.js 16
- React 19
- TypeScript

**Styling:**
- Tailwind CSS v4
- TypeScript utility classes
-CSS custom properties for theming

**State Management:**
- Zustand
- React Context API

**API Communication:**
- Fetch API with axios
- Response caching strategy
- Error handling middleware

## Key Modules

### 1. Authentication Module
- Next.js API Routes for authentication
- Secure cookie-based session management
- Role-based access control
- OAuth 2.0 integration with Google

### 2. Inventory Management Module
- Real-time stock tracking
- Barcode scanning support
- Low stock notifications
- Batch/lot tracking

### 3. Order Management Module
- Order creation workflow
- Shipment tracking integration
- Invoice generation
- Return management

## Development Guidelines

### File Naming Convention
- Components: PascalCase (e.g., `UserProfile.tsx`)
- Hooks: camelCase with `use` prefix (e.g., `useAuth.ts`)
- Utility functions: camelCase (e.g., `formatDate.ts`)

### Tailwind CSS Patterns
- Use utility classes directly
- Apply responsive design with `sm:`, `md:`, `lg:` prefixes
- Dark mode via `dark:` prefix
- Custom theme variables in `tailwind.config.ts`

### API Interaction Pattern
```typescript
// Example API call
const apiResponse = await axios.get(`${NEXT_PUBLIC_API_URL}/items`);
```

### Error Handling
```typescript
try {
  // API call
} catch (error) {
  // Show toast notification
  // Log error to monitoring service
}
```

## Testing Requirements

### Unit Tests
- Jest with React Testing Library
- Each component should have at least one test
- Test edge cases and error states

### Integration Tests
- Test API interactions
- Validate form submissions
- Test navigation flow

## Performance Optimization

### Code Splitting
```typescript
const LazyComponent = dynamic(() => import('./components/HeavyComponent'), {
  loading: () => <Loader />,
});
```

### Memoization
```typescript
const MemoizedComponent = memo(MyComponent);
```

## Security Best Practices

### Environment Variables
```typescript
// .env.local
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Data Validation
- Validate all user inputs
- Sanitize all API inputs
- Use Zod schemas for data validation

## Debugging

### Network Requests
```typescript
// View API calls in browser dev tools
// Use React DevTools for component debugging
```

### Logging
```typescript
// Development: console.log with proper formatting
// Production: structured logging to monitoring service
```

## Common Patterns

### Responsive Grid
```html
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Grid items */}
</div>
```

### Dark Mode Support
```typescript
// Check system preference
const prefersDark = window.matchMedia &&
  window.matchMedia('(prefers-color-scheme: dark)').matches;
```

## Code Review Checklist

When reviewing code, check for:
- [ ] All file paths are correct
- [ ] Component names follow PascalCase
- [ ] TypeScript types are properly defined
- [ ] Tailwind classes are valid
- [ ] API calls use correct URL
- [ ] Error handling is implemented
- [ ] Responsive design is applied
- [ ] Performance optimizations used
- [ ] Security best practices followed
- [ ] Code follows project style guidelines

## Common Pitfalls

1. **Incorrect file paths** - Always verify paths before making changes
2. **Forgetting to export** - All components must be exported
3. **Mixing up camelCase and PascalCase** - Components must be PascalCase
4. **Not handling API errors** - API calls must have try/catch blocks
5. **Forgetting responsive design** - All layouts must be responsive

## Special Instructions

- **For API changes**: Update both frontend and backend
- **For UI changes**: Test on mobile and desktop
- **For performance changes**: Measure before and after
- **For security changes**: Follow security guidelines strictly
