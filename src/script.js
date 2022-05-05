//ベースマップ
let gsi = new L.tileLayer('http://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png', {
    attribution: "<a href='http://www.gsi.go.jp/kikakuchousei/kikakuchousei40182.html' target='_blank'>国土地理院</a>"
});
let gsi_pale = new L.tileLayer('http://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png', {
    attribution: "<a href='http://www.gsi.go.jp/kikakuchousei/kikakuchousei40182.html' target='_blank'>国土地理院</a>"
});
let gsi_photo = new L.tileLayer('http://cyberjapandata.gsi.go.jp/xyz/ort/{z}/{x}/{y}.jpg', {
    attribution: "<a href='http://www.gsi.go.jp/kikakuchousei/kikakuchousei40182.html' target='_blank'>国土地理院</a>"
});
let osm = new L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&amp;copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
});

//モデル表示
let liveCam = L.geoJSON(livecam,{
    onEachFeature: function(feature, layer){
        layer.bindPopup('<a href="'+ feature.properties.URL + '">'+ feature.properties.名称 + '</a>' + 'のモデル' + '<iframe loading="lazy" width="300" height="150" src="' + feature.properties.LINK + '"></iframe>');
    },
    pointToLayer: function (feature, coordinates) {
        return L.marker(coordinates, {icon:
            L.AwesomeMarkers.icon({
                icon: 'fa-male',
                markerColor: feature.properties.COLOR,
                prefix: 'fa',
            })
        })
    },
    //attribution: "<a href='http://www3.doboku-bousai.pref.kagoshima.jp/bousai/jsp/index.jsp'>鹿児島県土木部</a>※位置は個人調査"
});

let Syouten = L.geoJSON(syouten,{
    onEachFeature: function(feature, layer){
        layer.bindPopup('<a href="'+ feature.properties.URL + '">'+ feature.properties.名称 + '</a>' + 'のモデル' + '<iframe loading="lazy" width="300" height="150" src="' + feature.properties.LINK + '"></iframe>');
    },
    pointToLayer: function (feature, coordinates) {
        return L.marker(coordinates, {icon:
            L.AwesomeMarkers.icon({
                icon: 'fa-shopping-cart',
                markerColor: 'darkblue',
                prefix: 'fa',
            })
        })
    },
    //attribution: "<a href='http://www3.doboku-bousai.pref.kagoshima.jp/bousai/jsp/index.jsp'>鹿児島県土木部</a>※位置は個人調査"
});

let Kawazoi = L.geoJSON(kawazoi,{
    onEachFeature: function(feature, layer){
        layer.bindPopup('<a href="'+ feature.properties.URL + '">'+ feature.properties.名称 + '</a>' + 'のモデル' + '<iframe loading="lazy" width="300" height="150" src="' + feature.properties.LINK + '"></iframe>');
    },
    pointToLayer: function (feature, coordinates) {
        return L.marker(coordinates, {icon:
            L.AwesomeMarkers.icon({
                icon: 'fa-tree',
                markerColor: 'green',
                prefix: 'fa',
            })
        })
    },
    //attribution: "<a href='http://www3.doboku-bousai.pref.kagoshima.jp/bousai/jsp/index.jsp'>鹿児島県土木部</a>※位置は個人調査"
});

//ベースマップ
let baseLayers = {
    "地理院地図 標準": gsi,
    "地理院地図 淡色": gsi_pale,
    "地理院地図 衛星画像": gsi_photo,
    "OpenStreetMap 標準": osm,
};
//オーバレイ
let overLayers = {
    "モニュメント": liveCam,
    "商店街": Syouten,
    "植物": Kawazoi,
};

let area = [
    [35.647593, 139.443719],
    [35.461555, 139.803114]
];

//マップのオプションたち
let mymap = L.map('map',{
    center:[35.585246, 139.615296],
    zoom:17,
    maxZoom:18,
    minZoom:13,
    maxBounds: area,
    zoomControl:true,
    layers:[gsi_pale,liveCam,Syouten,Kawazoi],
    condensedAttributionControl: false
});
//レイヤコントール追加
L.control.layers(baseLayers,overLayers).addTo(mymap);

//区境ポリライン
let myLineStyle = {
    "color": "#948BDB",
}
L.geoJSON(myLines,{style:myLineStyle}).addTo(mymap);

//attributionのまとめプラグインーーーーーーーーーーーーーーーーーーーーーーー
L.control.condensedAttribution({
    emblem: '<div class="emblem-wrap"><i class="far fa-copyright"></i></div>',
    prefix: '<a href="http://leafletjs.com" title="A JS library for interactive maps">Leaflet</a>'
  }).addTo(mymap);

//現在地の表示プラグインーーーーーーーーーーーーーーーーーーーーーーーーーーー
let lc = L.control.locate({
    flyTo:true,
    strings: {
        title: "現在地を表示する",
    },
    showPopup:false,
    onLocationError(){
        alert('現在地が見つかりませんでした');
    },
    onLocationOutsideMapBounds(){
        alert('あなた川崎市にいないよ！');
        lc.stop();
    },
}).addTo(mymap);

// MousePosition
var options = {
    position: 'bottomleft',
    numDigits: 7
  }
  L.control.mousePosition(options).addTo(mymap);

//ダイアログプラグインーーーーーーーーーーーーーーーーーーーーーーーーーーーー
    var options = {
        title:'川崎りんごLidarマップ（仮）',
        content:'<h3><u>使い方</u></h3><p>①このダイアログを読み終えたら右下の<b>OKボタンを押してください</b>。<br>②現在地の取得確認がでますので、許可すると現在地まで飛んでいきます。<br>③見たい情報を<img src="./assets/layers.png">から選ぶと、凡例が左下に出ますので近所を確認してみましょう！</p><h3><u>各ボタンの説明</u></h3><p><img src="./assets/layers.png">　背景地図や情報を選ぶ<br><img src="./assets/location-arrow.png">　現在地に飛ぶ</p><h3><u>留意点と注意点</u></h3><p><li>本サイトで提供するマップは、データ作成上の誤差を含んでおりますので、参考までにご利用ください。<li>本サイトの利用によって、直接または間接の損失・損害が発生した場合、一切の責任を負いません。</p>',
        modal: true,
        position:'center',
        closeButton:false
    };
    var win =  L.control.window(mymap, options)
    .prompt({callback:function(){
        //OKボタンを押したら初期から現在地を探す
        lc.start()}}).show()

//ーーーーーーーーーーーーーー以下凡例関係の設定ーーーーーーーーーーーーーーー
let htmlLegendKouzui = L.control.htmllegend({
    position:'bottomleft',
    disableVisibilityControls:true,
    legends:[{
        name:'凡例',
        layer: Toilet,
        elements: [{
            label: 'トイレ',
            html:'',
            style: {
                'background-color': 'darkblue',
                'width': '30px',
                'height': '10px'
            }
        },{
            label: '桜',
            html: '',
            style: {
                'background-color': 'pink',
                'width': '30px',
                'height': '10px'
            } 
        }]
    }]
})
mymap.addControl(htmlLegendKouzui)
