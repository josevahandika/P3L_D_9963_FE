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
            v-if="item.status == 'Completed'"
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
    <v-dialog v-model="dialogFinish" persistent max-width="600px">
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
        <v-card-text>
          <v-container>
            <v-form ref="form" lazy-validation v-model="valid">
              <h3>Total Harga: {{ this.tempSebelumPajak }}</h3>
              <h3>Pajak 5 % : {{ this.tempPajak5 }}</h3>
              <h3>Pajak 10 % : {{ this.tempPajak10 }}</h3>
              <h3>Harga Setelah Pajak : {{ this.tempSemuanya }}</h3>
              <v-select
                v-model="form.metode_pembayaran"
                :items="metode_pembayaran"
                label="Metode Pembayaran"
                :rules="fieldEmpty"
              ></v-select>
              <div v-if="form.metode_pembayaran == 'Tunai'">
                <v-text-field
                  v-model="uang_bayar"
                  type="number"
                  :error="tempError"
                  :error-messages="tempErrorMessage"
                  label="Masukkan Uang Pembayaran"
                  :rules="fieldEmpty"
                ></v-text-field>
                <v-text-field
                  v-if="form.metode_pembayaran == 'Tunai'"
                  v-model="kembalian"
                  label="Kembalian"
                  :rules="fieldEmpty"
                  disabled
                ></v-text-field>
              </div>
              <div v-else-if="form.metode_pembayaran == 'Non Tunai'">
                <v-select
                  v-if="form.metode_pembayaran == 'Non Tunai'"
                  v-model="form.jenis_kartu"
                  :items="jenis_kartu"
                  :rules="fieldEmpty"
                  label="Jenis Kartu"
                ></v-select>
                <v-text-field
                  v-if="form.jenis_kartu == 'Kredit'"
                  v-model="form.nama_pemilik"
                  :rules="fieldEmpty"
                  label="Nama Pemilik"
                ></v-text-field>
                <v-menu
                  v-if="form.metode_pembayaran == 'Non Tunai'"
                  ref="menu"
                  v-model="menu"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="form.tanggal_kadaluarsa"
                      label="Tanggal Kadaluarsa"
                      :rules="fieldEmpty"
                      append-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    ref="picker"
                    v-model="form.tanggal_kadaluarsa"
                    max="2030-01-01"
                    :min="maxDate"
                    @change="saveDate"
                  ></v-date-picker>
                </v-menu>
                <v-text-field
                  v-if="form.metode_pembayaran == 'Non Tunai'"
                  type="number"
                  class="inputNumber"
                  v-model="form.nomor_kartu"
                  :rules="fieldNumber"
                  label="Nomor Kartu"
                ></v-text-field>
                <v-text-field
                  v-if="form.metode_pembayaran == 'Non Tunai'"
                  v-model="form.kode_verifikasi"
                  :rules="fieldEmpty"
                  label="Kode Verifikasi"
                ></v-text-field>
                <v-text-field
                  v-if="form.metode_pembayaran == 'Non Tunai'"
                  v-model="uang_bayar"
                  type="number"
                  :error="tempError"
                  :error-messages="tempErrorMessage"
                  label="Masukkan Uang Pembayaran"
                  :rules="fieldEmpty"
                ></v-text-field>
                <v-text-field
                  v-if="form.metode_pembayaran == 'Non Tunai'"
                  v-model="kembalian"
                  label="Kembalian"
                  :rules="fieldEmpty"
                  disabled
                ></v-text-field>
              </div>
            </v-form>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeFinish">
            Close
          </v-btn>
          <v-btn color="blue darken-1" text @click="bayar">
            Bayar
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
      maxDate: new Date().toISOString().substr(0, 10),
      metode_pembayaran: ["Tunai", "Non Tunai"],
      jenis_kartu: ["Debit", "Kredit"],
      inputType: "Tambah",
      load: false,
      indexhistory: false,
      snackbar: false,
      error_message: "",
      color: "",
      tempSebelumPajak: "",
      tempPajak5: "",
      tempPajak10: "",
      tempSemuanya: "",
      uang_bayar: "",
      kembalian: "",
      tempNoMeja: "",
      tempError: false,
      tempErrorMessage: "",
      search: null,
      dialog: false,
      dialogHistory: false,
      dialogFinish: false,
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
        { text: "Service 5%", class: "pink lighten-4", value: "pajakservice" },
        { text: "Pajak 10%", class: "pink lighten-4", value: "pajaktax" },
        {
          text: "Total Setelah Pajak",
          class: "pink lighten-4",
          value: "total",
        },
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
      fieldNumber: [
        (v) => !!v || "Field tidak boleh kosong",
        (v) => (v && v.length == 16) || "Nomor Kartu harus 16 digit!",
      ],
      deleteId: "",
      editId: "",
      bayarId: "",
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
    finishHandler(item) {
      var tempTotal = 0;
      this.bayarId = item.id;
      this.tempNoMeja = item.nomor_meja;
      var url = this.$api + "/detailtransaksifinish/" + item.id;
      console.log(item.id);
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.detailTransaksi = response.data.data;
          tempTotal = response.data.total;
          this.dialogFinish = true;
          this.tempSebelumPajak = tempTotal;
          this.tempPajak5 = (tempTotal * 5) / 100;
          this.tempPajak10 = (tempTotal * 10) / 100;
          this.tempSemuanya = (tempTotal * 115) / 100;
        });
    },
    close() {
      this.dialogHistory = false;
    },
    closeFinish() {
      this.$refs.form.reset();
      this.dialogFinish = false;
    },
    cancel() {
      this.$refs.form.reset();
      this.readData();
      this.dialog = false;
      this.inputType = "Tambah";
    },
    bayar() {
      if (!this.$refs.form.validate() || this.tempError == true) {
        this.snackbar = true;
        this.error_message = "Form Belum Lengkap!";
        this.color = "red";
      } else {
        let newData = {
          nomor_kartu: this.form.nomor_kartu,
          jenis_kartu: this.form.jenis_kartu,
          tanggal_kadaluarsa: this.form.tanggal_kadaluarsa,
          id_karyawan: localStorage.getItem("id"),
          metode_pembayaran: this.form.metode_pembayaran,
          kode_verifikasi: this.form.kode_verifikasi,
          nama_pemilik: this.form.nama_pemilik,
          nomor_meja: this.tempNoMeja,
        };

        var url = this.$api + "/transaksiBayar/" + this.bayarId;
        this.load = true;
        this.$http
          .put(url, newData, {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          })
          .then((response) => {
            console.log(response.data.data);
            this.error_message = "Transaksi sudah selesai";
            this.color = "green";
            this.snackbar = true;
            this.load = false;
            this.closeFinish();
            this.readData(); //mengambil data
            this.readDataHistory(); //mengambil data
            this.generatePDF();
            this.resetForm();
            this.dialogFinish = false;
            //this.inputType = "Tambah";
          })
          .catch((error) => {
            this.error_message = error.response.data.message;
            this.color = "red";
            this.snackbar = true;
            this.load = false;
          });
      }
    },
    generatePDF() {
      console.log(this.bayarId);
      var url = this.$api + "/generatePDF/" + this.bayarId;
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
          responseType: "blob",
        })
        .then((response) => {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "struk.pdf"); //or any other extension
          document.body.appendChild(link);
          link.click();
          this.readData(); //mengambil data
          this.readDataHistory(); //mengambil data
          this.dialogFinish = false;
          console.log(response.data.message);
          console.log("asd");
        });
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
  watch: {
    customerYangSudahAda(val) {
      if (val == false) {
        this.form.nama_customer = "";
        this.form.telepon = "";
        this.form.email = "";
        this.tempCustomer = false;
      } else {
        this.tempCustomer = true;
      }
    },
    uang_bayar() {
      if (this.tempSemuanya > this.uang_bayar) {
        this.tempError = true;
        this.tempErrorMessage = "Uang Kurang";
        this.kembalian = "";
      } else {
        this.tempError = false;
        this.tempErrorMessage = "";
        this.kembalian = this.uang_bayar - this.tempSemuanya;
      }
    },
  },
};
</script>
<style>
.inputNumber input::-webkit-outer-spin-button,
.inputNumber input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
  display: none;
}
</style>
