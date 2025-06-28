<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { routes } from './router';
import useBreevSeshStore from './stores/breevSeshstore';
const breevSeshStore = useBreevSeshStore();
const { isActiveSesh } = storeToRefs(breevSeshStore);
const { } = breevSeshStore;

</script>

<template>
    <v-app>
        <!-- bottom nav  -->
        <v-bottom-navigation v-if="!isActiveSesh" mode="shift">
            <v-btn v-for="r in routes" :key="r.path" :to="r.path" class="text-none">
                <v-icon>{{ r.icon }}</v-icon>
                <span>{{ r.name }}</span>
            </v-btn>
        </v-bottom-navigation>
        <v-main class="d-flex align-center justify-center">
            <v-container class="d-flex flex-column align-center justify-center" fluid>
                <RouterView />
            </v-container>
        </v-main>

    </v-app>
</template>
