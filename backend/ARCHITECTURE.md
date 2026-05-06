# Arquitectura del Proyecto - Big Gamma Logística

## Principios Fundamentales

Este proyecto implementa el **Principio de Inversión de Dependencias (DIP)** de SOLID, estableciendo una separación clara entre las capas de aplicación y acceso a datos.

## Estructura de Capas

```
src/
├── common/
│   ├── interfaces/repositories/    # Contratos (abstracciones)
│   │   ├── i-product.repository.ts
│   │   ├── i-report.repository.ts
│   │   ├── i-user.repository.ts
│   │   └── i-photo.repository.ts
│   │
│   └── providers/repositories/     # Implementaciones concretas
│       ├── product.repository.ts
│       ├── report.repository.ts
│       ├── user.repository.ts
│       ├── photo.repository.ts
│       └── repositories.module.ts
│
├── [modulo]/                       # Módulos de funcionalidad
│   ├── [modulo].service.ts         # Lógica de negocio
│   ├── [modulo].controller.ts      # Endpoints
│   └── [modulo].module.ts          # Configuración
```

## Reglas y Convenciones

### 1. Restricción de Acceso a Prisma

**Regla:** Ningún archivo `*.service.ts` debe importar o inyectar `PrismaService` directamente.

**Motivo:** Los servicios deben depender de abstracciones (interfaces), no de implementaciones concretas.

**Correcto:**
```typescript
constructor(private productsRepo: IProductRepository) {}
```

**Incorrecto:**
```typescript
constructor(private prisma: PrismaService) {}
```

### 2. Acceso a Datos vía Repositorio

**Regla:** Toda lectura/escritura a la base de datos debe pasar obligatoriamente por el repositorio correspondiente.

**Flujo:**
```
Service → Interfaz (IProductRepository) → Implementación (ProductRepository) → Prisma
```

### 3. Inyección en Módulos de Funcionalidad

**Regla:** Para usar un repositorio en un servicio, el módulo que envuelve a dicho servicio debe importar `RepositoriesModule`.

**Ejemplo en ProductsModule:**
```typescript
@Module({
  imports: [RepositoriesModule],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
```

### 4. Guía para Nuevas Entidades

Cuando se cree una nueva tabla en Prisma, seguir este flujo:

**Paso 1:** Crear el contrato en `src/common/interfaces/repositories/i-[entity].repository.ts`

```typescript
import { SomeEntity, SomeType } from '@prisma/client';

export interface CreateEntityDto {
  // campos requeridos
  name: string;
}

export interface IEntityRepository {
  create(dto: CreateEntityDto): Promise<SomeEntity>;
  findAll(): Promise<SomeEntity[]>;
  findOne(id: string): Promise<SomeEntity | null>;
  update(id: string, dto: Partial<CreateEntityDto>): Promise<SomeEntity>;
  delete(id: string): Promise<void>;
}
```

**Paso 2:** Crear la implementación concreta en `src/common/providers/repositories/[entity].repository.ts`

```typescript
@Injectable()
export class EntityRepository implements IEntityRepository {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateEntityDto): Promise<SomeEntity> {
    return this.prisma.someEntity.create({
      data: dto as Prisma.SomeEntityCreateInput,
    });
  }

  // ... implementar el resto de métodos
}
```

**Paso 3:** Añadir y exportar el nuevo repositorio en `repositories.module.ts`

```typescript
@Module({
  imports: [PrismaModule],
  providers: [
    ProductRepository,
    ReportRepository,
    UserRepository,
    PhotoRepository,
    EntityRepository,  // ← nuevo
  ],
  exports: [
    ProductRepository,
    ReportRepository,
    UserRepository,
    PhotoRepository,
    EntityRepository,  // ← nuevo
  ],
})
export class RepositoriesModule {}
```

### 5. Gestión de Transacciones

**Recomendación futura:** A medida que el proyecto crezca, es posible que se necesiten transacciones que abarquen múltiples repositorios.

**Opciones a considerar:**

1. **Unit of Work Pattern:** Crear una clase que coordine múltiples repositorios
2. **Inyección de transacción:** Pasar el cliente de Prisma (TransactionClient) desde el servicio hacia los métodos del repositorio

**Patrón Unit of Work (ejemplo conceptual):**
```typescript
@Injectable()
export class UnitOfWork {
  constructor(private prisma: PrismaService) {}

  async execute<T>(fn: (tx: PrismaClient) => Promise<T>): Promise<T> {
    return this.prisma.$transaction(fn);
  }
}
```

## Beneficios de Esta Arquitectura

| Beneficio | Descripción |
|-----------|-------------|
| **Bajo acoplamiento** | Puedo cambiar Prisma por otro ORM sin modificar servicios |
| **Testabilidad** | Los servicios pueden recibir mocks de repositorios |
| **Flexibilidad** | Múltiples implementaciones (cache, logging, etc.) |
| **Organización** | Separación clara entre lógica de negocio y acceso a datos |
| **Mantenibilidad** | Nuevos desarrolladores tienen guía clara |

## Notas Adicionales

- Los repositorios pueden相互依赖 si necesitan datos relacionados, pero los servicios NO deben conocer la implementación interna de los repositorios.
- Usar `import type` al importar interfaces en servicios para evitar problemas con `emitDecoratorMetadata`.
- Mantener los DTOs de Prisma (tipos generados) separados de los DTOs de la aplicación.