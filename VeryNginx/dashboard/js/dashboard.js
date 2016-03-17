var dashboard = new Object();

dashboard.disable_log = false;
dashboard.last_failed_jqxhr;

paceOptions = {
    catchupTime: 1,
    minTime: 1,
    restartOnRequestAfter: 5,
    ajax : {
        trackMethods:["GET","POST"],
        ignoreURLs: ['./status']
    }
};

dashboard.init = function(){
    
    if( dashboard.disable_log == true ){
        window.console={log:function(){}};	
    }

    dashboard.switch_to_interface('login');
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

    //add event listener for input event on rule test form
    $(".config_test_container").each(function(){
        var test_action = eval( $(this).attr('test_action') ) ;
        var form_input = $(this).find(".config_test_input");
        
        form_input.on( 'input',test_action );
    });

    $( document ).ajaxError(function( e,jqxhr ) {
        dashboard.last_failed_jqxhr = jqxhr;
        var err = '';
        if( jqxhr.responseJSON != null && jqxhr.responseJSON['err'] != null ){
            err = '[' + jqxhr.responseJSON['err'] + ']' ;
        }else if( jqxhr.status != 0 ) {
            err = '[status code = ' + jqxhr.status + ']';
        }else{
            err = '[Network error]';
        }
        
        dashboard.notify('Ajax request failed' + err);
    });

    matcher_editor.init();
    window.onbeforeunload = dashboard.check_saved;
}

dashboard.login = function(user,password){
    console.log("login with:",user,password);
    $.post("./login",data={user:user,password:password},function(data,status){
        if( data['ret'] == "success" ){
            var uri = document.location.pathname;
            var path = uri.substring(0, uri.lastIndexOf('/') );
            $.cookie( 'verynginx_user', data['verynginx_user'],{ path: path} );
            $.cookie( 'verynginx_session', data['verynginx_session'], { path: path} ); 

            dashboard.switch_to_interface('dashboard');
            config.get_config();
            dashboard.notify("Login Success");
            window.setTimeout( monitor.build_chart, 0 );
            window.setTimeout( monitor.start, 0 );
        }else{
            dashboard.notify("login failed");
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

dashboard.check_saved = function(){

    if( config.config_vm == null )
        return null;
    if( config.config_vm.config_changed )
        return "Configs hasn't been saved. If you leave, then the new configuration will be lost.";

    return null;
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
    
    //if switch to summary page, make sure has a summary table
    if( page == "summary" ){
        data_stat.make_sure_have_table();
    }else if( page == "status" ){
        //generate a resize event to work around chart disapple bug of chart.js
        window.setTimeout( function(){ 
            window.dispatchEvent(new Event('resize')); 
        }, 200);
    }
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

dashboard.notify = function(message){
    $.smkAlert({
        text: message,
        type: 'info',
        position:"top-right",
        time:5,
    });
}

dashboard.open_modal_dashboard_config = function(){
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

