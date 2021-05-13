interface Pagination {
  count: number;
  next: string;
  previous: string;
}

export interface GamesPagination extends Pagination {
  results: GamesCardModel[];
}

export interface GamesCardModel {
  id: number;
  name: string;
  metacritic: number;
  background_image: string;
}

export interface GameModel extends GamesCardModel {
  released: string;
  developers: [{ name: string; slug: string }];
  tags: [{ name: string }];
  description_raw: string;
  platforms: [{ platform: { name: string } }];
  genres: [{ name: string; slug: string }];
  website: string;
  publishers: [{ name: string; slug: string }];
}

export interface GenresPagination extends Pagination {
  results: GenresModel[];
}

export interface GenresModel {
  name: string;
  slug: string;
}
