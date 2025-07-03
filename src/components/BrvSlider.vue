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
    <v-container class=" flex-col full-width pa-0">
        <div class="flex items-end w-full">
            <!-- number  -->
            <span class="text-2xl translate-y-[2px]">{{ model }}</span>

            <!-- label  -->
            <div class="text-caption ml-1">
                {{ label }}
            </div>
        </div>

        <!-- slider  -->
        <v-slider show-ticks="always" variant="compact" v-model="model" :min="min" :max="max" :step="step" />
    </v-container>

</template>