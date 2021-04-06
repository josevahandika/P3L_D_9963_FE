<template>
    <v-main class="list">
        <v-card>
            <v-card-title>
        <h3 class="text-h3 font-weight-medium mb-5"> 🪑Meja🪑 </h3>
        <v-spacer></v-spacer>
           <v-data-iterator
            :search="search"
            :items="products"
            disable-pagination
            hide-default-footer
            sort-by="nomor_meja">
            <template v-slot:header>
                <v-row>
                    <v-col>
                        <v-text-field
                            v-model="search"
                            flat
                            hide-details
                            prepend-inner-icon="mdi-magnify"
                            label="Search"
                            class="mb-5"
                        >
                        </v-text-field>
                    </v-col>
                    <v-col>
                        <v-btn color="pink lighten-4 black--text" dark @click="dialog = true" v-if="yanglogin==='Operational Manager'">
                            Tambah
                        </v-btn>
                         <v-btn v-if="statusMeja==false" @click="tampilMejaKosong()">
                            Meja Kosong
                        </v-btn>
                        <v-btn v-if="statusMeja==true" @click="tampilMejaKosong()">
                            Tampil Semua Meja
                        </v-btn>
                    </v-col>
                </v-row>
                
                
            </template>

            <template v-slot:default="props">
            <v-row>
                <v-col v-for="(item, i) in props.items" :key="i" md="3">
                <v-expand-x-transition> 
                        <v-card v-if="item.status==='Kosong'"
                            class="my-1 pa-5"
                            color="success"
                        >
                            <v-list-item-title class="headline mb-5; white--text"> <b>
                            {{ item.nomor_meja }}</b>
                            </v-list-item-title>  
                            <v-card-actions  class="justify-center" v-if="yanglogin==='Operational Manager'">
                                 <v-icon
                                    small
                                    @click="editHandler(item)"
                                >
                                    mdi-pencil
                                </v-icon>
                                <v-icon
                                    small
                                    @click="deleteHandler(item)"
                                >
                                    mdi-delete
                                </v-icon>
                            </v-card-actions>          
                        </v-card>

                         <v-card v-else-if="item.status==='Isi'"
                            class="my-1 pa-5"
                            color="red"   
                        >
                            <v-list-item-title class="headline mb-5; white--text"> <b>
                            {{ item.nomor_meja }}</b>
                            </v-list-item-title>      
                            <v-card-actions class="justify-center" v-if="yanglogin==='Operational Manager'">
                                 <v-icon
                                    small
                                    @click="editHandler(item)"
                                >
                                    mdi-pencil
                                </v-icon>
                                <v-icon
                                    small
                                    @click="deleteHandler(item)"
                                >
                                    mdi-delete
                                </v-icon>
                            </v-card-actions>                        
                        </v-card>
            </v-expand-x-transition>
                </v-col>
            </v-row>
        </template>
           </v-data-iterator>
        <v-spacer></v-spacer>
             
            </v-card-title>
        </v-card>
            <v-dialog v-model="dialog" persistent max-width="600px">
                <v-card>
                    <v-card-title>
                    <span class="headline">{{ formTitle }} Meja </span>
                    </v-card-title>
                     <v-card-text>
                        <v-container>
                        <v-form ref="form" lazy-validation v-model="valid">
                            <v-text-field
                                v-model="form.nomor_meja"
                                label="Nomor meja"
                                :rules="fieldEmpty"
                                required
                            ></v-text-field>
                        </v-form>
                        </v-container>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="blue darken-1" text @click="cancel">
                            Cancel
                        </v-btn>
                        <v-btn color="blue darken-1" text @click="setForm">
                            Save
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
            <v-dialog v-model="dialogConfirm" persistent max-width="400px">
                <v-card>
                    <v-card-title>
                        <span class="headline">warning!</span>
                    </v-card-title>
                    <v-card-text>
                        Anda yakin ingin menghapus Meja ini?
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="blue darken-1" text @click="dialogConfirm = false">
                            Cancel
                        </v-btn>
                        <v-btn color="blue darken-1" text @click="deleteData">
                            Delete
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
            <v-snackbar v-model="snackbar" :color="color" timeout="2000" bottom>
                {{error_message}}
            </v-snackbar>
        </v-main>
