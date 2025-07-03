<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { routes } from './router';
import useBreevSeshStore from './stores/breevSeshstore';
import { useRoute } from 'vue-router';
const breevSeshStore = useBreevSeshStore();
const { isActiveSesh } = storeToRefs(breevSeshStore);
const route = useRoute();

</script>

<template>
    <v-app>
        <v-app-bar v-if="route.path === '/' && !isActiveSesh" flat>
            <v-btn class="text-none" icon="mdi-chevron-left" size="x-large" :to="'/latest'" variant="text">
            </v-btn>
        </v-app-bar>

        <!-- bottom nav  -->
        <v-bottom-navigation v-if="!isActiveSesh && route.path !== '/latest'" mode="shift">
            <v-btn v-for="r in routes.filter(r => r.path !== '/latest')" :key="r.path" :to="r.path" class="text-none">
                <v-icon>{{ r.icon }}</v-icon>
                <span>{{ r.name }}</span>
            </v-btn>
        </v-bottom-navigation>
        <v-main class="d-flex align-center justify-center" style="height: calc(100vh - 56px); overflow: hidden;">
            <v-container class="d-flex flex-column align-center justify-center" fluid>
                <RouterView />
            </v-container>
        </v-main>

    </v-app>
</template>
