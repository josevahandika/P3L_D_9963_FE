<template>
  <v-main class="list">
    <h3 class="text-h3 font-weight-medium mb-5">📜Reservasi📜</h3>
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
        <v-btn
          color="pink lighten-4 black--text"
          dark
          @click="btnReservasiLangsung"
        >
          Tambah Reservasi Langsung
        </v-btn>
        <v-btn @click="btnReservasiTidakLangsung">
          Tambah Reservasi Tidak Langsung
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
            v-if="item.status_reservasi != 'Finished'"
            class="mr-2"
            @click="qrHandler(item)"
          >
            qr
          </v-btn>
          <v-btn
            small
            v-if="
              item.sesi_reservasi != 'Langsung' &&
                item.status_reservasi != 'Finished'
            "
            class="mr-2 pink lighten-4 black--text"
            @click="editHandler(item)"
          >
            edit
          </v-btn>
          <v-btn
            small
            v-if="
              item.sesi_reservasi != 'Langsung' &&
                item.status_reservasi != 'Finished'
            "
            @click="deleteHandler(item)"
          >
            delete
          </v-btn>
        </template>
      </v-data-table>
    </v-card>
    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ formTitle }} Reservasi Langsung </span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form ref="form" lazy-validation v-model="valid">
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
                    v-model="form.tanggal_reservasi"
                    label="Tanggal Reservasi"
                    :rules="fieldEmpty"
                    append-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                    disabled
                  ></v-text-field>
                </template>
                <v-date-picker
                  ref="picker"
                  v-model="form.tanggal_reservasi"
                  :min="maxDate"
                  max="2030-01-01"
                  @change="saveDate"
                ></v-date-picker>
              </v-menu>
              <v-select
                v-model="form.id_meja"
                label="Meja"
                :items="mejas"
                item-text="nomor_meja"
                item-value="id"
                :rules="fieldEmpty"
                required
              ></v-select>
              <v-switch v-model="customerYangSudahAda" flat></v-switch>
              <v-data-table
                v-if="tempCustomer == true"
                :headers="headersCustomer"
                :items="customers"
                :search="search"
                no-data-text="Loading"
                no-results-text="Data tidak ditemukan"
              >
                <template v-slot:[`item.actions`]="{ item }">
                  <v-btn
                    small
                    class="mr-2 pink lighten-4 black--text"
                    @click="pilihHandler(item)"
                  >
                    Pilih
                  </v-btn>
                </template>
              </v-data-table>
              <v-text-field
                v-if="customerYangSudahAda == true"
                disabled
                v-model="form.nama_customer"
                label="Nama Customer"
                :rules="fieldEmpty"
                required
              ></v-text-field>
              <v-text-field
                v-else
                v-model="form.nama_customer"
                label="Nama Customer"
                :rules="fieldEmpty"
                required
              ></v-text-field>
              <v-text-field
                v-if="customerYangSudahAda == true"
                disabled
                v-model="form.telepon"
                label="Telepon"
                :rules="fieldEmpty"
                required
              ></v-text-field>
              <v-text-field
                v-else
                v-model="form.telepon"
                label="Telepon"
              ></v-text-field>
              <v-text-field
                v-if="customerYangSudahAda == true"
                disabled
                v-model="form.email"
                label="Email"
                :rules="fieldEmpty"
                required
              ></v-text-field>
              <v-text-field
                v-else
                v-model="form.email"
                label="Email"
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
    <v-dialog v-model="dialogTidakLangsung" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline"
            >{{ formTitle }} Reservasi Tidak Langsung
          </span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form ref="formTidakLangsung" lazy-validation v-model="valid">
              <v-menu
                ref="menuTidakLangsung"
                v-model="menuTidakLangsung"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                min-width="290px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="formTidakLangsung.tanggal_reservasi"
                    label="Tanggal Reservasi"
                    :rules="fieldEmpty"
                    append-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  ref="picker"
                  v-model="formTidakLangsung.tanggal_reservasi"
                  :min="maxDate"
                  max="2030-01-01"
                  @change="saveDateTidakLangsung"
                ></v-date-picker>
              </v-menu>
              <v-select
                v-model="formTidakLangsung.sesi_reservasi"
                :items="sesi_reservasi"
                label="Sesi Reservasi"
                :rules="fieldEmpty"
                required
              ></v-select>
              <v-row>
                <v-col>
                  <v-select
                    v-if="tempBtnMeja == true"
                    v-model="formTidakLangsung.id_meja"
                    label="Meja"
                    :items="mejas"
                    item-text="nomor_meja"
                    item-value="id"
                    :rules="fieldEmpty"
                    required
                  ></v-select>
                  <v-btn
                    small
                    class="mr-2 pink lighten-4 black--text"
                    @click="tampilMejaTertentu"
                  >
                    Tampil Meja
                  </v-btn>
                </v-col>
              </v-row>
              <v-switch v-model="customerTidakLangsung" flat></v-switch>
              <v-data-table
                v-if="tempCustomerTidakLangsung == true"
                :headers="headersCustomer"
                :items="customers"
                :search="search"
                no-data-text="Loading"
                no-results-text="Data tidak ditemukan"
              >
                <template v-slot:[`item.actions`]="{ item }">
                  <v-btn
                    small
                    class="mr-2 pink lighten-4 black--text"
                    @click="pilihTidakLangsungHandler(item)"
                  >
                    Pilih
                  </v-btn>
                </template>
              </v-data-table>
              <v-text-field
                v-if="customerTidakLangsung == true"
                disabled
                v-model="formTidakLangsung.nama_customer"
                label="Nama Customer"
                :rules="fieldEmpty"
                required
              ></v-text-field>
              <v-text-field
                v-else
                :disabled="inputType == 'Ubah' ? true : false"
                v-model="formTidakLangsung.nama_customer"
                label="Nama Customer"
                :rules="fieldEmpty"
                required
              ></v-text-field>
              <v-text-field
                v-if="customerTidakLangsung == true"
                disabled
                v-model="formTidakLangsung.telepon"
                label="Telepon"
                :rules="fieldEmpty"
                required
              ></v-text-field>
              <v-text-field
                v-else
                :disabled="inputType == 'Ubah' ? true : false"
                v-model="formTidakLangsung.telepon"
                label="Telepon"
              ></v-text-field>
              <v-text-field
                v-if="customerTidakLangsung == true"
                disabled
                v-model="formTidakLangsung.email"
                label="Email"
                :rules="fieldEmpty"
                required
              ></v-text-field>
              <v-text-field
                v-else
                :disabled="inputType == 'Ubah' ? true : false"
                v-model="formTidakLangsung.email"
                label="Email"
              ></v-text-field>
            </v-form>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="cancelTidakLangsung">
            Cancel
          </v-btn>
          <v-btn color="blue darken-1" text @click="setFormTidakLangsung">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="qrDialog" persistent max-width="400px">
      <v-card>
        <v-img width="100" src="https://gerardoleonel.com/AKBLOGO.png"></v-img>
        <qriously :value="tempConcatQR" :size="200" />
        <v-btn color="blue darken-1" text @click="cancelQR">
          Cancel
        </v-btn>
        <v-btn color="blue darken-1" text @click="generateReport">
          Print QR
        </v-btn>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogConfirm" persistent max-width="400px">
      <v-card>
        <v-card-title>
          <span class="headline">warning!</span>
        </v-card-title>
        <v-card-text>
          Anda yakin ingin menghapus Reservasi ini?
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
    <template>
      <div>
        <vue-html2pdf
          :show-layout="false"
          :float-layout="true"
          :enable-download="true"
          :preview-modal="true"
          :paginate-elements-by-height="2000"
          filename="QR"
          :pdf-quality="2"
          :manual-pagination="false"
          pdf-format="a4"
          pdf-orientation="landscape"
          pdf-content-width="800px"
          @progress="onProgress($event)"
          @hasStartedGeneration="hasStartedGeneration()"
          @hasGenerated="hasGenerated($event)"
          ref="html2Pdf"
        >
          <section slot="pdf-content">
            <!-- PDF Content Here -->
            <v-img width="100" src="../assets/akb_logo_full.png"></v-img>
            <qriously style="margin : 20px" :value="tempConcatQR" :size="200" />
          </section>
        </vue-html2pdf>
      </div>
    </template>
    <v-snackbar v-model="snackbar" :color="color" timeout="2000" bottom>
      {{ error_message }}
    </v-snackbar>
  </v-main>
