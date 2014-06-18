kibana-panels
=============

基于kibana3.

和最新版的Kibana3有一点不兼容.

## 安装
1. 将panels下面的statisticstrend entry目录拷贝到kibana的app/panels下面.
2. 配置config.js. 在panel_names列表中添加相应的panel名字. (statisticstrend entry ...)



### 对比历史数据图表

不一定准确,取决于trysize(trysize >= distinct field count时可以确保准确.); Min/Max Count还没实现

> 配置页面. 统计appname的timetakne的平均值, 和上周同一时间段对比.
按timetaken平均值的大小倒排.
<img src="https://raw.githubusercontent.com/opsSysDev/kibana-panels/master/images/statisticstrend/edit.png">

> 图表显示页面.
<img src="https://raw.githubusercontent.com/opsSysDev/kibana-panels/master/images/statisticstrend/display.png">


### kibana入口使用范例
更改app/dashboard/default.json 如下:
```json
{
  "title": "Introduction",
  "services": {
    "query": {
      "list": {
        "0": {
          "query": "*",
          "alias": "",
          "color": "#7EB26D",
          "id": 0,
          "pin": false,
          "type": "lucene"
        }
      },
      "ids": [
        0
      ]
    },
    "filter": {
      "list": {},
      "ids": []
    }
  },
  "rows": [
    {
      "title": "Intro",
      "height": "450px",
      "editable": false,
      "collapse": false,
      "collapsable": false,
      "panels": [
        {
          "error": false,
          "span": 12,
          "editable": false,
          "group": [
            "default"
          ],
          "title": "All Dashboard",
          "type": "entry",
          "style": {},
          "status": "Stable"
        }
      ],
      "notice": false
    }
  ],
  "editable": false,
  "index": {
    "interval": "none",
    "pattern": "[logstash-]YYYY.MM.DD",
    "default": "_all",
    "warm_fields": false
  },
  "style": "dark",
  "failover": false,
  "panel_hints": true,
  "pulldowns": [],
  "nav": [],
  "loader": {
    "save_gist": false,
    "save_elasticsearch": true,
    "save_local": true,
    "save_default": true,
    "save_temp": true,
    "save_temp_ttl_enable": true,
    "save_temp_ttl": "30d",
    "load_gist": true,
    "load_elasticsearch": true,
    "load_elasticsearch_size": 20,
    "load_local": true,
    "hide": false
  },
  "refresh": false
}
```
