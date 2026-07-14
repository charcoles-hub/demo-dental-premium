# Plantilla dental premium parametrizable — diseño

## Contexto

El pipeline de captación por email frío (ver memoria `negocio_ia_autonomo`) usa hoy 4 demos Astro hechas a mano (dental-sereno, veterinaria-manada, fisio-vital, barbería-navaja) reutilizadas sin cambios entre cientos de leads. El CTR de los emails es muy bajo (3 clicks de 48 enviados). Ya se mejoró el copy del email (imagen preview clicable), pero Sergio quiere ir más allá: que la demo en sí sea tan personalizada e impactante que "no les quede otra que contactar".

Los leads cubren muchos rubros (dental, veterinaria, abogados, gestoría, arquitectos, fisioterapia, psicología, autoescuela, inmobiliaria, óptica, estética...). Dental es el segmento mayor con diferencia (27+ leads solo en tandas 1-2, más en tanda3-ampliada de 291).

Ya existe un patrón de plantilla data-driven (`landing-factory`, un `site.ts` por cliente) pero es el tier visual económico — no el nivel premium que se busca aquí.

## Alcance de este proyecto

**Dentro:** diseñar y construir **una sola plantilla** Astro premium, muy elaborada, parametrizable por lead, para el rubro **dental** (el de mayor volumen). Se valida con **un lead de ejemplo**. Esta plantilla se convierte en el patrón de referencia para replicar a otros rubros más adelante.

**Fuera de alcance (segunda ronda, brainstorming separado):**
- El script/pipeline que lea los leads reales del CSV/Google Sheet, genere las páginas de los 291+ leads y actualice la columna `LinkDemo` de la hoja `leads-mail-merge`.
- Plantillas para otros rubros (veterinaria, gestoría, abogados, etc).
- Decisión de si `demo-dental-sereno` se retira o convive con la nueva.

## Repo

Nuevo repo **`demo-dental-premium`** (separado de `demo-dental-sereno`), para no arriesgar el email en marcha mientras se construye y valida la nueva plantilla. Migración/retirada de `demo-dental-sereno` se decide después, no aquí.

## Datos a personalizar por lead

- `negocio` (nombre del negocio)
- `ciudad`
- `telefono`
- `foto` (URL de imagen real del negocio) — **opcional**, añadido tras la primera iteración: sin foto/señal visual real del rubro, la demo no se leía como "clínica dental" a simple vista. En la segunda ronda no todos los leads tendrán foto disponible (CSV/web/Maps), así que el diseño debe tener un fallback sólido cuando `foto` esté ausente, no solo el camino feliz con foto.

No se incluye `PrimeraLinea` (queda en el email, no en la demo) ni contenido generado por IA por lead — eso sigue descartado para esta fase.

## Arquitectura técnica

- **Astro con ruta dinámica** (`getStaticPaths()`): cada lead es una entrada en un archivo de datos local `src/data/leads.ts`, con forma `{ slug, negocio, ciudad, telefono }`.
- Astro genera una **página estática real** por lead en `src/pages/c/[slug].astro` (ej. `/c/varchi-clinica`), no personalización por query string en cliente — se ve 100% real, carga instantánea, meta/og tags correctos si alguien la comparte.
- Para esta fase, `leads.ts` contiene **una sola entrada de ejemplo** (dato ficticio de una clínica dental).
- Mismo stack de deploy que los repos hermanos: Astro + GitHub Pages vía GitHub Actions (`withastro/action`, Node ≥22 — Astro lo exige). Gotchas ya conocidos a respetar: no trackear symlink `node_modules` (rompe `npm ci`), no usar `pkill` en scripts de despliegue (aborta con señal 144).
- Esta forma dejará el terreno listo para que la segunda ronda solo tenga que ampliar `leads.ts` con las filas reales y correr el build — sin tocar la plantilla.

## Brief creativo (para Fable)

**Primera iteración descartada (2026-07-14):** concepto "La página amanece" (hero nocturno + sol naciendo sobre horizonte-sonrisa, animación elaborada, mobile impecable, todas las reglas anti-slop respetadas). Técnicamente sólido y bien ejecutado, pero rechazado por Sergio: era puramente metafórico, sin ningún elemento que se leyera como "clínica dental" a simple vista, y no dejaba hueco a que cada negocio real se sintiera reconocible más allá del nombre.

Libertad de diseño total: **sin** anclarse al look de `dental-sereno` actual, **sin** referencia externa impuesta por Sergio. Mandatos no negociables (revisados):

1. **Que se lea como clínica dental de un vistazo** — nuevo mandato explícito. La dirección artística no puede ser tan abstracta que pierda el rubro; usar la `foto` del negocio cuando exista como ancla visual real, y un fallback (iconografía/ilustración dental, no genérica) cuando no exista.
2. **Animación elaborada**: scroll storytelling, micro-interacciones, transiciones — el nivel "de otro mundo" pedido, no el scroll-reveal básico que ya tiene `landing-factory`.
3. **Mobile impecable**: mobile-first real, no una versión responsive de compromiso. La mayoría de aperturas del email vendrán de móvil.

Restricción de estilo heredada del negocio (reglas anti-slop ya validadas, ver memoria `negocio_ia_autonomo`): nada de cian clínico, crema+serif+terracota, negro+verde-ácido, eyebrow en cada sección, ni tarjetas idénticas repetidas. Fuera de eso, criterio libre de Fable.

## Validación

Patrón ya usado en el proyecto (ver memoria `feedback_metodologia_visual` y `feedback_no_design_decisions_solo`): generar → capturas headless (viewport desktop y móvil) → revisar con Sergio → iterar. La plantilla no se da por terminada hasta que Sergio apruebe las capturas — ninguna decisión de diseño se toma en solitario.

## Criterio de éxito de esta fase

La plantilla queda lista para pasar a "segunda ronda" (pipeline masivo) cuando:
- Existe una página `/c/<slug>` generada y desplegada con el lead de ejemplo, con animación elaborada y mobile validado por capturas.
- Sergio ha aprobado el resultado visual.
- La estructura de datos (`leads.ts`) es trivial de ampliar con más entradas sin tocar el resto del código.
