export enum PagesEnum {
  all_events = "/all_events",
  tournament_grid = "/tournament_grid",
  news = "/news",
  merch = "/merch",
  rooms = "/rooms",
}

export const Pages: PagesEnum[] = [PagesEnum.all_events, PagesEnum.tournament_grid, PagesEnum.news, PagesEnum.merch, PagesEnum.rooms];

export const TITLES_MAP: Record<PagesEnum, string> = {
  "/all_events": "ВСЁ О МЕРОПРИЯТИИ",
  "/tournament_grid": "СЕТКА",
  "/news": "НОВОСТИ",
  "/merch": "МЕРЧ",
  "/rooms": "ИГРАТЬ",
};
