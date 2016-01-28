var monitor = new Object();

monitor.chart_size = 17;

monitor.refresh_timer = null;

monitor.chart_request = null;
monitor.chart_connection = null;

monitor.latest_status = null;

monitor.time_str = function(){
    var time_str = (new Date()).toTimeString();
    return time_str.split(' ')[0];
}

monitor.build_chart = function(){
    //request chart
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
}

monitor.start = function(){
    monitor.stop();
    monitor.refresh();
    monitor.refresh_timer = window.setInterval( monitor.refresh ,3000);


    // compatible for different web browser
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
            monitor.chart_request.options['animation'] = true;
            monitor.chart_connection.options['animation'] = true;
            monitor.chart_response_time.options['animation'] = true;
            monitor.chart_traffic.options['animation'] = true;
            console.log('on visiable');
        }else{
            monitor.chart_request.options['animation'] = false;
            monitor.chart_connection.options['animation'] = false;
            monitor.chart_response_time.options['animation'] = false;
            monitor.chart_traffic.options['animation'] = false;
            console.log('on hidden');
        }
    };

	// add event listener for visibilityChange
	document.addEventListener( visibilityChange, on_change );
}

monitor.stop = function(){
    if( monitor.refresh_timer != null ){
        window.clearInterval( monitor.refresh_timer );
    }
}

monitor.refresh = function(){
    console.log("monitor refresh");

    $.get("/verynginx/status",function(data,status){
        if( status != 'success' ){
            return;
        }

        //console.log('status:',status);
        //console.log('data:',data);
        if( monitor.latest_status != null ){
            var time_change = data['time'] - monitor.latest_status['time'];
            var requests_change = data['request_count'] - monitor.latest_status['request_count']; 
            var requests_200_change = data['200_request_count'] - monitor.latest_status['200_request_count'];
			var connections_active = data['connections_active'];
            var avg_request = requests_change / time_change;
            var avg_request_200 = requests_200_change / time_change;
			var time_str = monitor.time_str();
            var response_time_change = data['response_time_total'] - monitor.latest_status['response_time_total'];
            var avg_response_time = response_time_change / time_change;
            
            var traffic_read_change = data['traffic_read'] - monitor.latest_status['traffic_read'];
            var traffic_write_change = data['traffic_write'] - monitor.latest_status['traffic_write'];
            
            var avg_traffic_read = traffic_read_change / time_change;
            var avg_traffic_write = traffic_write_change / time_change;;

            monitor.chart_request.addData([avg_request,avg_request_200], time_str);
			monitor.chart_connection.addData( [ connections_active ], time_str )
			monitor.chart_response_time.addData( [ avg_response_time ], time_str )
			monitor.chart_traffic.addData( [ avg_traffic_read, avg_traffic_write ], time_str )

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
			

			$('#status_uptime').text( data['boot_time']  );
			$('#status_request_count').text( data['request_count'] );
			$('#status_request_count_200').text( data['200_request_count'] );
        }
        
        monitor.latest_status = data;

    });
}

monitor.resize = function(){
    //$("#chart_request").attr("height", $("#chart_request_container").height());
    $("#chart_connection").attr("width", $("#chart_connection_container").width());
    monitor.chart_connection.resize();
}

