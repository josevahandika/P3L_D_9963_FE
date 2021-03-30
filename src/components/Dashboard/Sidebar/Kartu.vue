<template>
    <v-main>

    <h3 class="ml-5 mt-5">
        Kartu
    </h3>
            <v-data-table class="elevation-5 ml-5 mr-3" :headers="headers" :items="datas">
                <!-- ISI DATA WARGA GOES HERE -->
            </v-data-table>

            
    </v-main>
</template>
<script>
export default {
    data(){
        return{
            datas: [],
            headers: [

                    { text: "Nomor Kartu",
                    align: "start",
                    sortable: true,
                    value: "nomor_kartu" },
                    { text: "Nama Pemilik", value: "nama_pemilik"},
                    { text: "Jenis Kartu", value: "jenis_kartu"},
                    { text: "Tanggal Kadaluarsa", value: "tanggal_kadaluarsa"}               
                ],
        }
    },
    methods:{
        readData() {
            var url = this.$api + '/kartu'
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