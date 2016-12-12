import Vue from 'vue'
import VueResource from 'vue-resource'
import VueRouter from 'vue-router'
import store from './vuex/store'
import routes from './route';
import App from './App'
import Mint from 'mint-ui'
import 'mint-ui/lib/style.css';
import util from './lib/util'
import { Rate } from 'element-ui'


const FastClick = require('fastclick')
FastClick.attach(document.body)

Vue.use(Mint);
Vue.use(VueResource);
Vue.http.interceptors.push((request, next) => {
  // set token request
  var tokenVal = localStorage.getItem("ticket.token");
  if (tokenVal) {
      request.headers.set('Authorization','Bearer '+tokenVal)
  }  // continue to next interceptor
  //set appid
  var appid=util.getQueryString('appid');
  if(appid){
    request.params.appid=appid;
  }
  next((response) => {
    if(response.status==401){
      //清空
        localStorage.removeItem('ticket.token')
        login()
    }
    //check403
    if(response.status==403){
      //login again     
      console.log('error 403')
       //清空
        localStorage.removeItem('ticket.token')
        login()
    }

  });
});

function login(){
  Vue.http.get('/admin/api/config?type=ticket').then(function(res){
    //
    if(res.data.status=='success'){
       location.href=res.data.data.ticketthirdlogin.replace('{url}',location.href)
    }
  })
}

Vue.use(VueRouter);


Vue.config.debug = true
const router = new VueRouter({
  base: __dirname,
  routes
});

new Vue({ // eslint-disable-line
  el: '#app',
  render: h => h(App),
  router,
  store
});

let indexScrollTop = 0;
router.beforeEach((route, redirect, next) => {
  if (route.path !== '/') {
    indexScrollTop = document.body.scrollTop;
  }
  document.title = route.meta.title || document.title;
  next();
});

router.afterEach(route => {
  if (route.path !== '/') {
    document.body.scrollTop = 0;
  } else {
    Vue.nextTick(() => {
      document.body.scrollTop = indexScrollTop;
    });
  }
});