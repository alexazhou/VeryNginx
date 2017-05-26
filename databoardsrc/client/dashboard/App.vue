<template>
  <div>
    <router-view >
  
    </router-view>
  </div>   
</template>

<style>
  @reset-global mobile;

  html {
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -webkit-tap-highlight-color: transparent;
  height: 100%;
}

  body {
  margin: 0;
  font-size: 1.1rem;
  font-family: "Helvetica Neue", Helvetica, STHeiTi, Arial, sans-serif;
}
  html, body {
    background-color: #fafafa;
    -webkit-overflow-scrolling: touch;
    user-select: none;
  }


</style>

<script type="text/babel">
 import bootstrap from 'bootstrap/dist/css/bootstrap.min.css'
 export default {
   data() {
     return{}
   },
   computed: {
     selected(){       
       if(this.$route.path=='/') return "工单";
       if(this.$route.path=='/my')return '我的';
       if(this.$route.path=='/newticket') return '报单';
       return '';
     },
     showheadertab() {
       return this.$store.state.headertab.showheadertab;
     },
     headertabs() {
       return this.$store.state.headertab.tabs;
     },
     curheadertab() {
       return this.$store.state.headertab.curheadertab;
     },
     visible() {
       return ['/', '/header', '/search'].indexOf(this.$route.path) < 0;
     },
     showback() {
       return ['/', '/my', '/newticket'].indexOf(this.$route.path) < 0;
     },
     showtab(){
       if(this.$route.path=='/'||this.$route.path=='/my'||this.$route.path=='/newticket')return true;
       return false;
     }
   },
   created() {
     console.log('app created')
      
     //init
     //获取令牌
      var token = localStorage.getItem('ticket.token');
      if(token){this.$store.commit('UPDATE_TOKEN', token)}

     //获取url参数
      var cb=this.getQueryString('cb')||''
      var appid=this.getQueryString('appid')||''
      var url=this.getQueryString('url')||''
     //校验用户信息
     var that=this;
     console.log(cb,appid,url)
     if(cb!=''&appid!=''&url!=''){
     this.$http.post('/api/qylogin',{cb,appid,url})
      .then(function(res){
        //存token
          localStorage.setItem('ticket.token', res.data.token);
          that.$store.commit('UPDATE_TOKEN', res.data.token)
        //跳转
        if(url.indexOf('#')!=-1){
          console.log('设置跳转路由'+url.slice(url.indexOf('#')+2))    
        //保存路由
         localStorage.setItem('lastroute',url.slice(url.indexOf('#')+2))
          // 直接302跳转
          window.location.href=url;
        }
      })}
      //前置跳转
       var last= localStorage.getItem('lastroute')
       if(last){         
         localStorage.removeItem('lastroute');
         this.$router.replace(last);         
       }

     //获取当前用户
     var getitem = localStorage.getItem('userinfo');
     if (!getitem) {
       this.$http.get('/api/account').then(function (res) {
         if (res.data.status == 'success') {
           localStorage.setItem('userinfo', JSON.stringify(res.data.data));
           this.$store.commit('UPDATE_USEINFO', res.data.data)
         } else {
           //not login

         }
       })
     } else {
       this.$store.commit('UPDATE_USEINFO', JSON.parse(getitem))
     }


   },
   methods: {
     handleClose() {
       alert('close this page');
     },
     getQueryString(name) {
       var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
       var r = window.location.search.substr(1).match(reg);
       if (r != null) return unescape(r[2]);
       return null;
     },
     goback() {
         this.$router.back(-1);
       
     },
     changecurtab(name) {
       this.$store.commit('UPDATE_HEADERTAB', name)
     }
   }
 };
</script>
