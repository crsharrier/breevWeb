<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
    label: string;
    min: number;
    max: number;
    step?: number;
}>();

const step = computed(() => props.step ?? 1);
const model = defineModel<number>();
</script>

<template>
    <v-container class=" flex-col full-width">
        <div class="flex items-end w-full">
            <!-- number  -->
            <div class="text-4xl pr-4">{{ model }}</div>

            <!-- label  -->
            <div class="text-caption pb-2">
                {{ label }}
            </div>
        </div>

        <!-- slider  -->
        <v-slider show-ticks="always" v-model="model" :min="min" :max="max" :step="step" />
    </v-container>

</template>