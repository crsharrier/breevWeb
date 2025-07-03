<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue';
import p5 from 'p5';
import useBreevSesh from './useBreevSesh';
import useBreevSeshStore from '../stores/breevSeshstore';
import { storeToRefs } from 'pinia';


const breevSeshStore = useBreevSeshStore();
const { mainText, subText, isActiveSesh, isBreathingIn, isHoldingBreath } = storeToRefs(breevSeshStore);
const { startSesh, cancelSesh, endHoldBreath } = useBreevSesh();

const sketchContainer = ref(null);
let p5Instance: p5 | null = null;

const HEIGHT = 600;
const WIDTH = 400;


onMounted(() => {
    const sketch = (p: any) => {
        let currentRadius = 50;
        let currentRadius2 = 50;
        let targetRadius = 200;
        const minRadius = 20;
        const maxRadius = WIDTH;

        p.setup = () => {
            p.createCanvas(WIDTH, HEIGHT);
        };

        p.draw = () => {
            p.background(255);

            // Set target radius based on breathingIn
            targetRadius = isBreathingIn.value ? maxRadius : minRadius;

            // Smooth interpolation
            currentRadius = p.lerp(currentRadius, targetRadius, 0.04);

            // Draw breathing circle
            p.noStroke();
            p.fill(100, 200, 255);
            p.ellipse(p.width / 2, p.height / 2.2, currentRadius);

            // Secondary circle: slightly delayed/staggered

            // Draw secondary breathing circle behind it
            currentRadius2 = p.lerp(currentRadius2, targetRadius * 0.98, 0.03);
            p.noStroke();
            p.fill(180, 220, 255, 180); // lighter blue with some transparency
            p.ellipse(p.width / 2, p.height / 2.2, currentRadius2);
        };
    };

    if (sketchContainer.value) {
        p5Instance = new p5(sketch, sketchContainer.value as HTMLElement);
    }
});

onBeforeUnmount(() => {
    if (p5Instance) {
        p5Instance.remove();
    }
});
</script>

<template>
    <!-- cancelSesh  -->
    <v-dialog v-if="isActiveSesh" max-width="500">
        <template #activator="{ props: activatorProps }">
            <v-btn v-bind="activatorProps" size="x-large" icon="mdi-close" variant="text"
                class="position-absolute top-0 right-0 ma-2 z-50" />
        </template>

        <template #default="{ isActive }">
            <v-card>
                <v-card-title class="text-h5">Cancel Sesh</v-card-title>
                <v-card-text>
                    Are you sure you want to cancel the session? Your progress will not be saved.
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-btn color="error" @click="cancelSesh(); isActive.value = false">Yes, Cancel</v-btn>
                    <v-btn @click="isActive.value = false">No, Continue</v-btn>
                </v-card-actions>
            </v-card>
        </template>
    </v-dialog>


    <!-- breev circle  -->
    <v-row class="w-100 h-100" dense>
        <v-col cols="12" class="d-flex justify-center">
            <div ref="sketchContainer" class="relative">
                <div class="absolute w-full left-0 top-0 h-2/3 flex flex-col items-center justify-end">
                    <v-btn v-if="!isActiveSesh" class="text-none bottom-0 absolute" color="primary" @click="startSesh">
                        Start Sesh
                    </v-btn>
                    <div v-else class="flex flex-col h-24 justify-start gap-4 items-center">
                        <span class="text-4xl font-bold text-gray-700">{{ mainText }}</span>
                        <span class="text-xl text-gray-700">{{ subText }}</span>
                    </div>
                    <v-btn v-if="isHoldingBreath" class="text-none bottom-button" color="secondary"
                        @click="endHoldBreath">
                        End hold
                    </v-btn>
                </div>
                <!-- DEBUG -->
                <!-- <div class="absolute bottom-full w-full flex justify-evenly">
            <span class="text-xs text-gray-500">Active Session: {{ isActiveSesh }}</span>
            <span class="text-xs text-gray-500">Breathing In: {{ isBreathingIn }}</span>
            <span class="text-xs text-gray-500">Holding Breath: {{ isHoldingBreath }}</span>
        </div> -->
            </div>
        </v-col>
    </v-row>
</template>