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
                        { message:'##' },
                        { message: key },
                        { message: json_data[key].count },
                        { message: json_data[key].size },
                        { message: json_data[key].avg_size },
                        { message: json_data[key].status },
                        { message: json_data[key].time },
                        { message: json_data[key].avg_time }
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

