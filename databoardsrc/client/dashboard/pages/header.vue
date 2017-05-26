<template>
        <nav class="navbar navbar-default navbar-fixed-top">
            <div class="container-fluid">
                <!-- Brand and toggle get grouped for better mobile display -->
                <div class="navbar-header">
                    <a class="navbar-brand" href="#/status"  href="#">Nginx</a> 
                </div>
                <div class="collapse navbar-collapse">
                    <ul class="nav navbar-nav">
                        <li class="topnav" id="topnav_status" class="active" >
                            <a href="#" class="init_click" onclick="dashboard.switch_to_page('status')" >Status</a>
                        </li>
                        <li class="topnav" id="topnav_config"  >
                            <a href="#" onclick="dashboard.switch_to_page('config')" >Config</a>
                        </li>
                        <li class="topnav" id="topnav_summary" >
                            <a href="#" onclick="dashboard.switch_to_page('summary')" >Summary</a>
                        </li>
                        <li class="topnav"id="topnav_firewall" style="display:none">
                            <a href="#" onclick="dashboard.switch_to_page('firewall')" >防火墙</a>
                        </li>
                        <li class="topnav" id="topnav_about" >
                            <a href="#" onclick="dashboard.switch_to_page('about')" >About</a>
                        </li>
                    </ul>
                    <ul class="nav navbar-nav navbar-right">
                        <li class="topnav" id="topnav_logout" >
                            <a href="#" onclick="dashboard.logout()" >Logout</a>
                        </li>
                    </ul>
                </div>
            </div><!-- /.container-fluid -->
        </nav>
</template>

<style>



</style>

<script type="text/babel">

 export default {
   data() {
     return{
     
     }
   },
   computed: {
   
   },
   mounted() {

   },
   methods: {
     
   }
 };
</script>
