# Sistema de Menú de Restaurante - Lista de Tareas

## Problemas Actuales





### 1. Creación de Restaurantes Duplicados 
# Usar archivo RestPrueba.png para probar


- **Problema**: El sistema está creando restaurantes duplicados con el mismo nombre cuando se suben los archivos del menu para que cree todo automaticamente
- **Correcciones Necesarias**:
  - [ ] Implementar verificación de unicidad antes de crear restaurantes
    - `src/lib/server/schema.ts` - Agregar restricción única a la tabla de restaurantes
    - `src/routes/api/seed/+server.ts` - Actualizar lógica de creación de restaurantes
    - `src/lib/components/menu-editor/restaurant/RestaurantInfo.svelte` - Agregar validación de nombres duplicados
  - [ ] Considerar el uso de restricciones únicas compuestas (userId + slug)
    - `src/lib/server/schema.ts` - Agregar restricción única compuesta
    - `drizzle/migrations/` - Crear nueva migración para la restricción
  - [ ] Agregar validación para prevenir nombres de restaurantes duplicados por usuario
    - `src/lib/utils/validation.ts` - Crear validación de nombres de restaurantes
    - `src/routes/api/restaurant/validate/+server.ts` - Crear endpoint de validación
  - [ ] Actualizar el frontend para manejar casos de restaurantes duplicados
    - `src/lib/components/menu-editor/restaurant/RestaurantInfo.svelte` - Agregar manejo de errores
    - `src/lib/stores/toast.ts` - Agregar mensajes de error específicos


### 2. Imagenes o pdfs de carta grandes, el proceso de generar el menu puede tardar demasiado
Hacer pruebas con varias cartas para ver cuanto tarda el proceso


### 2. Integración del Procesamiento de Imágenes
- **Problema**: Necesidad de automatizar la creación y procesamiento de imágenes
- **Tareas Requeridas**:
  - [ ] Implementar generación automática de imágenes para platos
    - `src/routes/api/images/generate/+server.ts` - Crear endpoint de generación de imágenes
    - `src/lib/services/dalle.ts` - Implementar integración con DALL-E
    - `src/lib/components/menu-editor/dish/DishEditor.svelte` - Agregar interfaz de generación de imágenes
  - [ ] Agregar pipeline de optimización de imágenes
    - `src/lib/services/image-processing.ts` - Crear servicio de procesamiento de imágenes
    - `src/routes/api/images/optimize/+server.ts` - Crear endpoint de optimización
    - Componentes a actualizar:
      - [ ] Comprimir imágenes - `src/lib/utils/image-compression.ts`
      - [ ] Generar diferentes tamaños - `src/lib/utils/image-resizer.ts`
      - [ ] Convertir a WebP - `src/lib/utils/image-converter.ts`
  - [ ] Configurar integración con CDN
    - `src/lib/services/cdn.ts` - Crear servicio de CDN
    - `src/lib/config/cdn.ts` - Agregar configuración de CDN
  - [ ] Agregar validación de carga de imágenes
    - `src/lib/utils/image-validation.ts` - Crear utilidades de validación
    - `src/routes/api/upload/+server.ts` - Actualizar endpoint de carga

## Próximos Pasos

### 1. Gestión de Restaurantes
- [ ] Agregar manejo de errores para restaurantes duplicados
  - `src/lib/components/menu-editor/MenuEditor.svelte`
  - `src/routes/api/restaurant/+server.ts`
  - `src/lib/stores/restaurant.ts`
- [ ] Implementar eliminación en cascada de restaurantes
  - `src/routes/api/restaurant/[id]/+server.ts`
  - `src/lib/server/schema.ts` - Agregar reglas de cascada
- [ ] Agregar funcionalidad de actualización de restaurantes
  - `src/routes/api/restaurant/[id]/+server.ts`
  - `src/lib/components/menu-editor/restaurant/RestaurantEditor.svelte`

### 2. Sistema de Imágenes
- [ ] Diseñar pipeline de procesamiento de imágenes
  - `src/lib/services/image-pipeline/`
    - `index.ts` - Orquestación del pipeline
    - `processors/` - Procesadores individuales
    - `validators/` - Validación de imágenes
- [ ] Configurar almacenamiento de imágenes
  - `src/lib/services/storage/`
    - `index.ts` - Interfaz de almacenamiento
    - `providers/` - Implementaciones de almacenamiento
- [ ] Crear servicio de optimización
  - `src/lib/services/optimization/`
    - `index.ts` - Servicio de optimización
    - `strategies/` - Diferentes estrategias de optimización

### 3. Actualizaciones del Esquema de Base de Datos
- [ ] Agregar nuevas restricciones e índices
  - `src/lib/server/schema.ts`
  - Nuevos archivos de migración:
    - `drizzle/migrations/[timestamp]_add_restaurant_constraints.sql`
    - `drizzle/migrations/[timestamp]_add_image_tables.sql`

### 4. Nuevos Componentes Necesarios
- [ ] Gestión de Imágenes
  - `src/lib/components/image/`
    - `ImageUploader.svelte`
    - `ImageEditor.svelte`
    - `ImageGallery.svelte`
- [ ] Gestión de Restaurantes
  - `src/lib/components/restaurant/`
    - `RestaurantValidator.svelte`
    - `DuplicateChecker.svelte`

### 5. Pruebas
- [ ] Agregar archivos de prueba
  - `tests/`
    - `integration/`
      - `restaurant.test.ts`
      - `image-processing.test.ts`
    - `unit/`
      - `validation.test.ts`
      - `image-optimization.test.ts`

## Notas
- La implementación actual crea restaurantes y procesa menús exitosamente
- Es necesario enfocarse en prevenir duplicados y mejorar el manejo de imágenes
- Considerar la implementación de un sistema de colas para el procesamiento de imágenes
- Investigar la implementación de una solución CDN adecuada

## Recursos
- [Documentación de SvelteKit](https://kit.svelte.dev/)
- [Mejores Prácticas de Procesamiento de Imágenes](https://web.dev/fast/#optimize-your-images)
- [Guías de Optimización de Base de Datos](https://neon.tech/docs/guides/performance)
- [Documentación de Drizzle ORM](https://orm.drizzle.team/)
- [Procesamiento de Imágenes con Sharp](https://sharp.pixelplumbing.com/)
- [Documentación de la API de DALL-E](https://platform.openai.com/docs/guides/images) 