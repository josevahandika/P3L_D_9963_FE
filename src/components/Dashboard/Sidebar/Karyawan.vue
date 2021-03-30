<template>
    <v-main class="list">
        <h3 class="text-h3 font-weight-medium mb-5"> Karyawan </h3>
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
                </v-card-title>
                <v-data-table :headers="headers" :items="products" :search="search" no-data-text="Loading" no-results-text="Data tidak ditemukan">
                    <template v-slot:[`item.actions`]="{ item }">
                        <v-btn small class="mr-2 pink lighten-4 black--text" @click="editHandler(item)">
                        edit
                        </v-btn>
                        <v-btn small
                        v-if="item.status==='Aktif'"
                         @click="deleteHandler(item.id)">
                        delete
                        </v-btn>
                        <v-btn small
                        v-if="item.status==='Resign'"
                         @click="restoreHandler(item.id)">
                        restore
                        </v-btn>
                    </template>
                </v-data-table>
        </v-card>
            <v-dialog v-model="dialog" persistent max-width="600px">
                <v-card>
                    <v-card-title>
                    <span class="headline">{{ formTitle }} Karyawan </span>
                    </v-card-title>
                    <v-card-text>
                        <v-container>
                            <v-text-field
                                v-model="form.name"
                                label="Nama karyawan"
                                required
                            ></v-text-field>
                            <v-select
                            v-model="form.jabatan"
                            :items="jabatan"
                            label="Jabatan"
                            ></v-select>
                            <v-text-field
                                v-if="inputType==='Tambah'"
                                v-model="form.username"
                                label="Username"
                                required
                            ></v-text-field>
                            <v-text-field
                                v-model="form.email"
                                label="Email"
                                required
                            ></v-text-field>
                            <v-text-field
                                v-if="inputType==='Tambah'"
                                v-model="form.password"
                                label="Password"
                                required
                            ></v-text-field>
                            <v-text-field
                                v-model="form.telepon"
                                label="Telepon"
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
                                    v-model="form.tanggal_bergabung"
                                    label="Tanggal Bergabung"
                                    :rules="fieldEmpty"
                                    append-icon="mdi-calendar"
                                    readonly
                                    v-bind="attrs"
                                    v-on="on"
                                ></v-text-field>
                                </template>
                                <v-date-picker
                                ref="picker"
                                v-model="form.tanggal_bergabung"
                                :max="maxDate"
                                min="1950-01-01"
                                @change="saveDate"
                                ></v-date-picker>
                            </v-menu>
                            <v-text-field
                                v-model="form.status"
                                label="Status"
                                required
                            ></v-text-field>
                            <v-select
                            v-model="form.jenis_kelamin"
                            :items="jenis_kelamin"
                            label="Jenis Kelamin"
                            ></v-select>
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
                        Anda yakin ingin menghapus Karyawan ini?
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
              <v-dialog v-model="dialogRestore" persistent max-width="400px">
                <v-card>
                    <v-card-title>
                        <span class="headline">warning!</span>
                    </v-card-title>
                    <v-card-text>
                        Anda yakin ingin mengembalikan Karyawan ini?
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="blue darken-1" text @click="dialogRestore = false">
                            Cancel
                        </v-btn>
                        <v-btn color="blue darken-1" text @click="restoreData">
                            Restore
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
                jabatan: ['Owner', 'Operational Manager', 'Cashier', 'Chef', 'Waiter'],
                jenis_kelamin: ['Pria', 'Wanita'],
                load: false,
                snackbar: false,
                error_message: '',
                color: '',
                search: null,
                dialog: false,
                dialogConfirm: false,
                dialogRestore: false,
                headers: [
                    { text: "Nama karyawan",
                        align: "start",
                        sortable: true,
                        value: "name" 
                    },
                    { text: "Jabatan", value: "jabatan" },
                    { text: "Username", value: "username" },
                    { text: "Email", value: "email" },
                    { text: "Telepon", value: "telepon" },
                    { text: "Tanggal bergabung", value: "tanggal_bergabung" },
                    { text: "Status", value: "status" },
                    { text: "Jenis Kelamin", value: "jenis_kelamin" },
                    { text: "", value: "actions" },
                ],
                product: new FormData,
                products: [],
                form: {
                    name: null,
                    jabatan: null,
                    username: null,
                    email: null,
                    password: null,
                    telepon: null,
                    tanggal_bergabung: null,
                    status: null,
                    jenis_kelamin: null,
                },
                deleteId: '',
                editId: ''
            };
        },
        methods: {
            setForm() {
                if (this.inputType === 'Tambah') {
                    this.save()
                }else {
                    this.update()
                }
            },
            readData() {
                var url = this.$api + '/karyawan'
                this.$http.get(url, {
                headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
                }}).then(response => {
                this.products = response.data.data
            })
            },
            save() {
                this.product.append('name', this.form.name);
                this.product.append('jabatan', this.form.jabatan);
                this.product.append('username', this.form.username);
                this.product.append('email', this.form.email);
                this.product.append('password', this.form.password);
                this.product.append('telepon', this.form.telepon);
                this.product.append('tanggal_bergabung', this.form.tanggal_bergabung);
                this.product.append('status', this.form.status);
                this.product.append('jenis_kelamin', this.form.jenis_kelamin);
                        var url = this.$api + '/karyawan/'
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
                this.resetForm();
                }).catch(error => {
                this.error_message=error.response.data.message;
                this.color="red"
                this.snackbar=true;
                this.load = false;
                })
            },
            update() {
                let newData = {
                    name: this.form.name,
                    jabatan: this.form.jabatan,
                    username: this.form.username,
                    email: this.form.email,
                    password: this.form.password,
                    telepon: this.form.telepon,
                    tanggal_bergabung: this.form.tanggal_bergabung,
                    status: this.form.status,
                    jenis_kelamin: this.form.jenis_kelamin
                }
                var url = this.$api + '/karyawan/' + this.editId;
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
                    this.resetForm();
                    this.inputType = 'Tambah';
                }).catch(error => {
                    this.error_message=error.response.data.message;
                    this.color="red"
                    this.snackbar=true;
                    this.load = false;
                })
            },
            deleteData() {
                var url = this.$api + '/hapuskaryawan/' + this.deleteId;
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
                    this.resetForm();
                    this.inputType = 'Tambah';
                    this.dialogConfirm = false;
                }).catch(error => {
                    this.error_message=error.response.data.message;
                    this.color="red"
                    this.snackbar=true;
                    this.load = false;
                })
            },

            restoreData() {
                var url = this.$api + '/restorekaryawan/' + this.deleteId;
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
                    this.resetForm();
                    this.inputType = 'Tambah';
                    this.dialogRestore = false;
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
                this.form.name = item.name;
                this.form.jabatan = item.jabatan;
                this.form.username = item.username;
                this.form.email = item.email;
                this.form.password = item.password;
                this.form.telepon = item.telepon;
                this.form.tanggal_bergabung = item.tanggal_bergabung;
                this.form.status = item.status;
                this.form.jenis_kelamin = item.jenis_kelamin;
                this.dialog = true;
            },
            deleteHandler(id){
                this.deleteId = id;
                this.dialogConfirm = true;
            },
            restoreHandler(id){
                this.deleteId = id;
                this.dialogRestore = true;
            },
            close() {
                this.dialog = false
                this.inputType = 'Tambah';
            },
            cancel() {
                this.resetForm();
                this.readData();
                this.dialog = false;
                this.inputType = 'Tambah';
            },
            resetForm() {
                this.form = {
                     name: null,
                    jabatan: null,
                    username: null,
                    email: null,
                    password: null,
                    telepon: null,
                    tanggal_bergabung: null,
                    status: null,
                    jenis_kelamin: null,
                };
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