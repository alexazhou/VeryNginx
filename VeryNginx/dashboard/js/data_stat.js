$.ajax({
    type: "GET",
    // url: "js/data_stat.json",
    url: "/verynginx/summary",
    data_Type: "json",

    success: function (json_data) {

        console.log("异步请求成功");

        var response = json_data;

        console.log(response);

        for (var key in json_data) {
            console.log('key name:' + key + ' value:' + json_data[key].size);
            var url_details = new Vue({

                el: '#url_details',

                data: {
                    url_details: [
                        { key: key },
                        { count: json_data[key].count },
                        { size: json_data[key].size },
                        { avg_size: json_data[key].avg_size },
                        { status: json_data[key].status },
                        { time: json_data[key].time },
                        { avg_time: json_data[key].avg_time }
                    ]
                }

            })
        }
    }
})


// var data_stat = '访问统计';

// var data_stat = new Vue({

//     el: '#data_stat',

//     data: {
//         message: data_stat
//     }
// })

