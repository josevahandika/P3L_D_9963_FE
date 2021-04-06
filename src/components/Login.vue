<template>
        <main>
            <v-container fluid fill-height class="posisinya">
                <v-layout flex align-center justify-center>
                    <v-flex xs12 sm6 elevation-6>
                        <v-card style="borderRadius: '25px'">
                            <v-card-title class="pink lighten-3 justify-center">
                                Selamat datang di AKB Resto🍖🍗🥤
                            </v-card-title>
                            <v-card-text class="pt-4">
                                <div>
                                <v-form v-model="valid" ref="form">
                                    <v-text-field label="E-mail" v-model="email" :rules="emailRules"
                                    required></v-text-field>
                                    <v-text-field label="Password" v-model="password" type="password" min="8"
                                        :rules="passwordRules" counter required>
                                    </v-text-field>
                                    <v-layout justify-center>
                                        <v-btn class="mr-2" @click="submit"
                                            :class=" { 'grey darken-1 white--text' : valid, disabled: !valid }">Login
                                        </v-btn>
                                        <v-btn @click="clear"
                                            class="pink lighten-4 black--text">Cancel
                                        </v-btn>
                                    </v-layout>
                                </v-form>
                                </div>
                            </v-card-text>
                        </v-card>
                        <v-snackbar v-model="snackbar" :color="color" timeout="2000" bottom>
                            {{error_message}}
                        </v-snackbar>
                    </v-flex>
                </v-layout>
            </v-container>
        </main>
</template>
        <style>
                @import url("https://fonts.googleapis.com/css?family=Jolly%20Lodger");
                .grey--text {
                    font-family: "Jolly Lodger";
                }
                .posisinya {
                    position: absolute;
                    top: 20px;
                    left: 0px;
                    right: 0px;
                }
        </style>
<script>
        export default {
            name: "Login",
            data() {
                return {
                    load: false,
                    snackbar: false,
                    error_message: '',
                    color: '',
                    valid: false,
                    password: '',
                    passwordRules: [
                        (v) => !!v || 'Password tidak boleh kosong',
                    ],
                    email: '',
                    emailRules: [
                        (v) => !!v || 'E-mail tidak boleh kosong',
                    ],
                };
            },
            methods: {
                submit() {
                    if (this.$refs.form.validate()) { //cek apakah data yang akan dikirim sudah valid
                        this.load = true
                        this.$http.post(this.$api + '/login', {
                        email: this.email,
                        password: this.password
                        }).then(response => {
                            localStorage.setItem('id', response.data.user.id); //menyimpan id user yang sedang login
                            localStorage.setItem('token', response.data.access_token);//menyimpan auth token
                            localStorage.setItem('jabatan', response.data.user.jabatan);
                            this.snackbar=true;
                            this.color="green"
                            this.error_message=response.data.message;
                            this.load = false;
                            this.clear();
                            this.$router.push({
                            name: 'Dashboard'
                            })
                        }).catch(error => {
                            console.log(error.response.data);
                            this.snackbar=true;
                            this.color="red"
                            this.error_message=error.response.data.message;
                            localStorage.removeItem('token')
                            this.load = false
                        })
                    }
                },
                clear() {
                    this.$refs.form.reset() //Clear form login
                }
            },
        };
</script>