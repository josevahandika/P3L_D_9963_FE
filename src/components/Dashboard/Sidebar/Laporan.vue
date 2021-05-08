<template>
  <v-main class="list">
    <v-card>
      <v-card-title>
        <h3 class="text-h3 font-weight-medium mb-5">🖨Laporan🖨</h3>
        <v-spacer></v-spacer>
      </v-card-title>
      <v-card>
        <v-row class="ma-2 d-flex justify-space-around">
          <v-col>
            <v-card
              class="pink lighten-4 my-1 pa-5"
              @click="dialogLaporanStok = true"
            >
              <v-card-text class="headline mb-5; ">
                <b>Laporan Stok</b>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col>
            <v-card
              class="pink lighten-4 my-1 pa-5"
              @click="dialogLaporanPenjualanItemMenu = true"
            >
              <v-card-text class="headline mb-5; ">
                <b>Laporan Penjualan Item Menu</b>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
        <v-row class="ma-2 d-flex justify-space-around">
          <v-col>
            <v-card
              class="pink lighten-4 my-1 pa-5"
              @click="dialogLaporanPendapatan = true"
            >
              <v-card-text class="headline mb-5; ">
                <b>Laporan Pendapatan</b>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col>
            <v-card
              class="pink lighten-4 my-1 pa-5"
              @click="dialogLaporanPengeluaran = true"
            >
              <v-card-text class="headline mb-5; ">
                <b>Laporan Pengeluaran</b>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-card>
      <v-spacer></v-spacer>
    </v-card>
    <v-dialog v-model="dialogLaporanStok" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Laporan Stok</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form ref="form" lazy-validation v-model="valid">
              <v-select
                v-model="form.periodeStok"
                :items="periodeStok"
                label="Pilih Periode"
                :rules="fieldEmpty"
                required
              ></v-select>
              <div v-if="form.periodeStok != null">
                <v-menu
                  v-if="form.periodeStok == 'Bulanan'"
                  ref="menu"
                  v-model="menu"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="form.tanggal"
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
                    v-model="form.tanggal"
                    type="month"
                    :max="maxDate"
                    min="1950-01-01"
                    @change="saveDate"
                  ></v-date-picker>
                </v-menu>
                <v-menu
                  v-if="form.periodeStok == 'Tanggal Tertentu'"
                  ref="menu"
                  v-model="menu"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="form.tanggal_awal"
                      label="Tanggal Awal"
                      :rules="fieldEmpty"
                      append-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    ref="picker"
                    v-model="form.tanggal_awal"
                    :max="maxDate"
                    min="1950-01-01"
                    @change="saveDate"
                  ></v-date-picker>
                </v-menu>
                <v-menu
                  v-if="form.periodeStok == 'Tanggal Tertentu'"
                  ref="menu2"
                  v-model="menu2"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="form.tanggal_akhir"
                      label="Tanggal Akhir"
                      :rules="fieldEmpty"
                      append-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    ref="picker"
                    v-model="form.tanggal_akhir"
                    :max="maxDate"
                    :min="form.tanggal_awal"
                    @change="saveDate2"
                  ></v-date-picker>
                </v-menu>
              </div>
              <v-select
                v-model="form.id_bahan"
                label="Bahan"
                :items="list"
                :rules="fieldEmpty"
                required
              ></v-select>
            </v-form>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="cancelStok">
            Close
          </v-btn>
          <v-btn color="blue darken-1" text @click="cekValidasiFormStok">
            Cetak
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="dialogLaporanPenjualanItemMenu"
      persistent
      max-width="600px"
    >
      <v-card>
        <v-card-title>
          <span class="headline">Laporan Penjualan Item Menu</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form ref="formItemMenu" lazy-validation v-model="valid">
              <v-select
                v-model="formItemMenu.periode"
                :items="periode"
                label="Pilih Periode"
                :rules="fieldEmpty"
                required
              ></v-select>
              <v-menu
                v-if="formItemMenu.periode == 'Bulanan'"
                ref="menuItemMenu"
                v-model="menuItemMenu"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                min-width="290px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="formItemMenu.tanggal"
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
                  v-model="formItemMenu.tanggal"
                  type="month"
                  :max="maxDate"
                  min="1950-01-01"
                  @change="saveDateItemMenu"
                ></v-date-picker>
              </v-menu>
              <v-select
                v-if="formItemMenu.periode == 'Tahunan'"
                v-model="formItemMenu.tahunItemMenu"
                :items="tahun"
                :rules="fieldEmpty"
                label="Tahun"
              >
              </v-select>
              <v-select
                v-model="formItemMenu.id_bahan"
                label="Bahan"
                :items="list"
                :rules="fieldEmpty"
                required
              ></v-select>
            </v-form>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="cancelPenjualanItemMenu">
            Close
          </v-btn>
          <!-- <v-btn color="blue darken-1" text @click="setForm">
            Cetak
          </v-btn> -->
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogLaporanPendapatan" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Laporan Pendapatan</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form ref="formPendapatan" lazy-validation v-model="valid">
              <v-select
                v-model="formPendapatan.periode"
                :items="periode"
                label="Pilih Periode"
                :rules="fieldEmpty"
                required
              ></v-select>
              <v-select
                v-if="formPendapatan.periode == 'Bulanan'"
                v-model="formPendapatan.tahun_awal"
                :items="tahun"
                :rules="fieldEmpty"
                label="Tahun"
              ></v-select>
              <v-select
                v-if="formPendapatan.periode == 'Tahunan'"
                v-model="formPendapatan.tahun_awal"
                :items="yearsAwal"
                :rules="fieldEmpty"
                label="Tahun Awal"
              ></v-select>
              <v-select
                v-if="formPendapatan.periode == 'Tahunan'"
                v-model="formPendapatan.tahun_akhir"
                :items="yearsAkhirPendapatan"
                :rules="fieldEmpty"
                label="Tahun Akhir"
              ></v-select>
            </v-form>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="cancelPendapatan">
            Close
          </v-btn>
          <v-btn color="blue darken-1" text @click="generatePDFPendapatan">
            Cetak
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogLaporanPengeluaran" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Laporan Pengeluaran</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form ref="formPengeluaran" lazy-validation v-model="valid">
              <v-select
                v-model="formPengeluaran.periode"
                :items="periode"
                label="Pilih Periode"
                :rules="fieldEmpty"
                required
              ></v-select>
              <v-select
                v-if="formPengeluaran.periode == 'Bulanan'"
                v-model="formPengeluaran.tahun_awal"
                :items="tahun"
                :rules="fieldEmpty"
                label="Tahun"
              ></v-select>
              <v-select
                v-if="formPengeluaran.periode == 'Tahunan'"
                v-model="formPengeluaran.tahun_awal"
                :items="yearsAwal"
                :rules="fieldEmpty"
                label="Tahun Awal"
              ></v-select>
              <v-select
                v-if="formPengeluaran.periode == 'Tahunan'"
                v-model="formPengeluaran.tahun_akhir"
                :items="yearsAkhirPengeluaran"
                :rules="fieldEmpty"
                label="Tahun Akhir"
              ></v-select>
            </v-form>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="cancelPengeluaran">
            Close
          </v-btn>
          <v-btn color="blue darken-1" text @click="generatePDFPengeluaran">
            Cetak
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
  data() {
    return {
      datas: [],
      maxDate: new Date().toISOString().substr(0, 10),
      bahans: [],
      list: [],
      tahun: ["2020", "2021"],
      snackbar: false,
      error_message: "",
      color: "",
      menu: false,
      menu2: false,
      tempBulan: "",
      periodeStok: ["Tanggal Tertentu", "Bulanan"],
      periode: ["Bulanan", "Tahunan"],
      dialogLaporanStok: false,
      dialogLaporanPenjualanItemMenu: false,
      dialogLaporanPengeluaran: false,
      dialogLaporanPendapatan: false,
      fieldEmpty: [(v) => !!v || "Field tidak boleh kosong"],
      form: {
        periodeStok: null,
        tanggal: null,
        tanggal_awal: null,
        tanggal_akhir: null,
        id_bahan: null,
      },
      formItemMenu: {
        periode: null,
        tanggal: null,
        id_bahan: null,
      },
      formPendapatan: {
        periode: null,
        tahun_awal: null,
        tahun_akhir: null,
      },
      formPengeluaran: {
        periode: null,
        tahun_awal: null,
        tahun_akhir: null,
      },
      valid: true,
      // headers: [
      //   {
      //     text: "Nomor Kartu",
      //     align: "start",
      //     sortable: true,
      //     value: "nomor_kartu",
      //   },
      //   { text: "Nama Pemilik", value: "nama_pemilik" },
      //   { text: "Jenis Kartu", value: "jenis_kartu" },
      //   { text: "Tanggal Kadaluarsa", value: "tanggal_kadaluarsa" },
      // ],
    };
  },
  methods: {
    readDataBahan() {
      var url = this.$api + "/menuLaporan";
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.list = response.data.data;
          console.log(this.list);
        });
    },
    readDataBulan() {
      var url =
        this.$api +
        "/laporanStok/" +
        this.tempBulan +
        "/" +
        localStorage.getItem("id");
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.list = response.data.data;
          console.log(this.list);
        });
    },
    cekValidasiFormStok() {
      if (this.$refs.form.validate()) {
        if (this.form.periodeStok == "Bulanan") {
          if (this.form.id_bahan == "All") {
            this.generatePDFStok();
          } else {
            this.generatePDFStokCustom();
          }
        } else {
          if (this.form.id_bahan == "All") {
            this.generatePDFStokPeriodeAll();
          } else {
            this.generatePDFStokPeriodeItem();
          }
        }
      } else {
        this.snackbar = true;
        this.error_message = "Isi form dengan benar";
        this.color = "red";
      }
    },
    generatePDFStok() {
      var url =
        this.$api +
        "/laporanStok/" +
        this.form.tanggal +
        "/" +
        localStorage.getItem("id") +
        "/" +
        this.form.id_bahan;
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
          // this.readData(); //mengambil data
          // this.readDataHistory(); //mengambil data
          this.dialogLaporanStok = false;
          this.$refs.form.reset();
          console.log(response.data.message);
          console.log("asd");
        });
    },
    generatePDFStokCustom() {
      var url =
        this.$api +
        "/laporanStokBulananCustom/" +
        this.form.tanggal +
        "/" +
        localStorage.getItem("id") +
        "/" +
        this.form.id_bahan;
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
          // this.readData(); //mengambil data
          // this.readDataHistory(); //mengambil data
          this.dialogLaporanStok = false;
          this.$refs.form.reset();
          console.log(response.data.message);
          console.log("asd");
        });
    },
    generatePDFStokPeriodeAll() {
      var url =
        this.$api +
        "/laporanStokCustomAll/" +
        this.form.tanggal_awal +
        "/" +
        this.form.tanggal_akhir +
        "/" +
        localStorage.getItem("id");
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
          // this.readData(); //mengambil data
          // this.readDataHistory(); //mengambil data
          this.dialogLaporanStok = false;
          this.$refs.form.reset();
          console.log(response.data.message);
          console.log("asd");
        });
    },
    generatePDFStokPeriodeItem() {
      var url =
        this.$api +
        "/laporanStokCustomItem/" +
        this.form.tanggal_awal +
        "/" +
        this.form.tanggal_akhir +
        "/" +
        localStorage.getItem("id") +
        "/" +
        this.form.id_bahan;
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
          // this.readData(); //mengambil data
          // this.readDataHistory(); //mengambil data
          this.dialogLaporanStok = false;
          this.$refs.form.reset();
          console.log(response.data.message);
          console.log("asd");
        });
    },
    generatePDFPendapatan() {
      if (this.formPendapatan.periode == "Bulanan") {
        this.formPendapatan.tahun_akhir = "Kosong";
      }
      var url =
        this.$api +
        "/laporanPendapatan/" +
        localStorage.getItem("id") +
        "/" +
        this.formPendapatan.tahun_awal +
        "/" +
        this.formPendapatan.tahun_akhir;
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
          // this.readData(); //mengambil data
          // this.readDataHistory(); //mengambil data
          this.dialogLaporanPendapatan = false;
          this.$refs.formPendapatan.reset();
          console.log(response.data.message);
          console.log("asd");
        });
    },
    generatePDFPengeluaran() {
      if (this.formPengeluaran.periode == "Bulanan") {
        this.formPengeluaran.tahun_akhir = "Kosong";
      }
      var url =
        this.$api +
        "/laporanPengeluaran/" +
        localStorage.getItem("id") +
        "/" +
        this.formPengeluaran.tahun_awal +
        "/" +
        this.formPengeluaran.tahun_akhir;
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
          // this.readData(); //mengambil data
          // this.readDataHistory(); //mengambil data
          this.dialogLaporanPengeluaran = false;
          this.$refs.formPengeluaran.reset();
          console.log(response.data.message);
          console.log("asd");
        });
    },
    cancelStok() {
      this.$refs.form.reset();
      //this.readData();
      this.dialogLaporanStok = false;
    },
    cancelPenjualanItemMenu() {
      this.$refs.formItemMenu.reset();
      //this.readData();
      this.dialogLaporanPenjualanItemMenu = false;
    },
    cancelPendapatan() {
      this.$refs.formPendapatan.reset();
      //this.readData();
      this.dialogLaporanPendapatan = false;
    },
    cancelPengeluaran() {
      this.$refs.formPengeluaran.reset();
      //this.readData();
      this.dialogLaporanPengeluaran = false;
    },
    saveDate(date) {
      this.$refs.menu.save(date);
    },
    saveDate2(date) {
      this.$refs.menu.save(date);
    },
    saveDateItemMenu(date) {
      this.$refs.menuItemMenu.save(date);
    },
    saveDatePendapatan(date) {
      this.$refs.menuPendapatan.save(date);
    },
  },
  computed: {
    yearsAwal() {
      const year = new Date().getFullYear();
      return Array.from(
        { length: year - 2019 },
        (value, index) => 2020 + index
      );
    },
    yearsAkhirPendapatan() {
      const year = new Date().getFullYear();
      if (this.formPendapatan.tahun_awal == null) {
        return Array.from(
          { length: year - 2019 },
          (value, index) => 2020 + index
        );
      } else if (this.formPendapatan.tahun_awal == year) {
        return ["2021"];
      }
      return Array.from(
        { length: year - this.formPendapatan.tahun_awal },
        (value, index) => this.formPendapatan.tahun_awal + 1 + index
      );
    },
    yearsAkhirPengeluaran() {
      const year = new Date().getFullYear();
      if (this.formPengeluaran.tahun_awal == null) {
        return Array.from(
          { length: year - 2019 },
          (value, index) => 2020 + index
        );
      } else if (this.formPengeluaran.tahun_awal == year) {
        return ["2021"];
      }
      return Array.from(
        { length: year - this.formPengeluaran.tahun_awal },
        (value, index) => this.formPengeluaran.tahun_awal + 1 + index
      );
    },
  },
  mounted() {
    this.readDataBahan();
  },
  watch: {
    menu(val) {
      val && setTimeout(() => (this.$refs.picker.activePicker = "YEAR"));
    },
    menuItemMenu(val) {
      val && setTimeout(() => (this.$refs.picker.activePicker = "YEAR"));
    },
    menuPendapatan(val) {
      val && setTimeout(() => (this.$refs.picker.activePicker = "YEAR"));
    },
  },
};
</script>
