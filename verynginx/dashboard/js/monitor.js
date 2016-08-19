var monitor = new Object();

monitor.chart_size = 17;

monitor.refresh_timer = null;

monitor.chart_request = null;
monitor.chart_connection = null;

monitor.latest_status = null;

monitor.spin_list = [];

monitor.time_str = function(){
    var time_str = (new Date()).toTimeString();
    return time_str.split(' ')[0];
}


monitor.show_loading_img = function(){
    var default_opts = {
        length: 28
        ,radius: 32 // The radius of the inner circle
        ,width: 9 // The line thickness
        ,color: '#5190be' // #rgb or #rrggbb or array of colors
    }
    var sm_opts = {
        length: 28
        ,radius: 21 // The radius of the inner circle
        ,width: 6 // The line thickness
        ,color: '#5190be' // #rgb or #rrggbb or array of colors
    }
    
    var target = $('.monitor_container'); 
    for( var i=0; i<target.length; i++ ){
        var item = target[i];
        var size = $(item).attr('spin_size');
        var opts = default_opts;

        if( size == "sm" ){
            opts = sm_opts;  
        }
        var spinner = new Spinner( opts ).spin();
        item.appendChild(spinner.el);
        monitor.spin_list.push(spinner);
    } 
}

monitor.hide_loading_img = function(){
    for( var i=0; i<monitor.spin_list.length; i++ ){
        var spin = monitor.spin_list[i];
        spin.stop();
    } 
}

monitor.build_chart = function(){
    //request chart
    monitor.show_loading_img();
    var ctx_request = $("#chart_request").get(0).getContext("2d");
    var options_request={responsive:true};
    var data_request = {
        labels: [],
        datasets: [
            {
                label: "all request",
                fillColor: "rgba(220,220,220,0.2)",
                strokeColor: "rgba(220,220,220,1)",
                pointColor: "rgba(220,220,220,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(220,220,220,1)",
                data: []
            },
            {
                label: "200 request",
                fillColor: "rgba(151,187,205,0.2)",
                strokeColor: "rgba(151,187,205,1)",
                pointColor: "rgba(151,187,205,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(151,187,205,1)",
                data: []
            }
        ]
    };
    monitor.chart_request = new Chart(ctx_request).Line(data_request,options_request);
    
    //connection chart
    var ctx_connection = $("#chart_connection").get(0).getContext("2d");
    var options_connection={ responsive:true };
    var data_connection = {
        labels: [],
        datasets: [
            {
                label: "connection",
                fillColor: "rgba(220,220,220,0.2)",
                strokeColor: "rgba(220,220,220,1)",
                pointColor: "rgba(220,220,220,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(220,220,220,1)",
                data: []
            },
            {
                label: "writing",
                fillColor: "rgba(151,187,205,0.2)",
                strokeColor: "rgba(151,187,205,1)",
                pointColor: "rgba(151,187,205,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(151,187,205,1)",
                data: []
            },
            {
                label: "reading",
                fillColor: "rgba(151,205,187,0.2)",
                strokeColor: "rgba(151,205,187,1)",
                pointColor: "rgba(151,205,187,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(151,205,187,1)",
                data: []
            }


        ]
    };
    monitor.chart_connection = new Chart(ctx_connection).Line(data_connection,options_connection);

    //response time chart
    var ctx_response_time = $("#chart_response_time").get(0).getContext("2d");
    var options_response_time={ responsive:true };
    var data_response_time = {
        labels: [],
        datasets: [
            {
                label: "response_time",
                fillColor: "rgba(220,220,220,0.2)",
                strokeColor: "rgba(220,220,220,1)",
                pointColor: "rgba(220,220,220,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(220,220,220,1)",
                data: []
            },
        ]
    };
    monitor.chart_response_time = new Chart(ctx_response_time).Line(data_response_time,options_response_time);
    
    //traffic
    var ctx_traffic = $("#chart_traffic").get(0).getContext("2d");
    var options_traffic={ responsive:true };
    var data_traffic = {
        labels: [],
        datasets: [
            {
                label: "traffic_read",
                fillColor: "rgba(220,220,220,0.2)",
                strokeColor: "rgba(220,220,220,1)",
                pointColor: "rgba(220,220,220,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(220,220,220,1)",
                data: []
            },
            {
                label: "traffic_write",
                fillColor: "rgba(151,187,205,0.2)",
                strokeColor: "rgba(151,187,205,1)",
                pointColor: "rgba(151,187,205,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(151,187,205,1)",
                data: []
            }

        ]
    };

    monitor.chart_traffic = new Chart(ctx_traffic).Line(data_traffic,options_traffic);

    //add visibilityChange event listener for different web browser
    var hidden, state, visibilityChange; 
    if (typeof document.hidden !== "undefined") {
        hidden = "hidden";
        visibilityChange = "visibilitychange";
        state = "visibilityState";
    } else if (typeof document.mozHidden !== "undefined") {
        hidden = "mozHidden";
        visibilityChange = "mozvisibilitychange";
        state = "mozVisibilityState";
    } else if (typeof document.msHidden !== "undefined") {
        hidden = "msHidden";
        visibilityChange = "msvisibilitychange";
        state = "msVisibilityState";
    } else if (typeof document.webkitHidden !== "undefined") {
        hidden = "webkitHidden";
        visibilityChange = "webkitvisibilitychange";
        state = "webkitVisibilityState";
    }

    var on_change = function(){
        if( document[state] != hidden ){
            console.log('on visiable');
            if( localStorage.dashboard_status_enable_animation == "true" ){
                monitor.animation_enable();
            }
        }else{
            console.log('on hidden');
            monitor.animation_disable();
        }
    };

    // add event listener for visibilityChange
    document.addEventListener( visibilityChange, on_change );

}

