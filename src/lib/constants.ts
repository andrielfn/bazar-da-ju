export const CATEGORIES = {
  moveis: "Móveis",
  eletronicos: "Eletrônicos",
  cozinha: "Cozinha",
  decoracao: "Decoração",
  roupas: "Roupas",
  outros: "Outros",
} as const;

export const CONDITIONS = {
  novo: "Novo",
  bom_estado: "Bom estado",
  com_defeito: "Com defeito",
} as const;

export const ITEM_STATUS = {
  disponivel: "Disponível",
  reservado: "Reservado",
  vendido: "Vendido",
} as const;

export const RESERVATION_STATUS = {
  ativa: "Pendente",
  cancelada: "Cancelada",
  concluida: "Concluída",
} as const;

export type Category = keyof typeof CATEGORIES;
export type Condition = keyof typeof CONDITIONS;
export type ItemStatus = keyof typeof ITEM_STATUS;
export type ReservationStatus = keyof typeof RESERVATION_STATUS;

export const MAX_PHOTOS = 5;
export const MAX_RESERVATIONS_PER_PHONE = 5;
