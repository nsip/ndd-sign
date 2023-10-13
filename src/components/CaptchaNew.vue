<template>
    <div class="container">
        <img :src="captchaSrc" alt="captcha image" width="120" height="40" @click="imageClicked">
        <input ref="replyInput" maxlength="4" v-model="reply">
    </div>
</template>

<script setup lang="ts">

import { CaptchaOK, getCaptchaImage, putCaptchaValidate } from "@/share/share";

let captchaId = ''
const captchaSrc = ref('') // base64, from api
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

    captchaId = await updateCaptcha('');

    mounted = true;
})

watchEffect(async () => {
    const r = reply.value;
    if (mounted) {
        const vr = await putCaptchaValidate(captchaId, r)
        if (vr.error == null) {
            // console.log(vr.data)
            CaptchaOK.value = vr.data
        }
    }
})

const setupUI = (left: Number) => {
    dxLeft.value = left + 'px'
}

defineExpose({
    setupUI,
})

const updateCaptcha = async (rid: string) => {
    const captchaRet = await getCaptchaImage(rid)
    if (captchaRet.error == null) {
        captchaSrc.value = captchaRet.data.base64
        return captchaRet.data.id
    } else {
        alert(captchaRet.error)
    }
    return null
}

const imageClicked = async () => {
    captchaId = await updateCaptcha('');
    reply.value = '';
}

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
    font-size: larger;
}
</style>
