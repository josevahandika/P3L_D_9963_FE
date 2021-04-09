<template>
    <v-main class="list">
        <h3 class="text-h3 font-weight-medium mb-5"> 🍖Bahan🍖 </h3>
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
                    <v-btn color="pink lighten-4 black--text" dark @click="dialog = true">
                        Tambah
                    </v-btn>
                    <v-btn @click="dialogKuantitas = true">
                        Tambah Kuantitas
                    </v-btn>
                    <v-btn color="pink lighten-4 black--text" @click="dialogBuang = true">
                        Kurangi Kuantitas
                    </v-btn>
                    <v-btn v-if="statusBahan==false" @click="tampilBahanHabis()">
                        Bahan Habis
                    </v-btn>
                    <v-btn v-if="statusBahan==true" @click="tampilBahanHabis()">
                        Tampil Semua Bahan
                    </v-btn>
                </v-card-title>
                <v-data-table :headers="headers" :items="products" :search="search" no-data-text="Loading" no-results-text="Data tidak ditemukan">
                    <template v-slot:[`item.actions`]="{ item }">
                        <v-btn small class="mr-2 pink lighten-4 black--text" @click="editHandler(item)">
                        edit
                        </v-btn>
                        <v-btn small
                         @click="deleteHandler(item.id)">
                        delete
                        </v-btn>
                    </template>
                </v-data-table>
        </v-card>
            <v-dialog v-model="dialog" persistent max-width="600px">
                <v-card>
                    <v-card-title>
                    <span class="headline">{{ formTitle }} Bahan </span>
                    </v-card-title>
                    <v-card-text>
                        <v-container>
                        <v-form ref="form" lazy-validation v-model="valid">
                            <v-text-field
                                v-model="form.nama_bahan"
                                label="Nama bahan"
                                :rules="fieldEmpty"
                                required
                            ></v-text-field>
                            <v-text-field
                                v-model="form.unit"
                                label="Unit"
                                :rules="fieldEmpty"
                                required
                            ></v-text-field>
                            <!-- <v-text-field
                                v-model="form.jumlah_bahan_sisa"
                                label="Jumlah bahan sisa"
                                :rules="fieldEmpty"
                                required
                            ></v-text-field> -->
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
             <v-dialog v-model="dialogKuantitas" persistent max-width="600px">
                <v-card>
                    <v-card-title>
                    <span class="headline"> Tambah Stok </span>
                    </v-card-title>
                    <v-card-text>
                        <v-container>
                        <v-form ref="formKuantitas" lazy-validation v-model="valid">
                            <v-select
                                v-model="formKuantitas.id_bahan"
                                label="Bahan"
                                :items="products"
                                item-text="nama_bahan"
                                item-value="id"
                                :rules="fieldEmpty"
                                required
                            ></v-select>
                            <v-text-field
                                v-model="formKuantitas.jumlah"
                                label="Jumlah"
                                :rules="fieldEmpty"
                                required
                            ></v-text-field>
                            <v-text-field
                                v-model="formKuantitas.harga"
                                label="Harga"
                                :rules="fieldEmpty"
                                required
                            ></v-text-field>
                            <v-menu
                                ref="menu"
                                v-model="menu"
                                :close-on-content-click="false"
                                transition="scale-transition"
                                offset-y
                                min-width="290px"
                            >
                                <template v-slot:activator="{ on, attrs }">
                                <v-text-field
                                    v-model="formKuantitas.tanggal"
                                    label="Tanggal"
                                    :rules="fieldEmpty"
                                    append-icon="mdi-calendar"
                                    readonly
                                    v-bind="attrs"
                                    v-on="on"
                                ></v-text-field>
                                </template>
                                <v-date-picker
                                ref="picker"
                                v-model="formKuantitas.tanggal"
                                :max="maxDate"
                                min="1950-01-01"
                                @change="saveDate"
                                ></v-date-picker>
                            </v-menu>
                        </v-form>
                        </v-container>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="blue darken-1" text @click="cancelKuantitas">
                            Cancel
                        </v-btn>
                        <v-btn color="blue darken-1" text @click="saveKuantitas">
                            Save
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
            <v-dialog v-model="dialogBuang" persistent max-width="600px">
                <v-card>
                    <v-card-title>
                    <span class="headline"> Buang Stok </span>
                    </v-card-title>
                    <v-card-text>
                        <v-container>
                        <v-form ref="formBuang" lazy-validation v-model="valid">
                            <v-select
                                v-model="formBuang.id_bahan"
                                label="Bahan"
                                :items="products"
                                item-text="nama_bahan"
                                item-value="id"
                                :rules="fieldEmpty"
                                required
                            ></v-select>
                            <v-text-field
                                v-model="formBuang.jumlah"
                                label="Jumlah"
                                :rules="fieldEmpty"
                                required
                            ></v-text-field>
                            <v-menu
                                ref="menu"
                                v-model="menu"
                                :close-on-content-click="false"
                                transition="scale-transition"
                                offset-y
                                min-width="290px"
                            >
                                <template v-slot:activator="{ on, attrs }">
                                <v-text-field
                                    v-model="formBuang.tanggal"
                                    label="Tanggal"
                                    :rules="fieldEmpty"
                                    append-icon="mdi-calendar"
                                    readonly
                                    v-bind="attrs"
                                    v-on="on"
                                ></v-text-field>
                                </template>
                                <v-date-picker
                                ref="picker"
                                v-model="formBuang.tanggal"
                                :max="maxDate"
                                min="1950-01-01"
                                @change="saveDate"
                                ></v-date-picker>
                            </v-menu>
                        </v-form>
                        </v-container>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="blue darken-1" text @click="cancelBuang">
                            Cancel
                        </v-btn>
                        <v-btn color="blue darken-1" text @click="saveBuang">
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
                        Anda yakin ingin menghapus Bahan ini?
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
                menu: false,
                maxDate: new Date().toISOString().substr(0, 10),
                namaBahan: null,
                inputType: 'Tambah',
                load: false,
                snackbar: false,
                error_message: '',
                color: '',
                statusBahan: false,
                search: null,
                dialog: false,
                dialogKuantitas: false,
                dialogBuang: false,
                dialogConfirm: false,
                headers: [
                    { text: "Nama bahan", class: "pink lighten-4",
                        align: "start",
                        sortable: true,
                        value: "nama_bahan" 
                    },
                    { text: "Unit", class:"pink lighten-4", value: "unit" },
                    { text: "Jumlah Bahan Sisa", class:"pink lighten-4", value: "jumlah_bahan_sisa" },
                    { text: "",class:"pink lighten-4", value: "actions" },
                ],
                product: new FormData,
                products: [],
                form: {
                    nama_bahan: null,
                    unit: null,
                    jumlah_bahan_sisa: null,
                },
                formKuantitas: {
                    id_bahan: null,
                    jumlah: null,
                    harga: null,
                    tanggal: null,
                },
                formBuang: {
                    id_bahan: null,
                    jumlah: null,
                    tanggal: null,
                },
                deleteId: '',
                editId: '',
                fieldEmpty: [(v) => !!v || "Field tidak boleh kosong"],
                valid: true,
            };
        },
        methods: {
            setForm() {
                if (this.inputType === "Tambah") {
                    if (this.$refs.form.validate())
                     this.save();
                } else {
                    if (this.$refs.form.validate()) {
                    this.update();
                    }
                }
                // this.inputType = "Tambah";
            },
            readData() {
                var url = this.$api + '/bahan'
                this.$http.get(url, {
                headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
                }}).then(response => {
                this.products = response.data.data;
            })
            },
            readDataKosong() {
                    var url = this.$api + '/bahanKosong'
                this.$http.get(url, {
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                }}).then(response => {
                    this.tempProducts = response.data.data;
                this.products = this.tempProducts.map(bahan => {
                    let data = {};
                    data["nama_bahan"] = bahan.nama_bahan;
                    data["unit"] = bahan.unit;
                    data["jumlah_bahan_sisa"] = bahan.jumlah_bahan_sisa;
                    return data;
                });
            })
            },
            save() {
               // console.log('nama customer adalah' + this.form.nama_bahan);
                this.product.append('nama_bahan', this.form.nama_bahan);
                this.product.append('unit', this.form.unit);
               //this.product.append('jumlah_bahan_sisa', this.form.jumlah_bahan_sisa);
                        var url = this.$api + '/bahan/'
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
                this.close();
                this.readData(); //mengambil data
                }).catch(error => {
                this.error_message=error.response.data.message;
                this.color="red"
                this.snackbar=true;
                this.load = false;
                })
            },
            saveKuantitas() {
               // console.log('nama customer adalah' + this.form.nama_bahan);
                this.product.append('id_bahan', this.formKuantitas.id_bahan);
                this.product.append('jumlah', this.formKuantitas.jumlah);
                this.product.append('harga', this.formKuantitas.harga);
                this.product.append('tanggal', this.formKuantitas.tanggal);
               //this.product.append('jumlah_bahan_sisa', this.form.jumlah_bahan_sisa);
                        var url = this.$api + '/riwayatbahanmasuk/'
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
                this.closeKuantitas();
                this.readData(); //mengambil data
                }).catch(error => {
                this.error_message=error.response.data.message;
                this.color="red"
                this.snackbar=true;
                this.load = false;
                })
            },
            saveBuang() {
               // console.log('nama customer adalah' + this.form.nama_bahan);
                this.product.append('id_bahan', this.formBuang.id_bahan);
                this.product.append('jumlah', this.formBuang.jumlah);
                this.product.append('status', "Buang");
                this.product.append('tanggal', this.formBuang.tanggal);
               //this.product.append('jumlah_bahan_sisa', this.form.jumlah_bahan_sisa);
                        var url = this.$api + '/riwayatbahankeluar/'
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
                this.closeBuang();
                this.readData(); //mengambil data
                }).catch(error => {
                this.error_message=error.response.data.message;
                this.color="red"
                this.snackbar=true;
                this.load = false;
                })
            },
            update() {
                let newData = {
                    nama_bahan: this.form.nama_bahan,
                    unit: this.form.unit,
                    //jumlah_bahan_sisa: this.form.jumlah_bahan_sisa,
                }
                var url = this.$api + '/bahan/' + this.editId;
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
                    this.close();
                    this.readData(); //mengambil data
                    this.inputType = 'Tambah';
                }).catch(error => {
                    this.error_message=error.response.data.message;
                    this.color="red"
                    this.snackbar=true;
                    this.load = false;
                })
            },
            deleteData() {
                var url = this.$api + '/hapusbahan/' + this.deleteId;
                this.$http.put(url, null, {
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(response => {
                    this.error_message=response.data.message;
                    this.color="green"
                    this.snackbar=true;
                    this.load = false;
                    this.dialogConfirm = false;
                    this.readData(); //mengambil data
                    this.close();
                    this.inputType = 'Tambah';
                }).catch(error => {
                    this.error_message=error.response.data.message;
                    this.color="red"
                    this.snackbar=true;
                    this.load = false;
                })
            },
            editHandler(item){
                this.inputType = 'Ubah';
                this.editId = item.id;
                this.form.nama_bahan = item.nama_bahan;
                this.form.unit = item.unit;
               // this.form.jumlah_bahan_sisa = item.jumlah_bahan_sisa;
                this.dialog = true;
            },
            deleteHandler(id){
                this.deleteId = id;
                this.dialogConfirm = true;
            },
            kuantitasHandler(item){
                this.kuantitasId = item.id;
                this.dialogKuantitas = true;
            },
            buangHandler(item){
                this.buangId = item.id;
                this.dialogBuang = true;
            },
            close() {
                this.dialog = false
                this.inputType = 'Tambah';
                this.$refs.form.reset();
            },
            closeKuantitas() {
                this.dialogKuantitas = false
                this.$refs.formKuantitas.reset();
            },
            closeBuang() {
                this.dialogBuang = false
                this.$refs.formBuang.reset();
            },
            cancel() {
                this.readData();
                this.dialog = false;
                this.inputType = 'Tambah';
                this.$refs.form.reset();
            },
            cancelKuantitas() {
                this.readData();
                this.dialogKuantitas = false;
                this.$refs.formKuantitas.reset();
            },
            cancelBuang() {
                this.readData();
                this.dialogBuang = false;
                this.$refs.formBuang.reset();
            },
            resetForm() {
                this.form = {
                    nama_bahan: null,
                    unit: null,
                    jumlah_bahan_sisa: null,
                };
            },
            tampilBahanHabis(){
                if (this.statusBahan === true) {
                    this.readData();
                    this.statusBahan = false;
                }
                else if (this.statusBahan === false) {
                    this.readDataKosong();
                    this.statusBahan = true;
                }
            },
            saveDate(date) {
                this.$refs.menu.save(date);
            },
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