</template>
<script>
import VueHtml2pdf from "vue-html2pdf";
export default {
  components: {
    VueHtml2pdf,
  },
  name: "List",
  data() {
    return {
      maxDate: new Date().toISOString().substr(0, 10),
      sesi_reservasi: ["Lunch", "Dinner"],
      inputType: "Tambah",
      tempIsiQR: {},
      tempConcatQR: "",
      tempIdCust: "",
      tempIdCustTidakLangsung: "",
      tempBtnMeja: false,
      load: false,
      snackbar: false,
      customerYangSudahAda: false,
      customerTidakLangsung: false,
      tempCustomer: false,
      tempCustomerTidakLangsung: false,
      error_message: "",
      color: "",
      menu: false,
      menuTidakLangsung: false,
      search: null,
      dialog: false,
      dialogTidakLangsung: false,
      dialogConfirm: false,
      qrDialog: false,
      headers: [
        {
          text: "Tanggal Reservasi",
          class: "pink lighten-4",
          align: "start",
          sortable: true,
          value: "tanggal_reservasi",
        },
        {
          text: "Sesi Reservasi",
          class: "pink lighten-4",
          value: "sesi_reservasi",
        },
        {
          text: "Status Reservasi",
          class: "pink lighten-4",
          value: "status_reservasi",
        },
        {
          text: "Nama Customer",
          class: "pink lighten-4",
          value: "nama_customer",
        },
        { text: "Nomor Meja", class: "pink lighten-4", value: "nomor_meja" },
        {
          text: "Nama Karyawan",
          class: "pink lighten-4",
          value: "nama_karyawan",
        },
        { text: "", class: "pink lighten-4", value: "actions" },
      ],
      headersCustomer: [
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
      mejas: [],
      customers: [],
      tempQR: [],
      form: {
        tanggal_reservasi: null,
        sesi_reservasi: null,
        status_reservasi: null,
        id_customer: null,
        id_meja: null,
        id_karyawan: null,
      },
      formTidakLangsung: {
        tanggal_reservasi: null,
        sesi_reservasi: null,
        status_reservasi: null,
        id_customer: null,
        id_meja: null,
        id_karyawan: null,
      },
      deleteId: "",
      editId: "",
      fieldEmpty: [(v) => !!v || "Field tidak boleh kosong"],
      emailRules: [
        (v) => !!v || "Field tidak boleh kosong",
        (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
      ],
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
    setFormTidakLangsung() {
      if (this.inputType === "Tambah") {
        if (this.$refs.formTidakLangsung.validate()) this.saveTidakLangsung();
      } else {
        if (this.$refs.formTidakLangsung.validate()) {
          this.update();
        }
      }
      this.inputType = "Tambah";
    },
    readData() {
      var url = this.$api + "/reservasi";
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
    readDataMeja() {
      var url = this.$api + "/meja";
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          let data = response.data.data;
          data.sort((a, b) =>
            parseInt(a.nomor_meja) > parseInt(b.nomor_meja)
              ? 1
              : parseInt(b.nomor_meja) > parseInt(a.nomor_meja)
              ? -1
              : 0
          );
          const temp = data.filter((i) => {
            return i.status == "Kosong";
          });
          console.log("halah");
          this.mejas = temp;
          console.log(temp);
        });
    },
    readDataMejaTertentu() {
      this.mejas = [];
      if (
        this.formTidakLangsung.tanggal_reservasi != "" &&
        this.formTidakLangsung.sesi_reservasi != "" &&
        this.formTidakLangsung.tanggal_reservasi != null &&
        this.formTidakLangsung.sesi_reservasi != null
      ) {
        let formMejaTertentu = {
          tanggal_reservasi: this.formTidakLangsung.tanggal_reservasi,
          sesi_reservasi: this.formTidakLangsung.sesi_reservasi,
        };
        var url = this.$api + "/mejareservasi";
        this.$http
          .post(url, formMejaTertentu, {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          })
          .then((response) => {
            let data = response.data.data;
            data.sort((a, b) =>
              parseInt(a.nomor_meja) > parseInt(b.nomor_meja)
                ? 1
                : parseInt(b.nomor_meja) > parseInt(a.nomor_meja)
                ? -1
                : 0
            );
            this.tempBtnMeja = true;
            const temp = data.filter((i) => {
              return i.status == "Kosong";
            });
            this.mejas = temp;
          });
      }
    },
    readDataCustomer() {
      var url = this.$api + "/customer";
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.customers = response.data.data;
        });
    },
    save() {
      if (this.customerYangSudahAda == true) {
        this.product.append("id_customer", this.tempIdCust);
        // console.log('nama customer adalah' + this.form.nama_customer);
        this.product.append("tanggal_reservasi", this.form.tanggal_reservasi);
        this.product.append("sesi_reservasi", "Langsung");
        //this.product.append('status_reservasi', this.form.status_reservasi);
        this.product.append("id_meja", this.form.id_meja);
        this.product.append("id_karyawan", localStorage.getItem("id"));
        var url = this.$api + "/reservasiold/";
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
            this.customerYangSudahAda = false;
            this.tempIdCust = "";
          })
          .catch((error) => {
            this.error_message = error.response.data.message;
            this.color = "red";
            this.snackbar = true;
            this.load = false;
          });
      } else {
        // console.log('nama customer adalah' + this.form.nama_customer);
        this.product.append("tanggal_reservasi", this.form.tanggal_reservasi);
        this.product.append("sesi_reservasi", "Langsung");
        //this.product.append('status_reservasi', this.form.status_reservasi);
        this.product.append("nama_customer", this.form.nama_customer);
        if (this.form.email == null || this.form.email == "") {
          this.product.append("email", "-");
        } else {
          this.product.append("email", this.form.email);
        }
        if (this.form.telepon == null || this.form.telepon == "") {
          this.product.append("telepon", "-");
        } else {
          this.product.append("telepon", this.form.telepon);
        }
        this.product.append("id_meja", this.form.id_meja);
        this.product.append("id_karyawan", localStorage.getItem("id"));
        var urlnew = this.$api + "/reservasinew/";
        this.load = true;
        this.$http
          .post(urlnew, this.product, {
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
            this.customerYangSudahAda = false;
            this.tempIdCust = "";
          })
          .catch((error) => {
            this.error_message = error.response.data.message;
            this.color = "red";
            this.snackbar = true;
            this.load = false;
          });
      }
    },
    saveTidakLangsung() {
      // console.log('nama customer adalah' + this.form.nama_customer);
      if (this.customerTidakLangsung == true) {
        this.product.append("id_customer", this.tempIdCustTidakLangsung);
        // console.log('nama customer adalah' + this.form.nama_customer);
        this.product.append(
          "tanggal_reservasi",
          this.formTidakLangsung.tanggal_reservasi
        );
        this.product.append(
          "sesi_reservasi",
          this.formTidakLangsung.sesi_reservasi
        );
        //this.product.append('status_reservasi', this.formTidakLangsung.status_reservasi);
        this.product.append("id_meja", this.formTidakLangsung.id_meja);
        this.product.append("id_karyawan", localStorage.getItem("id"));
        var url = this.$api + "/reservasiold/";
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
            this.closeTidakLangsung();
            this.readData(); //mengambil data
            this.customerTidakLangsung = false;
            this.tempIdCustTidakLangsung = "";
            this.tempBtnMeja = false;
          })
          .catch((error) => {
            this.error_message = error.response.data.message;
            this.color = "red";
            this.snackbar = true;
            this.load = false;
          });
      } else {
        // console.log('nama customer adalah' + this.formTidakLangsung.nama_customer);
        this.product.append(
          "tanggal_reservasi",
          this.formTidakLangsung.tanggal_reservasi
        );
        this.product.append(
          "sesi_reservasi",
          this.formTidakLangsung.sesi_reservasi
        );
        //this.product.append('status_reservasi', this.formTidakLangsung.status_reservasi);
        this.product.append(
          "nama_customer",
          this.formTidakLangsung.nama_customer
        );
        if (
          this.formTidakLangsung.email == null ||
          this.formTidakLangsung.email == ""
        ) {
          this.product.append("email", "-");
        } else {
          this.product.append("email", this.formTidakLangsung.email);
        }
        if (
          this.formTidakLangsung.telepon == null ||
          this.formTidakLangsung.telepon == ""
        ) {
          this.product.append("telepon", "-");
        } else {
          this.product.append("telepon", this.formTidakLangsung.telepon);
        }
        this.product.append("id_meja", this.formTidakLangsung.id_meja);
        this.product.append("id_karyawan", localStorage.getItem("id"));
        var urlnew = this.$api + "/reservasinew/";
        this.load = true;
        this.$http
          .post(urlnew, this.product, {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          })
          .then((response) => {
            this.error_message = response.data.message;
            this.color = "green";
            this.snackbar = true;
            this.load = false;
            this.closeTidakLangsung();
            this.readData(); //mengambil data
            this.customerTidakLangsung = false;
            this.tempIdCustTidakLangsung = "";
          })
          .catch((error) => {
            this.error_message = error.response.data.message;
            this.color = "red";
            this.snackbar = true;
            this.load = false;
          });
      }
    },
    update() {
      if (
        this.formTidakLangsung.email == null ||
        this.formTidakLangsung.email == ""
      ) {
        this.product.append("email", "-");
      }
      if (
        this.formTidakLangsung.telepon == null ||
        this.formTidakLangsung.telepon == ""
      ) {
        this.product.append("telepon", "-");
      }
      let newData = {
        tanggal_reservasi: this.formTidakLangsung.tanggal_reservasi,
        sesi_reservasi: this.formTidakLangsung.sesi_reservasi,
        //status_reservasi: this.formTidakLangsung.status_reservasi,
        nama_customer: this.formTidakLangsung.nama_customer,
        telepon: this.formTidakLangsung.telepon,
        email: this.formTidakLangsung.email,
        id_meja: this.formTidakLangsung.id_meja,
        id_karyawan: this.formTidakLangsung.id_karyawan,
      };
      var url = this.$api + "/reservasi/" + this.editId;
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
          this.closeTidakLangsung();
          this.readData(); //mengambil data
          this.resetForm();
          this.customerTidakLangsung = false;
          this.tempIdCustTidakLangsung = "";
        })
        .catch((error) => {
          this.error_message = error.response.data.message;
          this.color = "red";
          this.snackbar = true;
          this.load = false;
        });
    },
    deleteData() {
      var url = this.$api + "/hapusreservasi/" + this.deleteId;
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
          this.closeTidakLangsung();
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
      console.log(item);
      if (item.sesi_reservasi != "Langsung") {
        this.inputType = "Ubah";
        this.editId = item.id;
        this.formTidakLangsung.tanggal_reservasi = item.tanggal_reservasi;
        this.formTidakLangsung.sesi_reservasi = item.sesi_reservasi;
        this.formTidakLangsung.nama_customer = item.nama_customer;
        this.formTidakLangsung.email = item.email;
        this.formTidakLangsung.telepon = item.telepon;
        this.formTidakLangsung.id_meja = item.id_meja;
        this.dialogTidakLangsung = true;
      }
    },
    deleteHandler(item) {
      this.deleteId = item.id;
      this.dialogConfirm = true;
    },
    pilihHandler(item) {
      this.tempIdCust = item.id;
      this.form.nama_customer = item.nama_customer;
      this.form.telepon = item.telepon;
      this.form.email = item.email;
      this.tempCustomer = false;
    },
    pilihTidakLangsungHandler(item) {
      this.tempIdCustTidakLangsung = item.id;
      this.formTidakLangsung.nama_customer = item.nama_customer;
      this.formTidakLangsung.telepon = item.telepon;
      this.formTidakLangsung.email = item.email;
      this.tempCustomerTidakLangsung = false;
    },
    qrHandler(item) {
      let newData = {
        id_reservasi: item.id,
      };
      var url = this.$api + "/transaksi";
      this.load = true;
      this.$http
        .post(url, newData, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.tempQR = response.data.data;
          this.tempIsiQR.id_transaksi = this.tempQR.id_transaksi;
          this.tempIsiQR.nama_customer = this.tempQR.nama_customer;
          this.tempIsiQR.nomor_meja = this.tempQR.nomor_meja;
          this.tempIsiQR.tanggal = this.tempQR.tanggal;
          this.tempIsiQR.waktu = this.tempQR.waktu;
          this.tempConcatQR =
            this.tempIsiQR.id_transaksi +
            ";" +
            this.tempIsiQR.nama_customer +
            ";" +
            this.tempIsiQR.nomor_meja +
            ";" +
            this.tempIsiQR.tanggal +
            ";" +
            this.tempIsiQR.waktu;
          this.load = false;
          this.qrDialog = true;
        })
        .catch((error) => {
          this.error_message = error.response.data.message;
          this.color = "red";
          this.snackbar = true;
          this.load = false;
        });
    },
    close() {
      this.dialog = false;
      this.inputType = "Tambah";
      this.$refs.form.reset();
    },
    closeTidakLangsung() {
      this.dialogTidakLangsung = false;
      this.inputType = "Tambah";
      this.$refs.formTidakLangsung.reset();
    },
    cancel() {
      this.$refs.form.reset();
      this.readData();
      this.dialog = false;
      this.customerYangSudahAda = false;
    },
    cancelTidakLangsung() {
      this.$refs.formTidakLangsung.reset();
      this.readData();
      this.dialogTidakLangsung = false;
      this.customerTidakLangsung = false;
      this.tempBtnMeja = false;
    },
    cancelQR() {
      this.qrDialog = false;
    },
    btnReservasiLangsung() {
      this.dialog = true;
      this.form.tanggal_reservasi = new Date().toISOString().substr(0, 10);
    },
    btnReservasiTidakLangsung() {
      this.inputType = "Tambah";
      this.dialogTidakLangsung = true;
    },
    tampilMejaTertentu() {
      this.readDataMejaTertentu();
    },
    // resetForm() {
    //     this.form = {
    //         tanggal_reservasi: null,
    //         sesi_reservasi: null,
    //         status_reservasi: null,
    //         id_customer: null,
    //         id_meja: null,
    //         id_karyawan: null,
    //     };
    // },
    saveDate(date) {
      this.$refs.menu.save(date);
    },
    saveDateTidakLangsung(date) {
      this.$refs.menuTidakLangsung.save(date);
    },
    generateReport() {
      this.$refs.html2Pdf.generatePdf();
    },
  },
  computed: {
    formTitle() {
      return this.inputType;
    },
  },
  mounted() {
    this.readData();
    this.readDataMeja();
    this.readDataCustomer();
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
    customerTidakLangsung(val) {
      if (val == false) {
        this.formTidakLangsung.nama_customer = "";
        this.formTidakLangsung.telepon = "";
        this.formTidakLangsung.email = "";
        this.tempCustomerTidakLangsung = false;
      } else {
        this.tempCustomerTidakLangsung = true;
      }
    },
  },
};
</script>
