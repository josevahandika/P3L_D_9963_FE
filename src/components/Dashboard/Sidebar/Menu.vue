<template>
  <v-main class="list">
    <h3 class="text-h3 font-weight-medium mb-5">🥓Menu🥓</h3>
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
          <span class="headline">{{ formTitle }} Menu </span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form ref="form" lazy-validation v-model="valid">
              <v-text-field
                v-model="form.nama_menu"
                label="Nama menu"
                :rules="fieldEmpty"
                required
              ></v-text-field>
              <v-text-field
                v-model="form.takaran_saji"
                label="Takaran Saji"
                :rules="fieldEmpty"
                required
              ></v-text-field>
              <v-text-field
                v-model="form.harga"
                label="Harga"
                :rules="fieldEmpty"
                required
              ></v-text-field>
              <v-select
                v-model="form.kategori"
                :items="kategori"
                label="Kategori"
              ></v-select>
              <v-text-field
                v-model="form.unit"
                label="Unit"
                :rules="fieldEmpty"
                required
              ></v-text-field>
              <v-text-field
                v-model="form.deskripsi"
                label="Deskripsi"
                :rules="fieldEmpty"
                required
              ></v-text-field>
              <v-select
                v-model="form.id_bahan"
                label="Bahan"
                :items="bahans"
                item-text="nama_bahan"
                item-value="id"
                :rules="fieldEmpty"
                required
              ></v-select>
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
          Anda yakin ingin menghapus Menu ini?
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
      kategori: ["Makanan Utama", "Side Dish", "Minuman"],
      load: false,
      snackbar: false,
      error_message: "",
      color: "",
      bahans: [],
      search: null,
      dialog: false,
      dialogConfirm: false,
      headers: [
        {
          text: "Nama menu",
          class: "pink lighten-4",
          align: "start",
          sortable: true,
          value: "nama_menu",
        },
        {
          text: "Takaran Saji",
          class: "pink lighten-4",
          value: "takaran_saji",
        },
        { text: "Harga", class: "pink lighten-4", value: "harga" },
        { text: "Kategori", class: "pink lighten-4", value: "kategori" },
        { text: "Unit", class: "pink lighten-4", value: "unit" },
        { text: "Deskripsi", class: "pink lighten-4", value: "deskripsi" },
        { text: "Nama Bahan", class: "pink lighten-4", value: "nama_bahan" },
        { text: "", class: "pink lighten-4", value: "actions" },
      ],
      product: new FormData(),
      products: [],
      form: {
        nama_menu: null,
        takaran_saji: null,
        harga: null,
        kategori: null,
        unit: null,
        deskripsi: null,
        id_bahan: null,
      },
      deleteId: "",
      editId: "",
      fieldEmpty: [(v) => !!v || "Field tidak boleh kosong"],
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
      //                this.inputType = "Tambah";
    },
    readData() {
      var url = this.$api + "/menu";
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
    readDataBahan() {
      var url = this.$api + "/bahan";
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.bahans = response.data.data;
          console.log(this.bahans);
        });
    },
    save() {
      // console.log('nama customer adalah' + this.form.nama_customer);
      this.product.append("nama_menu", this.form.nama_menu);
      this.product.append("takaran_saji", this.form.takaran_saji);
      this.product.append("harga", this.form.harga);
      this.product.append("kategori", this.form.kategori);
      this.product.append("unit", this.form.unit);
      this.product.append("deskripsi", this.form.deskripsi);
      this.product.append("id_bahan", this.form.id_bahan);
      var url = this.$api + "/menu/";
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
        nama_menu: this.form.nama_menu,
        takaran_saji: this.form.takaran_saji,
        harga: this.form.harga,
        kategori: this.form.kategori,
        unit: this.form.unit,
        deskripsi: this.form.deskripsi,
        id_bahan: this.form.id_bahan,
      };
      var url = this.$api + "/menu/" + this.editId;
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
      var url = this.$api + "/hapusmenu/" + this.deleteId;
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
      this.form.nama_menu = item.nama_menu;
      this.form.takaran_saji = item.takaran_saji;
      this.form.harga = item.harga;
      this.form.kategori = item.kategori;
      this.form.unit = item.unit;
      this.form.deskripsi = item.deskripsi;
      this.form.id_bahan = item.id_bahan;
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
      this.readData();
      this.dialog = false;
      this.inputType = "Tambah";
      this.$refs.form.reset();
    },
    resetForm() {
      this.form = {
        nama_menu: null,
        takaran_saji: null,
        harga: null,
        kategori: null,
        unit: null,
        deskripsi: null,
        id_bahan: null,
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
    this.readDataBahan();
  },
};
</script>
