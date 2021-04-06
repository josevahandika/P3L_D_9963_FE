<template>
         <div class="dashboard">
            <v-navigation-drawer v-model="drawer" class="fullheight pink lighten-4 black--text" width="256" app>
                <v-list-item>
                    <v-list-item-content>
                        <v-list-item-title class="title">🍗AKB Resto🥩</v-list-item-title>
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
                        <v-list-item-icon>
                            <v-icon>
                            {{item.icon}}
                            </v-icon>
                        </v-list-item-icon>
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
                        itemsOM: [
                            { title: "Karyawan", to: "/karyawan",icon: "mdi-account-heart"},
                            { title: "Meja", to: "/meja", icon: "mdi-table-chair" },
                            { title: "Bahan", to: "/bahan", icon: "mdi-peanut" },
                            { title: "Customer", to: "/customer", icon: "mdi-account-group-outline" },
                            { title: "Bahan Harian", to: "/bahanharian", icon: "mdi-silverware" },
                            { title: "Detail Transaksi", to: "/detailtransaksi", icon: "mdi-file" },
                            { title: "Kartu", to: "/kartu", icon: "mdi-credit-card-outline" },
                            { title: "Menu", to: "/menu", icon: "mdi-food-fork-drink" },
                            { title: "Reservasi", to: "/reservasi", icon: "mdi-calendar-clock-outline" },
                            { title: "Riwayat Bahan Masuk", to: "/riwayatbahanmasuk", icon: "mdi-calendar-arrow-right" },
                            { title: "Riwayat Bahan Keluar", to: "/riwayatbahankeluar", icon: "mdi-calendar-arrow-left" },
                            { title: "Transaksi", to: "/transaksi", icon: "mdi-note" },
                            { title: "Laporan", to: "/laporan", icon: "mdi-note-outline" },
                            { title: "Pesanan", to: "/pesanan", icon: "mdi-order-bool-ascending" },
                        ],
                        itemsOwner: [
                            { title: "Karyawan", to: "/karyawan",icon: "mdi-account-heart"},
                            { title: "Laporan", to: "/laporan", icon: "mdi-note-outline"},
                        ],
                        itemsChef: [
                            { title: "Bahan", to: "/bahan", icon: "mdi-peanut" },
                            { title: "Riwayat Bahan Masuk", to: "/riwayatbahanmasuk", icon: "mdi-calendar-arrow-right" },
                            { title: "Riwayat Bahan Keluar", to: "/riwayatbahankeluar", icon: "mdi-calendar-arrow-left" },
                            { title: "Pesanan", to: "/pesanan", icon: "mdi-order-bool-ascending"},
                        ],
                        itemsWaiter: [
                            { title: "Customer", to: "/customer", icon: "mdi-account-group-outline" },
                            { title: "Meja", to: "/meja", icon: "mdi-table-chair" },
                            { title: "Reservasi", to: "/reservasi", icon: "mdi-calendar-clock-outline" },
                            { title: "Pesanan", to: "/pesanan", icon: "mdi-order-bool-ascending"},
                        ],
                        itemsCashier: [
                            { title: "Reservasi", to: "/reservasi", icon: "mdi-calendar-clock-outline" },
                            { title: "Transaksi", to: "/transaksi",icon: "mdi-note" },
                            { title: "Customer", to: "/customer", icon: "mdi-account-group-outline" },
                            { title: "Meja", to: "/meja", icon: "mdi-table-chair" },
                        ],
                        items: [

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
                    if(this.jabatan === "Operational Manager")
                    {
                        this.items = this.itemsOM;
                    }
                    else if(this.jabatan === "Owner")
                    {
                        this.items = this.itemsOwner;
                    }
                    else if(this.jabatan === "Cashier")
                    {
                        this.items = this.itemsCashier;
                    }
                    else if(this.jabatan === "Waiter")
                    {
                        this.items = this.itemsWaiter;
                    }
                    else
                    {
                        this.items = this.itemsChef;
                    }
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