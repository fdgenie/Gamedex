import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { axiosInstance } from 'boot/axios';
import { AxiosError, AxiosResponse } from 'app/node_modules/axios';
import { MutationTree } from 'vuex';
import { GetterTree } from 'vuex';
import { GameModel, GamesPagination, GamesCardModel } from 'src/models/models';

export interface GameStateInterface {
  gamePagination: GamesPagination;
  gameDetails: GameModel;
  loading: boolean;
  relatedGames: GamesCardModel[];
}

function state(): GameStateInterface {
  return {
    gamePagination: {
      count: 0,
      next: '',
      previous: '',
      results: []
    },
    gameDetails: {
      id: 0,
      name: '',
      metacritic: 0,
      background_image: '',
      released: '',
      developers: [{ name: '', slug: '' }],
      tags: [{ name: '' }],
      description_raw: '',
      platforms: [{ platform: { name: '' } }],
      genres: [{ name: '', slug: '' }],
      website: '',
      publishers: [{ name: '', slug: '' }]
    },
    relatedGames: [],
    loading: false
  };
}

const getters: GetterTree<GameStateInterface, StateInterface> = {
  getGamePagination(state: GameStateInterface) {
    return state.gamePagination;
  },
  getGameDetails(state: GameStateInterface) {
    return state.gameDetails;
  },
  getLoading(state: GameStateInterface) {
    return state.loading;
  },
  getRelatedGames(state: GameStateInterface) {
    return state.relatedGames;
  }
};

const mutations: MutationTree<GameStateInterface> = {
  setGamesPagination(state, payload: GamesPagination) {
    state.gamePagination = payload;
  },
  setGameDetails(state, payload: GameModel) {
    state.gameDetails = payload;
  },
  setLoading(state, payload: boolean) {
    state.loading = payload;
  },
  setRelatedGames(state, payload: GamesPagination) {
    state.relatedGames = payload.results;
  }
};

const actions: ActionTree<string, StateInterface> = {
  getGamesDispatch(
    { commit },
    {
      currentPage,
      ordering,
      search,
      category
    }: {
      currentPage: number;
      ordering: string;
      search: string;
      category: string;
    }
  ) {
    commit('setLoading', true);

    let genre = '';

    if (category) genre = `genres=${category}`;

    axiosInstance
      .get(
        `games?key=${process.env.key ||
          ''}&page_size=10&page=${currentPage}&ordering=${ordering}&search=${search}${genre}`
      )
      .then((response: AxiosResponse) => {
        commit('setGamesPagination', response.data);
      })
      .catch((error: AxiosError) => {
        throw error;
      })
      .finally(() => {
        commit('setLoading', false);
      });
  },
  getGameDetailsDispatch({ commit }, { gameId }: { gameId: string }) {
    commit('setLoading', true);

    return axiosInstance
      .get(`games/${gameId}?key=${process.env.key || ''}`)
      .then((response: AxiosResponse) => {
        commit('setGameDetails', response.data);
        return response;
      })
      .catch((error: AxiosError) => {
        throw error;
      })
      .finally(() => {
        commit('setLoading', false);
      });
  },
  getRelatedGamesDispatch(
    { commit },
    {
      searchRelatedDevelopers,
      searchRelatedPublishers,
      searchRelatedGenres
    }: {
      searchRelatedDevelopers: string;
      searchRelatedPublishers: string;
      searchRelatedGenres: string;
    }
  ) {
    commit('setLoading', true);

    axiosInstance
      .get(
        `games?key=${process.env.key ||
          ''}&page_size=3&developers=${searchRelatedDevelopers}&publishers=${searchRelatedPublishers}&genres=${searchRelatedGenres}`
      )
      .then((response: AxiosResponse) => {
        commit('setRelatedGames', response.data);
      })
      .catch((error: AxiosError) => {
        throw error;
      })
      .finally(() => {
        commit('setLoading', false);
      });
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
