<template>
         <div class="dashboard">
            <v-navigation-drawer v-model="drawer" class="fullheight pink lighten-4 black--text" width="256" app>
                <v-list-item>
                    <v-list-item-content>
                        <v-list-item-title class="title">Selamat Datang di AKB</v-list-item-title>
                        <v-list-item-subtitle> {{ jabatan }} </v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>
            
                <v-divider></v-divider>
            
                <v-list dense nav>
                    <v-list-item
                        v-for="item in items"
                        :key="item.title"
                        link
                        tag="router-link"
                        :to="item.to"
                        >
                        <v-list-item-content>
                            <v-list-item-title>{{ item.title }}</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-list>
            </v-navigation-drawer>
            <v-app-bar app fixed height="75px">
                <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
                <VSpacer />
                <v-toolbar-items>
                    <v-btn @click="btnlogout" text router><v-icon>mdi-power</v-icon></v-btn>
                </v-toolbar-items>
            </v-app-bar>
            <div class="fullheight pa-5">
                <router-view></router-view>
            </div>
        </div>
</template>
        <script>
            export default {
                name: "Dashboard",
                data() {
                    return {
                        jabatan: "",
                        drawer: true,
                        items: [
                            { title: "Karyawan", to: "/karyawan" },
                            { title: "Meja", to: "/meja" },
                            { title: "Bahan", to: "/bahan" },
                            { title: "Customer", to: "/customer" },
                            { title: "Bahan Harian", to: "/bahanharian" },
                            { title: "Detail Transaksi", to: "/detailtransaksi" },
                            { title: "Kartu", to: "/kartu" },
                            { title: "Menu", to: "/menu" },
                            { title: "Reservasi", to: "/reservasi" },
                            { title: "Riwayat Bahan Masuk", to: "/riwayatbahanmasuk" },
                            { title: "Riwayat Bahan Keluar", to: "/riwayatbahankeluar" },
                            { title: "Transaksi", to: "/transaksi" },
                        ],
                    };
                },
                methods: {
                    btnlogout() {           
                            localStorage.removeItem('id');  //menyimpan id user yang sedang login
                            localStorage.removeItem('email');  //menyimpan email user yang sedang login         
                            localStorage.removeItem('jabatan'); //menyimpan jabatan user yang sedang login
                            localStorage.removeItem('token');//menyimpan auth token
                            this.$router.push({
                            name: 'Login'
                            })
                        },
                },
                mounted(){
                    this.jabatan=localStorage.getItem("jabatan");
                }
            };
        </script>
       
        <style scoped>
            .fullheight {
                min-height: 100vh !important;
            }
            .router {
                text-decoration: none;
                color: black;
            }
        </style>