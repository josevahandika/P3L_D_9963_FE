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
        {
            path:"/register",
            name:"Register",
            meta:{title: 'Register'},
            component:importComponent('Register'),
        },
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
                // Profile
                {
                   path: "/profile",
                   name: "profile",
                   meta: {title: 'Profile'},
                   component: importComponent('dashboard/sidebar/Profile'),
                },
                // Pengumuman
                {
                    path: "/pengumuman",
                    name: "pengumuman",
                    meta: {title: 'Pengumuman'},
                    component: importComponent('dashboard/sidebar/Pengumuman'),
                },
                // Pengumuman
                {
                    path: "/pesan",
                    name: "pesan",
                    meta: {title: 'Pesan'},
                    component: importComponent('dashboard/sidebar/Pesan'),
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