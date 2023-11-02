<template>
    <div class="container">
        <Captcha ref="refCode" :width="90" :height="22" :bgColor="'rgba(50,50,50,0.2)'" :borderColor="'#5f5f5f'" />
        <input ref="replyInput" v-model="reply">
    </div>
</template>

<script setup lang="ts">

import Captcha, { CaptchaInstance } from 'vue3-captcha';
import { CaptchaOK } from "@/share/share";

const refCode = ref<CaptchaInstance>(null)
const reply = ref('')

const props = defineProps({
    belongsTo: String
})

// for style
const dyTop = ref('')
const dxLeft = ref('')

// for UI focus
const replyInput = ref()

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
    const r = reply.value;
    if (mounted) {
        CaptchaOK.value = r.length > 0 && c?.check(r)
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
