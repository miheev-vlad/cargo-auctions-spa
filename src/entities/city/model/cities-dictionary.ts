export interface CityDictItem {
  name: string;
  gc_id: number;
}

export const CITIES_DICTIONARY: CityDictItem[] = [
  { name: "Москва", gc_id: 100 },
  { name: "Санкт-Петербург", gc_id: 101 },
  { name: "Казань", gc_id: 102 },
  { name: "Екатеринбург", gc_id: 103 },
  { name: "Новосибирск", gc_id: 104 },
  { name: "Ростов-на-Дону", gc_id: 105 },
  { name: "Краснодар", gc_id: 106 },
  { name: "Воронеж", gc_id: 107 },
  { name: "Самара", gc_id: 108 },
  { name: "Уфа", gc_id: 109 },
  { name: "Пермь", gc_id: 59 },
  { name: "Нижний Новгород", gc_id: 110 },
];

export const cityByName = (name?: string | null): CityDictItem | undefined =>
  name ? CITIES_DICTIONARY.find((c) => c.name === name) : undefined;
