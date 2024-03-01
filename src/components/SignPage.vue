<template>
    <div id="login-page">
        <div v-if="signPage == 'in'">
            <h1>{{ actionTitle }}</h1>
            <input class="textbox" v-model="unameLogin" type="text" placeholder="User Name" ref="unameInputSI" autofocus required />
            <input class="textbox" v-model="pwdLogin" type="password" placeholder="Password" required />
            <SignCaptcha ref="captchaIn" :belongsTo="'sign-in'"></SignCaptcha>
            <button class="btnUpIn" v-if="enableSignIn" @click="Login()">{{ btnText }}</button>
            <p id="to-sign-up"> Don't have an account? <a href="#" @click="ToSignUpOrResetPwdPage('Sign Up')">Sign up here</a> </p>
            <p id="to-reset-pwd"> Forget your password? <a href="#" @click="ToSignUpOrResetPwdPage('Reset Password')">Reset password</a> </p>
        </div>

        <!-- [Sign Up] & [Reset Password] share same page -->
        <div v-if="signPage == 'up'">
            <h1>{{ actionTitle }}</h1>
            <input class="textbox" v-model="unameReg" type="text" placeholder="User Name" ref="unameInputSU" required />
            <input class="textbox" v-model="emailReg" type="email" placeholder="Email" required />
            <input class="textbox" v-model="pwdReg" type="password" :placeholder="`Password: (${pwdRule})`" required />
            <input class="textbox" v-model="confirmReg" type="password" placeholder="Confirm Password" required />
            <SignCaptcha ref="captchaUp" :belongsTo="'sign-up'"></SignCaptcha>
            <button class="btnUpIn" v-if="enableSignUpOrReset" @click="Apply(actionTitle)">{{ btnText }}</button>
            <p id="to-sign-in"> Already have an account? <a href="#" @click="ToSignInPage('Sign In')">Sign in here</a> </p>
        </div>

        <!-- [Sign Up] & [Reset Password] share same verification page -->
        <div v-if="signPage == 'verify'">
            <h1>Email Verification</h1>
            <input class="textbox" v-model="unameReg" required readonly />
            <input class="textbox" v-model="codeReg" type="text" placeholder="Verification Code In Your Email" ref="codeInput" required />
            <button class="btnUpIn" @click="EmailVerification(actionTitle == 'Sign Up')">Verify</button>
            <button class="btnResend" @click="Apply(actionTitle)">Resend</button>
        </div>
    </div>
    <Loader id="loader" v-if="loading" />
</template>

<script setup lang="ts">

import { useCookies } from "vue3-cookies";
import { notify } from "@kyvg/vue3-notification";
import SignCaptcha from "@/components/CaptchaNew.vue"
import Loader from "@/components/Loader.vue"
import { loginToken, postLogin, postSignUp, postResetPwd, postEmailVerify, getPwdRule, CaptchaOK } from "@/share/share";
import { Domain, URL_VIEW } from "@/share/ip";
import { isEmailFormat } from "@/share/util";

const { cookies } = useCookies();

const loading = ref(false);
const signPage = ref("in"); // page
const pwdRule = ref("");
const actionTitle = ref("Sign In");
const btnText = ref("Sign In")

const unameLogin = ref("");
const pwdLogin = ref("");
const unameReg = ref("");
const emailReg = ref("");
const pwdReg = ref("");
const confirmReg = ref("");
const codeReg = ref("");

const clearInput = () => {
    unameLogin.value = ""
    pwdLogin.value = ""
    unameReg.value = ""
    emailReg.value = ""
    pwdReg.value = ""
    confirmReg.value = ""
    codeReg.value = ""
}

// if '() => {}'', must have 'return' in {}
const enableSignIn = computed(() => unameLogin.value.length > 0 && pwdLogin.value.length > 0 && CaptchaOK.value)

const enableSignUpOrReset = computed(() =>
    unameReg.value.length > 0 &&
    isEmailFormat(emailReg.value) &&
    pwdReg.value.length > 0 && (pwdReg.value === confirmReg.value) &&
    CaptchaOK.value
)

// for UI
const unameInputSI = ref();
const unameInputSU = ref();
const codeInput = ref();
const captchaIn = ref();
const captchaUp = ref();

let mounted = false;

