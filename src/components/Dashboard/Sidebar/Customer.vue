<template>
  <v-main class="list">
    <h3 class="text-h3 font-weight-medium mb-5">🙍‍♂️Customer🙍‍♂️</h3>
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
      <v-data-table
        :headers="headers"
        :items="products"
        :search="search"
        no-data-text="Loading"
        no-results-text="Data tidak ditemukan"
      >
        <template v-slot:[`item.actions`]="{ item }">
          <v-btn
            small
            class="mr-2 pink lighten-4 black--text"
            @click="editHandler(item)"
          >
            edit
          </v-btn>
          <v-btn small @click="deleteHandler(item.id)">
            delete
          </v-btn>
        </template>
      </v-data-table>
    </v-card>
    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ formTitle }} Customer </span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form ref="form" lazy-validation v-model="valid">
              <v-text-field
                v-model="form.nama_customer"
                label="Nama customer"
                :rules="fieldEmpty"
                required
              ></v-text-field>
              <v-text-field v-model="form.email" label="Email"></v-text-field>
              <v-text-field
                v-model="form.telepon"
                label="Telepon"
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
          Anda yakin ingin menghapus Customer ini?
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
      {{ error_message }}
    </v-snackbar>
  </v-main>
</template>
<script>
export default {
  name: "List",
  data() {
    return {
      inputType: "Tambah",
      load: false,
      snackbar: false,
      error_message: "",
      color: "",
      search: null,
      dialog: false,
      dialogConfirm: false,
      headers: [
        {
          text: "Nama customer",
          class: "pink lighten-4",
          align: "start",
          sortable: true,
          value: "nama_customer",
        },
        { text: "Email", class: "pink lighten-4", value: "email" },
        { text: "Telepon", class: "pink lighten-4", value: "telepon" },
        { text: "", class: "pink lighten-4", value: "actions" },
      ],
      product: new FormData(),
      products: [],
      form: {
        nama_customer: null,
        email: null,
        telepon: null,
      },
      deleteId: "",
      editId: "",
      fieldEmpty: [(v) => !!v || "Field tidak boleh kosong"],
      emailRules: [(v) => /.+@.+\..+/.test(v) || "E-mail must be valid"],
      valid: true,
    };
  },
  methods: {
    setForm() {
      if (this.inputType === "Tambah") {
        if (this.$refs.form.validate()) this.save();
      } else {
        if (this.$refs.form.validate()) {
          this.update();
        }
      }
      this.inputType = "Tambah";
    },
    readData() {
      var url = this.$api + "/customer";
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.products = response.data.data;
        });
    },
    save() {
      // console.log('nama customer adalah' + this.form.nama_customer);
      this.product.append("nama_customer", this.form.nama_customer);
      if (this.form.email == "" || this.form.email == null) {
        this.product.append("email", "-");
      } else {
        this.product.append("email", this.form.email);
      }
      if (this.form.telepon == "" || this.form.telepon == null) {
        this.product.append("telepon", "-");
      } else {
        this.product.append("telepon", this.form.telepon);
      }
      var url = this.$api + "/customer/";
      this.load = true;
      this.$http
        .post(url, this.product, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.error_message = response.data.message;
          this.color = "green";
          this.snackbar = true;
          this.load = false;
          this.close();
          this.readData(); //mengambil data
        })
        .catch((error) => {
          this.error_message = error.response.data.message;
          this.color = "red";
          this.snackbar = true;
          this.load = false;
        });
    },
    update() {
      let newData = {
        nama_customer: this.form.nama_customer,
        email: this.form.email,
        telepon: this.form.telepon,
      };
      var url = this.$api + "/customer/" + this.editId;
      this.load = true;
      this.$http
        .put(url, newData, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.error_message = response.data.message;
          this.color = "green";
          this.snackbar = true;
          this.load = false;
          this.close();
          this.readData(); //mengambil data
          this.resetForm();
          this.inputType = "Tambah";
        })
        .catch((error) => {
          this.error_message = error.response.data.message;
          this.color = "red";
          this.snackbar = true;
          this.load = false;
        });
    },
    deleteData() {
      var url = this.$api + "/hapuscustomer/" + this.deleteId;
      this.$http
        .put(url, null, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.error_message = response.data.message;
          this.color = "green";
          this.snackbar = true;
          this.load = false;
          this.dialogConfirm = false;
          this.readData(); //mengambil data
          this.close();
          this.inputType = "Tambah";
        })
        .catch((error) => {
          this.error_message = error.response.data.message;
          this.color = "red";
          this.snackbar = true;
          this.load = false;
        });
    },
    editHandler(item) {
      this.inputType = "Ubah";
      this.editId = item.id;
      this.form.nama_customer = item.nama_customer;
      this.form.email = item.email;
      this.form.telepon = item.telepon;
      this.dialog = true;
    },
    deleteHandler(id) {
      this.deleteId = id;
      this.dialogConfirm = true;
    },
    close() {
      this.dialog = false;
      this.inputType = "Tambah";
      this.$refs.form.reset();
    },
    cancel() {
      this.$refs.form.reset();
      this.readData();
      this.dialog = false;
      this.inputType = "Tambah";
    },
    resetForm() {
      this.form = {
        nama_customer: null,
        email: null,
        telepon: null,
      };
    },
  },
  computed: {
    formTitle() {
      return this.inputType;
    },
  },
  mounted() {
    this.readData();
  },
};
</script>
