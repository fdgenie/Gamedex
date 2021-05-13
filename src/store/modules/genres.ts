import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { axiosInstance } from 'boot/axios';
import { AxiosError, AxiosResponse } from 'app/node_modules/axios';
import { MutationTree } from 'vuex';
import { GetterTree } from 'vuex';
import { GenresPagination } from 'src/models/models';

export interface GenresStateInterface {
  genrePagination: GenresPagination;
  loading: boolean;
}

function state(): GenresStateInterface {
  return {
    genrePagination: {
      count: 0,
      next: '',
      previous: '',
      results: []
    },
    loading: false
  };
}

const getters: GetterTree<GenresStateInterface, StateInterface> = {
  getGenrePagination(state: GenresStateInterface) {
    return state.genrePagination;
  },
  getLoading(state: GenresStateInterface) {
    return state.loading;
  }
};

const mutations: MutationTree<GenresStateInterface> = {
  setGenresPagination(state, payload: GenresPagination) {
    state.genrePagination = payload;
  },
  setLoading(state, payload: boolean) {
    state.loading = payload;
  }
};

const actions: ActionTree<string, StateInterface> = {
  getGenresDispatch({ commit }) {
    commit('setLoading', true);

    axiosInstance
      .get(`genres?key=${process.env.key || ''}`)
      .then((response: AxiosResponse) => {
        commit('setGenresPagination', response.data);
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
