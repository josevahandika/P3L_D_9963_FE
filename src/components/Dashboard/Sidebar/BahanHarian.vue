<template>
    <v-main class="list">

    <h3 class="text-h3 font-weight-medium mb-5">
        🍽Bahan Harian🍽
    </h3>
    <v-card>
            <v-card-title>
                <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="Search"
                single-line
                hide-details
                ></v-text-field>
                <v-spacer></v-spacer>
            </v-card-title>
            <v-data-table :headers="headers" :items="datas" :search="search" no-data-text="Loading" no-results-text="Data tidak ditemukan">
                <!-- ISI DATA WARGA GOES HERE -->
            </v-data-table>
    </v-card>

            
    </v-main>
</template>
<script>
export default {
    data(){
        return{
            search: null,
            datas: [],
            headers: [

                    { text: "Nama Bahan",
                    class:"pink lighten-4",
                    align: "start",
                    sortable: true,
                    value: "nama_bahan" },
                    { text: "Tanggal", class:"pink lighten-4", value: "tanggal"},
                    { text: "Jumlah", class:"pink lighten-4", value: "jumlah"}               
                ],
        }
    },
    methods:{
        readData() {
            var url = this.$api + '/bahanharian'
            this.$http.get(url, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            }).then(response => {
                console.log("test");
                console.log(response.data.message);
                this.datas = response.data.data
            })
        },
        
    },
    mounted() {
        this.readData();
    },
}

</script>