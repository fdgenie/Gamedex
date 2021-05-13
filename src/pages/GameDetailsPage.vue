<template>
  <q-page :class="$q.platform.is.mobile ? '' : 'q-pa-md q-gutter-md'">
    <div class="q-px-xl q-py-md text-h5">
      Detail Page
    </div>

    <!-- Game Description -->
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

      <!-- Details  -->
      <div class="row q-px-xl q-py-md justify-between">
        <div class="col-autop">
          <DetailsFields
            label="Platforms"
            :value="getPlatformNameOfAnObject(game.platforms)"
          />
        </div>
        <div class="col-auto">
          <DetailsFields
            label="Genres"
            :value="getNameOfAnObject(game.genres)"
          />
        </div>
        <div class="col-auto">
          <DetailsFields
            label="Developers"
            :value="getNameOfAnObject(game.developers)"
          />
        </div>
        <div class="col-auto">
          <DetailsFields
            label="Publisher"
            :value="getNameOfAnObject(game.publishers)"
          />
        </div>
        <div class="col-auto">
          <DetailsFields label="Website" :value="game.website" />
        </div>
        <div class="col-12">
          <DetailsFields label="Tags" :value="getNameOfAnObject(game.tags)" />
        </div>
      </div>
      <div v-if="randomPage" class="flex justify-center">
        <q-btn color="primary" label="New Random" @click="goToRandomGame" />
      </div>

      <!-- Related Games -->
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
import { GameModel, GamesCardModel } from 'src/models/models';
import DetailsFields from 'components/DetailsFields.vue';
import GameCard from 'components/GameCard.vue';
import { AxiosResponse } from 'app/node_modules/axios';

export default Vue.extend({
  name: 'GameDetailsPage',
  components: {
    DetailsFields,
    GameCard
  },
  computed: {
    game(): GameModel {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      return this.$store.getters['games/getGameDetails'] as GameModel;
    },
    relatedGames(): GamesCardModel[] {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      return this.$store.getters['games/getRelatedGames'] as GamesCardModel[];
    },
    randomPage(): boolean {
      return this.$route.query['random'] !== undefined;
    },
    loading(): boolean {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      return this.$store.getters['games/getLoading'] as boolean;
    }
  },
  mounted(): void {
    this.loadData();
  },
  methods: {
    loadData(): void {
      void this.$store
        .dispatch('games/getGameDetailsDispatch', {
          gameId: this.$route.params.id
        })
        .then((res: AxiosResponse) => {
          const game = res.data as GameModel;

          const searchRelatedDevelopers = this.getSlugOfAnObject(
            game.developers
          );

          const searchRelatedPublishers = this.getSlugOfAnObject(
            game.publishers
          );

          const searchRelatedGenres = this.getSlugOfAnObject(game.genres);

          void this.$store.dispatch('games/getRelatedGamesDispatch', {
            searchRelatedDevelopers,
            searchRelatedPublishers,
            searchRelatedGenres
          });
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
    },
    //Go to a details page in a random game
    goToRandomGame() {
      const gameId = Math.floor(Math.random() * 54912);

      void this.$router.push({ path: `/game/${gameId}?random` });
      if (this.$route.path !== '/') this.$router.go(0);
    },
    //Get the slug of an object
    getSlugOfAnObject(slugObject: [{ slug: string }]): string {
      return slugObject.map(p => p.slug).join(',');
    },
    //Get the name of an object
    getNameOfAnObject(nameObject: [{ name: string }]): string {
      return nameObject.map(p => p.name).join(',');
    },
    //Get the platform name of an object
    getPlatformNameOfAnObject(
      nameObject: [{ platform: { name: string } }]
    ): string {
      return nameObject.map(p => p.platform.name).join(',');
    }
  }
});
</script>
