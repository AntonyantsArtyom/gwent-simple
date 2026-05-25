enum PagesEnum {
  all_events = "/all_events",
  tournament_grid = "/tournament_grid",
  news = "/news",
  merch = "/merch",
  tickets = "/tickets",
}

export const Pages: PagesEnum[] = [PagesEnum.all_events, PagesEnum.tournament_grid, PagesEnum.news, PagesEnum.merch, PagesEnum.tickets];

export const TITLES_MAP: Record<PagesEnum, string> = {
  "/all_events": "ВСЁ О МЕРОПРИЯТИИ",
  "/tournament_grid": "СЕТКА",
  "/news": "НОВОСТИ",
  "/merch": "МЕРЧ",
  "/tickets": "БИЛЕТЫ НА ТУРНИР",
};
