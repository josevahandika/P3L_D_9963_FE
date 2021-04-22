<template>
  <v-main class="list">
    <h3 class="text-h3 font-weight-medium mb-5">💸Transaksi💸</h3>
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
        <v-btn v-if="indexhistory == false" @click="tampilhistory()">
          Lihat Riwayat Transaksi
        </v-btn>
        <v-btn v-if="indexhistory == true" @click="tampilhistory()">
          Tampil Transaksi Berlangsung
        </v-btn>
      </v-card-title>
      <v-data-table
        v-if="indexhistory == false"
        :headers="headers"
        :items="products"
        :search="search"
        no-data-text="Loading"
        no-results-text="Data tidak ditemukan"
      >
        <template v-slot:[`item.actions`]="{ item }">
          <v-btn
            small
            color="pink lighten-4 black--text"
            @click="finishHandler(item)"
          >
            Finish
          </v-btn>
        </template>
      </v-data-table>
      <v-data-table
        v-else
        :headers="headersHistory"
        :items="history"
        :search="search"
        no-data-text="Loading"
        no-results-text="Data tidak ditemukan"
      >
        <template v-slot:[`item.actions`]="{ item }">
          <v-btn
            small
            color="pink lighten-4 black--text"
            @click="detailHandler(item)"
          >
            Detail
          </v-btn>
        </template>
      </v-data-table>
    </v-card>
    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ formTitle }} Transaksi </span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form ref="form" lazy-validation v-model="valid">
              <v-text-field
                v-model="form.nomor_transaksi"
                label="Nomor Transaksi"
                :rules="fieldEmpty"
                required
              ></v-text-field>
              <v-text-field
                v-model="form.metode_pembayaran"
                label="Metode Pembayaran"
              ></v-text-field>
              <v-text-field
                v-model="form.total_harga"
                label="Total Harga"
              ></v-text-field>
              <v-text-field
                v-model="form.tanggal_transaksi"
                label="Tanggal Transaksi"
              ></v-text-field>
              <v-text-field
                v-model="form.kode_verifikasi"
                label="Kode Verifikasi"
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
    <v-dialog v-model="dialogHistory" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span>Detail Transaksi</span>
        </v-card-title>
        <v-data-table
          :headers="headersDetail"
          :items="detailTransaksi"
          no-data-text="Loading"
          no-results-text="Data tidak ditemukan"
        >
        </v-data-table>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="close">
            Close
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
      indexhistory: false,
      snackbar: false,
      error_message: "",
      color: "",
      search: null,
      dialog: false,
      dialogHistory: false,
      headers: [
        {
          text: "Nomor Transaksi",
          class: "pink lighten-4",
          align: "start",
          sortable: true,
          value: "nomor_transaksi",
        },
        {
          text: "Tanggal Transaksi",
          class: "pink lighten-4",
          value: "tanggal_transaksi",
        },
        { text: "Nomor Meja", class: "pink lighten-4", value: "nomor_meja" },
        {
          text: "Nama Customer",
          class: "pink lighten-4",
          value: "nama_customer",
        },
        { text: "Status", class: "pink lighten-4", value: "status" },
        { text: "", class: "pink lighten-4", value: "actions" },
      ],
      headersHistory: [
        {
          text: "Nomor Transaksi",
          class: "pink lighten-4",
          align: "start",
          sortable: true,
          value: "nomor_transaksi",
        },
        {
          text: "Tanggal Transaksi",
          class: "pink lighten-4",
          value: "tanggal_transaksi",
        },
        { text: "Nomor Meja", class: "pink lighten-4", value: "nomor_meja" },
        {
          text: "Nama Customer",
          class: "pink lighten-4",
          value: "nama_customer",
        },
        { text: "Status", class: "pink lighten-4", value: "status" },
        {
          text: "Metode Pembayaran",
          class: "pink lighten-4",
          value: "metode_pembayaran",
        },
        { text: "Total Harga", class: "pink lighten-4", value: "total_harga" },
        {
          text: "Kode Verifikasi",
          class: "pink lighten-4",
          value: "kode_verifikasi",
        },
        { text: "Nama Karyawan", class: "pink lighten-4", value: "name" },
        { text: "Nomor Kartu", class: "pink lighten-4", value: "nomor_kartu" },
        { text: "", class: "pink lighten-4", value: "actions" },
      ],
      headersDetail: [
        {
          text: "Nama Menu",
          class: "pink lighten-4",
          align: "start",
          sortable: true,
          value: "nama_menu",
        },
        {
          text: "Jumlah",
          class: "pink lighten-4",
          value: "jumlah",
        },
        { text: "Subtotal", class: "pink lighten-4", value: "subtotal" },
      ],
      product: new FormData(),
      products: [],
      history: [],
      detailTransaksi: [],
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
      var url = this.$api + "/transaksi";
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
    readDataHistory() {
      var url = this.$api + "/transaksihistory";
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.history = response.data.data;
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
    detailHandler(item) {
      var url = this.$api + "/detailtransaksi/" + item.id;
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.detailTransaksi = response.data.data;
          this.dialogHistory = true;
        });
    },
    close() {
      this.dialogHistory = false;
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
    tampilhistory() {
      if (this.indexhistory === true) {
        this.readData();
        this.indexhistory = false;
      } else if (this.indexhistory === false) {
        this.readDataHistory();
        this.indexhistory = true;
      }
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
