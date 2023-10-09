<template>
    <div v-if="showPage">
        <SignPage />
        <div id="copyright">

            <!-- Copyright@2023 Education Services Australia | <a href="#" @click="ToPolicyPage()">Privacy Policy</a> -->

            Copyright © 2023 Education Services Australia.
            <a href="https://creativecommons.org/licenses/by/4.0/">
                <img src="https://mirrors.creativecommons.org/presskit/buttons/88x31/png/by.png" height="20" />
            </a>.
            <br>The contents of this page are derived from public domain sources and collaborative contributions from school authorities throughout Australia and New Zealand.
            <br>They are made available under a Creative Commons <a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a> license.

        </div>
    </div>
    <notifications position="top center" :speed="2000" :duration="6000" :closeOnClick="false" />
</template>

<script setup lang="ts">

import { notify } from "@kyvg/vue3-notification";
import SignPage from "@/components/NoSignUp_NoVerify.vue"; // No SignUP, No Verification. Only Reset Password Applies
import { getPing } from "@/share/share";
import { URL_API } from "@/share/ip";

const showPage = ref(false);

let mounted = false;

onMounted(async () => {
    // test backend api available
    const de = await getPing();
    if (de.error != null) {
        notify({
            title: "Backend Service is NOT Available",
            text: de.error,
            type: "error"
        })
        return
    }
    showPage.value = true

    mounted = true
});

const ToPolicyPage = () => { window.open(`${URL_API}/policy`) }

</script>

<style>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 10px;
}

body {
    background-image: url('assets/bg.jpg');
    background-repeat: no-repeat;
    background-attachment: fixed;
    background-size: cover;
}

#copyright {
    position: fixed;
    bottom: 0;
    width: 100%;
    margin-bottom: 10px;
}

@media (max-height: 480px) {
    #copyright {
        visibility: hidden;
    }
}

</style>