monitor.start = function(){
   
    var refresh_interval = 3;
    if( localStorage.dashboard_status_refresh_interval != undefined ){
        refresh_interval = parseInt( localStorage.dashboard_status_refresh_interval );
    }

    if( monitor.refresh_timer != null ){
        console.log("Error:Monitor is already running");
        return;
    }

    if( monitor.chart_request == null || monitor.chart_connection == null || monitor.chart_response_time == null || monitor.chart_traffic == null ){
        console.log("Error:Monitor chart not init");
        return;
    }

    var enable_animation = localStorage.dashboard_status_enable_animation;
    if( enable_animation == 'true' && $('#page_status').is(":visible") ){
        monitor.animation_enable(); 
    }else{
        monitor.animation_disable();
    }
    
    monitor.refresh_timer = window.setInterval( monitor.refresh , refresh_interval * 1000);
    monitor.refresh();
}

monitor.stop = function(){
    if( monitor.refresh_timer != null ){
        window.clearInterval( monitor.refresh_timer );
        monitor.refresh_timer = null;
    }
}

monitor.animation_disable = function(){
    monitor.chart_request.options['animation'] = false;
    monitor.chart_connection.options['animation'] = false;
    monitor.chart_response_time.options['animation'] = false;
    monitor.chart_traffic.options['animation'] = false;
}

monitor.animation_enable = function(){
    monitor.chart_request.options['animation'] = true;
    monitor.chart_connection.options['animation'] = true;
    monitor.chart_response_time.options['animation'] = true;
    monitor.chart_traffic.options['animation'] = true;
}

monitor.refresh = function(){
    //console.log("monitor refresh");

    $.get("./status",function(data,status){
        if( status != 'success' ){
            return;
        }

        //console.log('status:',status);
        //console.log('data:',data);
        if( monitor.latest_status != null ){
            var time_change = data['time'] - monitor.latest_status['time'];
            //console.log('time_change',time_change);
            if(time_change == 0 ){
                return;
            }

            if( monitor.spin_list.length != 0 ){
                monitor.hide_loading_img();
            } 

            var requests_all_change = data['request_all_count'] - monitor.latest_status['request_all_count']; 
            var requests_success_change = data['request_success_count'] - monitor.latest_status['request_success_count'];
            var connections_active = data['connections_active'];
            var connections_reading = data['connections_reading'];
            var connections_writing = data['connections_writing'];
            var avg_request_all = requests_all_change / time_change;
            var avg_request_success = requests_success_change / time_change;
            var time_str = monitor.time_str();
            var sub_label = '';
            var response_time_change = data['response_time_total'] - monitor.latest_status['response_time_total'];
            var avg_response_time = 0;
            if( requests_all_change != 0 ){
                avg_response_time = 1000 * response_time_change / requests_all_change ;
            }
            
            var traffic_read_change = data['traffic_read'] - monitor.latest_status['traffic_read'];
            var traffic_write_change = data['traffic_write'] - monitor.latest_status['traffic_write'];
            
            var avg_traffic_read = traffic_read_change / (time_change*1024);
            var avg_traffic_write = traffic_write_change / (time_change*1024);
            
            monitor.chart_request.addData([avg_request_all,avg_request_success], time_str);
            monitor.chart_connection.addData( [ connections_active,connections_writing,connections_reading ], sub_label )
            monitor.chart_response_time.addData( [ avg_response_time ], sub_label )
            monitor.chart_traffic.addData( [ avg_traffic_read, avg_traffic_write ], sub_label )

            while( monitor.chart_request.datasets[0].points.length >= monitor.chart_size ){
                monitor.chart_request.removeData();
            }
            
            while( monitor.chart_connection.datasets[0].points.length >= monitor.chart_size ){
                monitor.chart_connection.removeData();
            }
            
            while( monitor.chart_response_time.datasets[0].points.length >= monitor.chart_size ){
                monitor.chart_response_time.removeData();
            }
            
            while( monitor.chart_traffic.datasets[0].points.length >= monitor.chart_size ){
                monitor.chart_traffic.removeData();
            }
        }
        monitor.latest_status = data;
    });
}

monitor.update_config =function(){

    console.log('monitor.save_config');
    monitor.stop();
    monitor.start();
}


