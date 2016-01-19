$.ajax({
    type: "GET",
    // url: "js/data_stat.json",
    url: "/verynginx/summary",
    data_Type: "json",

    success: function (json_data) {

        console.log("异步请求成功");
        console.log(typeof json_data);
        var response = json_data;

        console.log(response);

        for (var key in response) {
            console.log(key);
            
            // 计算访问成功率
            var success = json_data[key].status[200] / json_data[key].count;

            // 动态增加每一列关于各URL/URI的详细访问信息
            var dyn_tab =  "<tr><th>##</th>" +
                           "<th>" + key + "</th>" +
                           "<th>" + json_data[key].count + "</th>" +
                           "<th>" + json_data[key].size + "</th>" +
                           "<th>" + json_data[key].avg_size + "</th>" +
                           "<th>" + success.toFixed(4) * 100 + "%</th>" +
                           "<th>" + json_data[key].time + "</th>" +
                           "<th>" + json_data[key].avg_time + "</th></tr>";

            $('#url_details').append(dyn_tab);
   
        }
    }
})