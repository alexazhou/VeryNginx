var dashboard = new Object();

dashboard.verynginx_config = {};
dashboard.config_vm = null; 

paceOptions = {
    catchupTime: 1,
    minTime: 1,
    restartOnRequestAfter: 5,
    ajax : {
        trackMethods:["GET","POST"],
    }
};

dashboard.init = function(){
    dashboard.switch_to_interface('login');
	Vue.filter('re_test', dashboard.config_test_re);
    $(".init_click").click();

	// Reposition when a modal is shown
    $('.modal').on('show.bs.modal', dashboard.modal_reposition);
    // Reposition when the window is resized
    $(window).on('resize', function() {
        $('.modal:visible').each(dashboard.modal_reposition );
    });

	if( localStorage.dashboard_status_enable_animation == undefined ){
        localStorage.dashboard_status_enable_animation = "true";
	}

	if( localStorage.dashboard_status_refresh_interval == undefined ){
        localStorage.dashboard_status_refresh_interval = '3';
	}
}

dashboard.login = function(user,password){
    console.log("login with:",user,password);
    $.post("/verynginx/login",data={user:user,password:password},function(data,status){
        if( data['ret'] == "success" ){
            dashboard.switch_to_interface('dashboard');
            dashboard.get_config();
            dashboard.notify("Login Success");
            window.setTimeout( monitor.build_chart, 0 );
            window.setTimeout( monitor.start, 0 );
        }
    });
}

dashboard.logout = function(){
    monitor.stop();
    $.cookie( 'verynginx_user', null,{ path: '/verynginx'} );
    $.cookie( 'verynginx_session', null, { path: '/verynginx'} );  
    dashboard.switch_to_interface('login');
    dashboard.notify("Logout Success");
}

dashboard.get_config = function(){
    $.get("/verynginx/config",function(data,status){
        dashboard.verynginx_config = data;
            
        if( dashboard.config_vm != null ){
            dashboard.config_vm.$data = dashboard.verynginx_config;
            dashboard.notify("获取配置成功");
            return;
        }

        dashboard.config_vm = new Vue({
            el: '#verynginx_config',
            data: dashboard.verynginx_config,
            computed : {
                all_config_json: function(){
                    return  JSON.stringify( dashboard.verynginx_config , null, 2);
                }
            }
        });

    }); 
}

dashboard.switch_to_interface = function( name ){
    $(".interface").hide();
    $("#interface_"+name).show();
}

dashboard.switch_to_page = function( page ){
    $(".page").hide();
    $("#page_"+page).show();

    $(".topnav").removeClass("active");
    $("#topnav_"+page).addClass("active");

	monitor.update_config();
}

dashboard.switch_config_nav_group = function( item ){

	var group_name = $(item).attr("group");
    $(".leftnav_group").hide();
    $(".leftnav_1").removeClass('active');
	$(item).addClass('active');

	var config_group_container = $(".leftnav_group[group=" + group_name + "]" );
	config_group_container.show();
    
	//switch to firsh children config page
    $(".leftnav_group[group=" + group_name + "]" ).children()[0].click();
}

dashboard.switch_to_config = function( item ){
    var config_name = $(item).attr("config_name");
    $(".config_container").hide();
    $("#config_" + config_name ).show();
    
    $(".leftnav_2").removeClass('active');
    $(item).addClass('active');

    //show tips of the config 
    tips.show_tips(config_name);
}

dashboard.config_test_re = function( re , s_from_id){
    
	console.log('re:',re);
	console.log('s:',s_from_id);

	var reg=new RegExp(re,'igm');
	if( $("#"+s_from_id).val().match( reg ) != null ){
	    console.log('matched');
	    return "matched";
	}

	return '';
}

dashboard.config_add = function(name,value){
    dashboard.verynginx_config[name].push(value);
}

dashboard.config_mod = function(name,index,value){

    console.log('-->',name,index,value);
    
    if( value == null ){
        dashboard.verynginx_config[name].$remove( dashboard.verynginx_config[name][index] );
    }else{
        //dashboard.verynginx_config[name].$set( index, dashboard.verynginx_config[name][index] );
    }

}

dashboard.config_move_up = function(name,index){
    
    if(index == 0){
        dashboard.notify("已经是最前面了");
        return;
    }

    var tmp = dashboard.verynginx_config[name][index-1];
    dashboard.verynginx_config[name].$set(index-1, dashboard.verynginx_config[name][index]);
    dashboard.verynginx_config[name].$set(index, tmp);
}

dashboard.config_move_down = function(name,index){
    if(index >= dashboard.verynginx_config[name].length - 1){
        dashboard.notify("已经是最后面了");
        return;
    }
    
    var tmp = dashboard.verynginx_config[name][index+1];
    dashboard.verynginx_config[name].$set(index+1, dashboard.verynginx_config[name][index]);
    dashboard.verynginx_config[name].$set(index, tmp);
}

dashboard.save_config = function(){
    console.log("save_config");
	var config_json = JSON.stringify( dashboard.verynginx_config , null, 2);

    $.post("/verynginx/config",{ config:config_json },function(data){
        console.log(data);
        if( data['ret'] == 'success' ){
            dashboard.notify("保存配置成功");
		}else{
            dashboard.notify("保存配置失败");
		}
	})
}

dashboard.notify = function(message){
	$.smkAlert({
        text: message,
        type: 'info',
        position:"top-right",
        time:5,
    });
}

dashboard.open_dashboard_config = function(){
    //load status dashboard config
    $('#status_config_modal').modal('show');

    var enable_animation = localStorage.dashboard_status_enable_animation;
    var refresh_interval = localStorage.dashboard_status_refresh_interval;

    if( enable_animation != undefined ){
        if( enable_animation == "false" ){
            enable_animation = false;
		}else{
            enable_animation = true;
		}
		$('#status_config_modal [name=enable_animation]')[0].checked = enable_animation;
    }
    
    if( refresh_interval != undefined ){
        $('#status_config_modal [name=refresh_interval]').val( refresh_interval );
    }

    dashboard.status_dashboard_update_interval_label();
}

dashboard.save_status_dashboard_config = function(){
    
    var enable_animation = $('#status_config_modal [name=enable_animation]')[0].checked;
    var refresh_interval = $('#status_config_modal [name=refresh_interval]').val();

    localStorage.dashboard_status_enable_animation = enable_animation;
    localStorage.dashboard_status_refresh_interval = refresh_interval;

    $('#status_config_modal').modal('hide');
    monitor.update_config();
}

dashboard.status_dashboard_update_interval_label = function(){

    var refresh_interval = $('#status_config_modal [name=refresh_interval]').val();
    $('#status_config_modal [name=refresh_interval_label]').text(refresh_interval + "s");
}

/**
 * Vertically center Bootstrap 3 modals so they aren't always stuck at the top
 */

dashboard.modal_reposition = function() {
	var modal = $(this),
	dialog = modal.find('.modal-dialog');
	modal.css('display', 'block');
	
	// Dividing by two centers the modal exactly, but dividing by three 
	// or four works better for larger screens.
	dialog.css("margin-top", Math.max(0, ($(window).height() - dialog.height()) / 2));
}

