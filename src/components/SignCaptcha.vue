<template>
    <div class="container">
        <Captcha ref="refCode" :width="90" :height="22" :bgColor="'rgba(50,50,50,0.2)'" :borderColor="'#5f5f5f'" />
        <input ref="answerInput" v-model="answer">
    </div>
</template>

<script setup lang="ts">

import Captcha, { CaptchaInstance } from 'vue3-captcha';
import { CaptchaOK } from "@/share/share";

const props = defineProps({
    belongsTo: String
})

const answer = ref('')
const refCode = ref<CaptchaInstance>(null)

// for style
const dyTop = ref('')
const dxLeft = ref('')

// for UI focus
const answerInput = ref()

let mounted = false;

onMounted(async () => {
    switch (props.belongsTo) {
        case 'sign-up':
            dyTop.value = '82%'
            break;
        case 'sign-in':
            dyTop.value = '55%'
            break;
    }
    mounted = true;
})

watchEffect(async () => {
    const c = refCode.value;
    const a = answer.value;
    if (mounted) {
        CaptchaOK.value = c?.check(a) && a.length > 0
    }
})

const setupUI = (left: Number) => {
    dxLeft.value = left + 'px'
}

defineExpose({
    setupUI,
})

</script>

<style scoped>
.container {
    display: flex;
    flex-direction: row;
    margin-left: v-bind(dxLeft);
}

input {
    margin-left: 1%;
    text-align: center;
    width: 70px;
}
</style>