onMounted(async () => {
    const de = await getPwdRule();
    if (de.error != null) {
        notify({
            title: "Cannot fetch password rule as placeholder",
            text: de.error,
            type: "error"
        })
        return
    }
    pwdRule.value = de.data
    mounted = true;
})

watchEffect(async () => {

    captchaIn?.value?.setupUI(unameInputSI.value.offsetLeft)

    const page = signPage.value;
    const nameSI = unameInputSI?.value;
    const nameSU = unameInputSU?.value;
    const code = codeInput?.value;

    if (mounted) {
        switch (page) {
            case "in":
                nameSI?.focus();
                CaptchaOK.value = false;
                captchaIn?.value?.setupUI(nameSI.offsetLeft)
                break;

            case "up":
                nameSU?.focus();
                CaptchaOK.value = false;
                captchaUp?.value?.setupUI(nameSU.offsetLeft)
                break;

            case "verify":
                code?.focus();
                break
        }
    }
})

const ToViewSite = async () => {

    // *** no longer use 'URL with auth' ***
    // location.replace(`${URL_VIEW}?auth=${loginToken.value}`)

    // *** auth now with cookie ***
    cookies.set("token", `${loginToken.value}`, "1d", "/", "." + Domain, false, "Lax"); // cookies.set("myCookie", "John Doe", "1d", "/", "", false, "Lax"); document.cookie = "myCookie=John Doe;SameSite=None;secure=false"
    location.replace(`${URL_VIEW}`)
}

const Login = async () => {
    loading.value = true;
    const de = await postLogin(unameLogin.value, pwdLogin.value)
    if (de.error != null) {
        loading.value = false;
        notify({
            title: "Login Failed",
            text: de.error,
            type: "error" // "warn", "error", "success"
        })
        return
    }
    loginToken.value = de.data.token; // without "Bearer "
    ToViewSite()
    loading.value = false;
};

const Apply = async (action: string) => {

    loading.value = true;

    // action is from {{ actionTitle }}
    if (action == "Sign Up") {
        const de = await postSignUp(unameReg.value, emailReg.value, pwdReg.value, true)
        if (de.error != null) {
            loading.value = false;
            notify({
                title: "Sign Up Failed",
                text: de.error,
                type: "error"
            })
            return
        }
    } else if (action == "Reset Password") {
        const de = await postResetPwd(unameReg.value, emailReg.value, "", pwdReg.value, true)
        if (de.error != null) {
            loading.value = false;
            notify({
                title: "Reset Password Failed",
                text: de.error,
                type: "error"
            })
            return
        }
    }

    notify({
        title: "Notice",
        text: `verification code sent to your email ${emailReg.value}`,
        type: "success"
    })
    ToEmailVerifyPage();
    loading.value = false;
};

const EmailVerification = async (check: boolean) => {
    loading.value = true;
    const de = await postEmailVerify(unameReg.value, codeReg.value, check)
    if (de.error != null) {
        loading.value = false;
        notify({
            title: "Email Verification Failed",
            text: de.error,
            type: "error"
        })
        return
    }
    notify({
        // title: "Notice",
        text: check ? "Email Verified, Signed Up" : "Password Reset",
        type: "success"
    })
    ToSignInPage('Sing In');
    loading.value = false;
};

const ToSignInPage = (t: string) => {
    actionTitle.value = t;
    btnText.value = t;
    signPage.value = "in";
    clearInput();
};

const ToSignUpOrResetPwdPage = (t: string) => {
    actionTitle.value = t;
    btnText.value = t;
    signPage.value = "up";
    clearInput();
};

const ToEmailVerifyPage = () => {
    signPage.value = "verify";
    // clearInput();
};

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1 {
    margin-bottom: 3%;
}

#login-page {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 36%;
    height: 32%;
    background-color: white;
    opacity: 0.95;
    border-radius: 25px;
}

.textbox {
    margin-bottom: 2%;
    width: 90%;
}

.btnUpIn {
    float: right;
    margin-right: 4.5%;
    margin-bottom: 5%;
}

.btnResend {
    float: right;
    margin-right: 2%;
    margin-bottom: 5%;
}

#to-sign-in {
    position: absolute;
    right: 5%;
    bottom: 0%;
    font-size: small;
}

#to-sign-up {
    position: absolute;
    right: 5%;
    bottom: 6%;
    font-size: small;
}

#to-reset-pwd {
    position: absolute;
    right: 5%;
    bottom: 0%;
    font-size: small;
}

#loader {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
</style>
