var control = new Object();

control.verynginx_config = {};
control.config_vm = null; 

paceOptions = {
    catchupTime: 1,
    minTime: 1,
    restartOnRequestAfter: 5,
    ajax : {
        trackMethods:["GET","POST"],
    }
};

control.init = function(){
    control.switch_to_interface('login');
    $(".init_click").click();

	// Reposition when a modal is shown
    $('.modal').on('show.bs.modal', control.modal_reposition);
    // Reposition when the window is resized
    $(window).on('resize', function() {
        $('.modal:visible').each(control.modal_reposition );
    });

	if( localStorage.dashboard_status_enable_animation == undefined ){
        localStorage.dashboard_status_enable_animation = "true";
	}

	if( localStorage.dashboard_status_refresh_interval == undefined ){
        localStorage.dashboard_status_refresh_interval = '3';
	}
}

control.login = function(user,password){
    console.log("login with:",user,password);
    $.post("/verynginx/login",data={user:user,password:password},function(data,status){
        if( data['ret'] == "success" ){
            control.switch_to_interface('dashboard');
            control.get_config();
            control.notify("Login Success");
            window.setTimeout( monitor.build_chart, 0 );
            window.setTimeout( monitor.start, 0 );
        }
    });
}

control.logout = function(){
    monitor.stop();
    $.cookie( 'verynginx_user', null,{ path: '/verynginx'} );
    $.cookie( 'verynginx_session', null, { path: '/verynginx'} );  
    control.switch_to_interface('login');
    control.notify("Logout Success");
}

control.get_config = function(){
    $.get("/verynginx/config",function(data,status){
        control.verynginx_config = data;
            
        if( control.config_vm != null ){
            control.config_vm.$data = control.verynginx_config;
            control.notify("获取配置成功");
            return;
        }

        control.config_vm = new Vue({
            el: '#verynginx_config',
            data: control.verynginx_config,
            computed : {
                all_config_json: function(){
                    return  JSON.stringify( control.verynginx_config , null, 2);
                }
            }
        });
    }); 
}

control.switch_to_interface = function( name ){
    $(".interface").hide();
    $("#interface_"+name).show();
}

control.switch_to_page = function( page ){
    $(".page").hide();
    $("#page_"+page).show();

    $(".topnav").removeClass("active");
    $("#topnav_"+page).addClass("active");

	monitor.update_config();
}

control.switch_config_nav_group = function( item ){

	var group_name = $(item).attr("group");
    $(".leftnav_group").hide();
    $(".leftnav_1").removeClass('active');
	$(item).addClass('active');

	var config_group_container = $(".leftnav_group[group=" + group_name + "]" );
	config_group_container.show();
    
	//switch to firsh children config page
    $(".leftnav_group[group=" + group_name + "]" ).children()[0].click();
}

control.switch_to_config = function( item ){
    var config_name = $(item).attr("config_name");
    $(".config_container").hide();
    $("#config_" + config_name ).show();
    
    $(".leftnav_2").removeClass('active');
    $(item).addClass('active');

    //show tips of the config 
    tips.show_tips(config_name);
}


control.config_add = function(name,value){
    control.verynginx_config[name].push(value);
}

control.config_mod = function(name,index,value){

    console.log('-->',name,index,value);
    
    if( value == null ){
        control.verynginx_config[name].$remove( control.verynginx_config[name][index] );
    }else{
        //control.verynginx_config[name].$set( index, control.verynginx_config[name][index] );
    }

}

control.config_move_up = function(name,index){
    
    if(index == 0){
        control.notify("已经是最前面了");
        return;
    }

    var tmp = control.verynginx_config[name][index-1];
    control.verynginx_config[name].$set(index-1, control.verynginx_config[name][index]);
    control.verynginx_config[name].$set(index, tmp);
}

control.config_move_down = function(name,index){
    if(index >= control.verynginx_config[name].length - 1){
        control.notify("已经是最后面了");
        return;
    }
    
    var tmp = control.verynginx_config[name][index+1];
    control.verynginx_config[name].$set(index+1, control.verynginx_config[name][index]);
    control.verynginx_config[name].$set(index, tmp);
}

control.save_config = function(){
    console.log("save_config");
	var config_json = JSON.stringify( control.verynginx_config , null, 2);

    $.post("/verynginx/config",{ config:config_json },function(data){
        console.log(data);
        if( data['ret'] == 'success' ){
            control.notify("保存配置成功");
		}else{
            control.notify("保存配置失败");
		}
	})
}

control.notify = function(message){
	$.smkAlert({
        text: message,
        type: 'info',
        position:"top-right",
        time:5,
    });
}

control.open_dashboard_config = function(){
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

    control.status_dashboard_update_interval_label();
}

control.save_status_dashboard_config = function(){
    
    var enable_animation = $('#status_config_modal [name=enable_animation]')[0].checked;
    var refresh_interval = $('#status_config_modal [name=refresh_interval]').val();

    localStorage.dashboard_status_enable_animation = enable_animation;
    localStorage.dashboard_status_refresh_interval = refresh_interval;

    $('#status_config_modal').modal('hide');
    monitor.update_config();
}

control.status_dashboard_update_interval_label = function(){

    var refresh_interval = $('#status_config_modal [name=refresh_interval]').val();
    $('#status_config_modal [name=refresh_interval_label]').text(refresh_interval + "s");
}

/**
 * Vertically center Bootstrap 3 modals so they aren't always stuck at the top
 */

control.modal_reposition = function() {
	var modal = $(this),
	dialog = modal.find('.modal-dialog');
	modal.css('display', 'block');
	
	// Dividing by two centers the modal exactly, but dividing by three 
	// or four works better for larger screens.
	dialog.css("margin-top", Math.max(0, ($(window).height() - dialog.height()) / 2));
}

