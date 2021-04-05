import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

function importComponent(path){
    return () => import(`./components/${path}.vue`)
}

Vue.use(VueRouter);

const router = new VueRouter({
    mode: "history",
    routes : [
        
        {
            path:"/login",
            name:"Login",
            meta:{title: 'Login'},
            component:importComponent('Login'),
        },
        // {
        //     path:"/register",
        //     name:"Register",
        //     meta:{title: 'Register'},
        //     component:importComponent('Register'),
        // },
        {
            path:"/",
            name:"Dashboard",
            meta:{title: 'Dashboard'},
            component:importComponent('Dashboard/DashboardLayout'),
            beforeEnter: (to,from,next)=>
            {
                if(localStorage.getItem('jabatan'))
                {
                    next()
                }
                else
                {
                    next('/login');
                }
            },
            children:
            [   
                // Show all data family
                // {   
                //     path : "/Dashboard",
                //     name:"Dashboard",
                //     meta: {title: 'Dashboard'},
                //     component: importComponent('Dashboard/DashboardLayout'),
                // },
                // Karyawan
                {
                   path: "/karyawan",
                   name: "Karyawan",
                   meta: {title: 'Karyawan'},
                   component: importComponent('Dashboard/Sidebar/Karyawan'),
                },
                // Meja
                {
                    path: "/meja",
                    name: "Meja",
                    meta: {title: 'Meja'},
                    component: importComponent('Dashboard/Sidebar/Meja'),
                },
                // Bahan
                {
                    path: "/bahan",
                    name: "Bahan",
                    meta: {title: 'Bahan'},
                    component: importComponent('Dashboard/Sidebar/Bahan'),
                },
                // Customer
                {
                    path: "/customer",
                    name: "Customer",
                    meta: {title: 'Customer'},
                    component: importComponent('Dashboard/Sidebar/Customer'),
                },// Bahan Harian
                {
                    path: "/bahanharian",
                    name: "Bahan Harian",
                    meta: {title: 'Bahan Harian'},
                    component: importComponent('Dashboard/Sidebar/BahanHarian'),
                },
                // Detail Transaksi
                {
                    path: "/detailtransaksi",
                    name: "Detail Transaksi",
                    meta: {title: 'Detail Transaksi'},
                    component: importComponent('Dashboard/Sidebar/DetailTransaksi'),
                },  
                // Kartu
                {
                    path: "/kartu",
                    name: "Kartu",
                    meta: {title: 'Kartu'},
                    component: importComponent('Dashboard/Sidebar/Kartu'),
                }, 
                // Menu
                {
                    path: "/menu",
                    name: "Menu",
                    meta: {title: 'Menu'},
                    component: importComponent('Dashboard/Sidebar/Menu'),
                }, 
                //Reservasi
                {
                    path: "/reservasi",
                    name: "Reservasi",
                    meta: {title: 'Reservasi'},
                    component: importComponent('Dashboard/Sidebar/Reservasi'),
                }, 
                //Riwayat Masuk
                {
                    path: "/riwayatbahanmasuk",
                    name: "Riwayat Bahan Masuk",
                    meta: {title: 'Riwayat Bahan Masuk'},
                    component: importComponent('Dashboard/Sidebar/RiwayatBahanMasuk'),
                }, 
                //Riwayat Keluar
                {
                    path: "/riwayatbahankeluar",
                    name: "Riwayat Bahan Keluar",
                    meta: {title: 'Riwayat Bahan Keluar'},
                    component: importComponent('Dashboard/Sidebar/RiwayatBahanKeluar'),
                },
                 //Transaksi
                 {
                    path: "/transaksi",
                    name: " Transaksi",
                    meta: {title: ' Transaksi'},
                    component: importComponent('Dashboard/Sidebar/Transaksi'),
                },   
                //Laporan
                {
                    path: "/laporan",
                    name: " Laporan",
                    meta: {title: ' Laporan'},
                    component: importComponent('Dashboard/Sidebar/Laporan'),
                },  
                //Pesanan
                {
                    path: "/pesanan",
                    name: " Pesanan",
                    meta: {title: ' Pesanan'},
                    component: importComponent('Dashboard/Sidebar/Pesanan'),
                },  
            ]
        },
        {
            path:"/dbAdmin",
            name:"DashboardAdmin",
            meta:{title: 'Admin Section'},
            component:importComponent('dashboardAdmin/DashboardAdminLayout'),
            // beforeEnter: (to,from,next)=>
            // {
            //     if(localStorage.getItem('no_kk'))
            //     {
            //         next()
            //     }
            //     else
            //     {
            //         next('/login');
            //     }
            // },
            children:
            [   
                // Show all data family
                {   
                    path : "/detailKeluarga",
                    name:"detailKeluarga",
                    meta: {title: 'Detail Keluarga'},
                    component: importComponent('dashboardAdmin/sidebar/DetailKeluarga'),
                },
                // Profile
                {
                   path: "/mailbox",
                   name: "mailbox",
                   meta: {title: 'Mailbox'},
                   component: importComponent('dashboardAdmin/sidebar/Mailbox'),
                },
                // Pengumuman
                {
                    path: "/pengumumanAdmin",
                    name: "pengumumanAdmin",
                    meta: {title: 'Pengumuman Admin'},
                    component: importComponent('dashboardAdmin/sidebar/PengumumanAdmin'),
                },
            ]
        },



    ]
});

router.beforeEach((to, from ,next)=>{
    // if(to.name != 'Login' && !localStorage.getItem('token'))
    // {
    //     next({name:'Login'})
    // }
    document.title = to.meta.title
    next()
});

export default router;