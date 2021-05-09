<template>
  <q-page class="q-pa-md q-gutter-md">
    <div class="q-px-xl q-py-md text-h5">
      Detail Page
    </div>
    <div v-if="!loading">
      <div class="row q-px-md q-gutter-xl justify-center">
        <div class="col-4">
          <q-img :src="game.background_image" spinner-color="white" class="img">
            <template v-slot:error>
              <div class="absolute-full flex flex-center bg-grey-8 text-white">
                Cannot load image
              </div>
            </template>
          </q-img>
        </div>
        <div class="col-7">
          <div class="row">
            <div class="col text-h6">
              {{ game.name }}
            </div>

            <div
              class="col-auto q-mr-md text-body2 q-pa-sm metacritic self-center roboto-mono-font"
              :class="ratingColor(game.metacritic)"
            >
              {{ game.metacritic ? game.metacritic : '??' }}
            </div>
          </div>
          <div class="flex q-mt-sm no-wrap">
            <div class="text-weight-bold text-body2">
              Release Date: &nbsp;
            </div>
            {{ game.released }}
          </div>
          <div class="q-mt-md text-body1">
            {{ game.description_raw }}
          </div>
        </div>
      </div>
      <div class="row q-px-xl q-py-md justify-between">
        <div class="col-auto">
          <DetailsFields label="Platforms" :value="gamePlatforms" />
        </div>
        <div class="col-auto">
          <DetailsFields label="Genres" :value="gameGenres" />
        </div>
        <div class="col-auto">
          <DetailsFields label="Developers" :value="gameDevelopers" />
        </div>
        <div class="col-auto">
          <DetailsFields label="Publisher" :value="gamePublishers" />
        </div>
        <div class="col-auto">
          <DetailsFields label="Website" :value="game.website" />
        </div>
        <div class="col-12">
          <DetailsFields label="Tags" :value="gameTags" />
        </div>
      </div>
      <div>
        <div class=" text-h6 text-weight-bold flex justify-center q-mt-xl">
          Related Games
        </div>
        <div class="row justify-evenly">
          <div v-for="relatedGame in relatedGames" :key="relatedGame.id">
            <GameCard :game="relatedGame" />
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <div class="flex justify-center">
        <q-spinner-dots color="primary" size="40px" />
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import Vue from 'vue';
import { axiosInstance } from 'boot/axios';
import { AxiosError, AxiosResponse } from 'app/node_modules/axios';
import {
  GameImagesModel,
  GameModel,
  GamesCardModel,
  GamesPagination
} from 'src/models/models';
import DetailsFields from 'components/DetailsFields.vue';
import GameCard from 'components/GameCard.vue';

export default Vue.extend({
  name: 'GameDetailsPage',
  components: {
    DetailsFields,
    GameCard
  },
  data() {
    const game: GameModel = {
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
    };
    const images: GameImagesModel[] = [];
    const gamePlatforms = '';
    const gameGenres = '';
    const gameDevelopers = '';
    const gamePublishers = '';
    const gameTags = '';
    const relatedGames: GamesCardModel[] = [];
    const loading = false;
    return {
      game,
      images,
      gamePlatforms,
      gameGenres,
      gameDevelopers,
      gamePublishers,
      gameTags,
      relatedGames,
      loading
    };
  },
  mounted(): void {
    this.loadData();
  },
  methods: {
    loadData(): void {
      this.loading = true;
      axiosInstance
        .get(`games/${this.$route.params.id}?key=${process.env.key || ''}`)
        .then((response: AxiosResponse) => {
          this.game = response.data as GameModel;

          this.gamePlatforms = this.game.platforms
            .map(p => p.platform.name)
            .join(', ');

          this.gameGenres = this.game.genres.map(p => p.name).join(', ');

          this.gameDevelopers = this.game.developers
            .map(p => p.name)
            .join(', ');

          this.gamePublishers = this.game.publishers
            .map(p => p.name)
            .join(', ');

          this.gameTags = this.game.tags.map(p => p.name).join(', ');

          const searchRelatedDevelopers = this.game.developers
            .map(p => p.slug)
            .join(',');

          const searchRelatedPublishers = this.game.publishers
            .map(p => p.slug)
            .join(',');

          const searchRelatedGenres = this.game.genres
            .map(p => p.slug)
            .join(',');

          axiosInstance
            .get(
              `games?key=${process.env.key ||
                ''}&page_size=3&developers=${searchRelatedDevelopers}&publishers=${searchRelatedPublishers}&genres=${searchRelatedGenres}`
            )
            .then((response: AxiosResponse) => {
              this.relatedGames = (response.data as GamesPagination).results;
            })
            .catch((error: AxiosError) => {
              throw error;
            })
            .finally(() => {
              this.loading = false;
            });
        })
        .catch((errors: AxiosError) => {
          throw errors;
        });
    },
    //change the color of the metacritic depending on the rating
    ratingColor(metacritic: number): string {
      if (metacritic > 60) {
        return 'text-green';
      } else if (metacritic > 30) {
        return 'text-yellow';
      }

      return 'text-red';
    }
  }
});
</script>
