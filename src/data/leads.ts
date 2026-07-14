export type Lead = {
  slug: string;
  negocio: string;
  ciudad: string;
  telefono: string;
  /** URL de foto real del negocio (opcional; sin ella se usa la ilustración dental propia) */
  foto?: string;
};

export const leads: Lead[] = [
  {
    slug: 'clinica-dental-aurora',
    negocio: 'Clínica Dental Aurora',
    ciudad: 'Cornellà de Llobregat',
    telefono: '936000000',
    foto: 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?q=80&w=1600&auto=format&fit=crop',
  },
];
