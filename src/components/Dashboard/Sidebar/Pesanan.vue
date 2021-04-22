<template>
  <v-main>
    <h3 class="text-h3 font-weight-medium mb-5">
      🥢Pesanan🥢
    </h3>
    <v-card v-if="login == 'Chef'">
      <v-data-table
        class="elevation-5 ml-5 mr-3"
        :headers="headersChef"
        :items="datasChef"
      >
        <!-- ISI DATA WARGA GOES HERE -->
        <template v-slot:[`item.actions`]="{ item }">
          <v-btn
            small
            class="mr-2 pink lighten-4 black--text"
            @click="finishChef(item)"
          >
            Finish
          </v-btn>
        </template>
      </v-data-table>
    </v-card>
    <v-card v-else-if="login == 'Waiter'">
      <v-data-table
        class="elevation-5 ml-5 mr-3"
        :headers="headersWaiter"
        :items="datasWaiter"
      >
        <!-- ISI DATA WARGA GOES HERE -->
        <template v-slot:[`item.actions`]="{ item }">
          <v-btn
            small
            class="mr-2 pink lighten-4 black--text"
            @click="finishWaiter(item)"
          >
            Finish
          </v-btn>
        </template>
      </v-data-table>
    </v-card>
    <v-card v-else>
      <v-row>
        <v-col>
          <v-data-table
            class="elevation-5 ml-5 mr-3"
            :headers="headersChef"
            :items="datasChef"
          >
            <!-- ISI DATA WARGA GOES HERE -->
            <template v-slot:[`item.actions`]="{ item }">
              <v-btn
                small
                class="mr-2 pink lighten-4 black--text"
                @click="finishChef(item)"
              >
                Finish
              </v-btn>
            </template>
          </v-data-table>
        </v-col>
        <v-col>
          <v-data-table
            class="elevation-5 ml-5 mr-3"
            :headers="headersWaiter"
            :items="datasWaiter"
          >
            <!-- ISI DATA WARGA GOES HERE -->
            <template v-slot:[`item.actions`]="{ item }">
              <v-btn
                small
                class="mr-2 pink lighten-4 black--text"
                @click="finishWaiter(item)"
              >
                Finish
              </v-btn>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
    </v-card>
    <v-snackbar v-model="snackbar" :color="color" timeout="2000" bottom>
      {{ error_message }}
    </v-snackbar>
  </v-main>
</template>
<script>
export default {
  data() {
    return {
      login: localStorage.getItem("jabatan"),
      datasChef: [],
      datasWaiter: [],
      datas: new FormData(),
      snackbar: false,
      color: "",
      load: false,
      error_message: "",
      editId: "",
      headersWaiter: [
        {
          text: "Nama Menu",
          align: "start",
          sortable: true,
          value: "nama_menu",
        },
        { text: "Jumlah", value: "jumlah" },
        { text: "Status", value: "status_chef" },
        { text: "ID Transaksi", value: "id_transaksi" },
        { text: "", value: "actions" },
      ],
      headersChef: [
        {
          text: "Nama Menu",
          align: "start",
          sortable: true,
          value: "nama_menu",
        },
        { text: "Jumlah", value: "jumlah" },
        { text: "Status", value: "status_chef" },
        { text: "ID Transaksi", value: "id_transaksi" },
        { text: "", value: "actions" },
      ],
    };
  },
  methods: {
    readDataWaiter() {
      var url = this.$api + "/detailtransaksiwaiter";
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          console.log("test");
          console.log(response.data.message);
          this.datasWaiter = response.data.data;
        });
    },
    readDataChef() {
      var url = this.$api + "/detailtransaksichef";
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          console.log("test");
          console.log(response.data.message);
          this.datasChef = response.data.data;
        });
    },
    finishChef(item) {
      let newData = {
        status_chef: "Ready To Serve",
      };
      var url = this.$api + "/detailtransaksi/" + item.id;
      this.load = true;
      for (var pair of this.datas.entries()) {
        console.log(pair[0] + ", " + pair[1]);
      }
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
          //this.close();
          this.readDataWaiter();
          this.readDataChef(); //mengambil data
          //this.resetForm();
          // this.inputType = "Tambah";
        })
        .catch((error) => {
          this.error_message = error.response.data.message;
          this.color = "red";
          this.snackbar = true;
          this.load = false;
        });
    },
    finishWaiter(item) {
      let newData = {
        status_chef: "Already Served",
      };
      var url = this.$api + "/detailtransaksi/" + item.id;
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
          // this.close();
          this.readDataWaiter(); //mengambil data
          //this.resetForm();
          // this.inputType = "Tambah";
        })
        .catch((error) => {
          this.error_message = error.response.data.message;
          this.color = "red";
          this.snackbar = true;
          this.load = false;
        });
    },
  },
  mounted() {
    this.readDataWaiter();
    this.readDataChef();
  },
};
</script>