</template>
<script>
    export default {
        name: "List",
        data() {
            return {
                inputType: 'Tambah',
                load: false,
                snackbar: false,
                error_message: '',
                color: '',
                search: null,
                dialog: false,
                dialogConfirm: false,
                statusMeja: false,
                headers: [
                    { text: "Nomor meja",
                        align: "start",
                        sortable: true,
                        value: "nomor_meja" 
                    },
                ],
                product: new FormData(),
                tempProducts: [],
                products: [],
                tempKosong: [],
                form: {
                    nomor_meja: null,
                },
                deleteId: '',
                editId: '',
                fieldEmpty: [(v) => !!v || "Field tidak boleh kosong"],
                valid: true,
                yanglogin: localStorage.getItem('jabatan'),
            };
        },
        methods: {
            setForm() {
                console.log(this.inputType);
                if (this.inputType === "Tambah") {
                    if (this.$refs.form.validate())
                     this.save();
                } else {
                    if (this.$refs.form.validate()) {
                    this.update();
                    }
                }
            },
            readData() {
                var url = this.$api + '/meja'
                this.$http.get(url, {
                headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
                }}).then(response => {
                this.tempProducts = response.data.data;
                this.products = this.tempProducts.map(meja => {
                    let data = {};
                    data["nomor_meja"] = meja.nomor_meja;
                    data["status"] = meja.status;
                    return data;
                });
            })
            },
            readDataKosong() {
                    var url = this.$api + '/mejaKosong'
                this.$http.get(url, {
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                }}).then(response => {
                    this.tempProducts = response.data.data;
                this.products = this.tempProducts.map(meja => {
                    let data = {};
                    data["nomor_meja"] = meja.nomor_meja;
                    data["status"] = meja.status;
                    return data;
                });
            })
            },
            save() {
               // console.log('nama customer adalah' + this.form.nama_customer);
                this.product.append('nomor_meja', this.form.nomor_meja);
                        var url = this.$api + '/meja'
                this.load = true
                this.$http.post(url, this.product, {
                headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
                }).then(response => {
                this.error_message=response.data.message;
                this.color="green"
                this.snackbar=true;
                this.load = false;
                this.readData(); //mengambil data
                this.close();
                }).catch(error => {
                this.error_message=error.response.data.message;
                this.color="red"
                this.snackbar=true;
                this.load = false;
                })
            },
            update() {
                let newData = {
                    nomor_meja: this.form.nomor_meja,
                }
                var url = this.$api + '/meja/' + this.editId;
                this.load = true
                this.$http.put(url, newData, {
                headers: {
                   'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
                }).then(response => {
                    this.error_message=response.data.message;
                    this.color="green"
                    this.snackbar=true;
                    this.load = false;
                    this.readData(); //mengambil data
                    this.close();
                    this.inputType = 'Tambah';
                }).catch(error => {
                    this.inputType = 'Ubah';
                    this.error_message=error.response.data.message;
                    this.color="red"
                    this.snackbar=true;
                    this.load = false;
                })
            },
            deleteData() {
                var url = this.$api + '/hapusmeja/' + this.deleteId;
                this.$http.put(url, null, {
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(response => {
                    this.error_message=response.data.message;
                    this.color="green"
                    this.snackbar=true;
                    this.load = false;
                    this.close();
                    this.readData(); //mengambil data
                    this.inputType = 'Tambah';
                    this.dialogConfirm = false;
                }).catch(error => {
                    this.error_message=error.response.data.message;
                    this.color="red"
                    this.snackbar=true;
                    this.load = false;
                })
            },
            editHandler(item){
                this.inputType = 'Ubah';
                let temp = this.tempProducts.find(meja => meja.nomor_meja === item.nomor_meja).id;
                this.editId = temp;
                this.form.nomor_meja = item.nomor_meja;
                this.dialog = true;
            },
            deleteHandler(item){
                let temp = this.tempProducts.find(meja => meja.nomor_meja === item.nomor_meja).id;
                this.deleteId = temp;
                this.dialogConfirm = true;
            },
            close() {
                this.dialog = false
                this.inputType = 'Tambah';
                this.$refs.form.reset();
            },
            cancel() {
                this.$refs.form.reset();
                this.readData();
                this.dialog = false;
                this.inputType = 'Tambah';
            },
            resetForm() {
                this.form = {
                    nomor_meja: null,
                };
            },
            tampilMejaKosong(){
                if (this.statusMeja === true) {
                    this.readData();
                    this.statusMeja = false;
                }
                else if (this.statusMeja === false) {
                    this.readDataKosong();
                    this.statusMeja = true;
                }
            }
        },
        computed: {
            formTitle() {
                return this.inputType
                },
        },
        mounted() {
            this.readData();
            
        },
    };
</script>

<style scoped>

.theme--light{

    color: #b67162;
}

</style>