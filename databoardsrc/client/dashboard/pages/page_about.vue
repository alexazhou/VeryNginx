<template>
    <div id="interface_login" class="interface">
        <div class="panel panel-default">
            <div class="panel-heading">
                <h3 class="panel-title" >VeryNginx Login</h3>
            </div>
            <div class="panel-body">
                <div class="form-horizontal" id='login_form'>
                    <div class="form-group">
                        <label for="inputEmail3" class="col-sm-2 control-label">User</label>
                        <div class="col-sm-10">
                            <input v-model='user' type="text" class="form-control" name="user" placeholder="User name">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="inputPassword3" class="col-sm-2 control-label">Password</label>
                        <div class="col-sm-10">
                            <input v-model='password' type="password" class="form-control" name="password" placeholder="Password">
                        </div>
                    </div>
                    <div class="form-group">
                        <div class="col-sm-offset-2 col-sm-10">
                            <button class="btn btn-default" @click="login">Log in</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div> 
</template>

<style>
#interface_login {
    width:500px;
    margin-left:auto;
    margin-right:auto;
    margin-top:50px;
}


</style>

<script type="text/babel">
import cookie from 'cookie_js'
 export default {
   data() {
     return{
         user:'',
         password:''
     }
   },
   computed: {
   
   },
   created() {

   },
   methods: {
      login(){
  
        this.$http.post("./login", {
            user:this.user,
            password:this.password
        }).then(function(res){
             var uri = document.location.pathname;
             var path = uri.substring(0, uri.lastIndexOf('/') );            
            for( name in res.data['cookies']  ){
                cookie.set( name, res.data['cookies'][name],{ path: path} );
            }
       

        }, function(res){

        })
        }
      
   }
 };
</script>
