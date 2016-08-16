var app = angular.module('flowandsnow', ['ngRoute', 'ngResource']);

app.config(['$routeProvider', function($routeProvider){
    $routeProvider
        .when('/', {
            templateUrl: 'partials/home.html',
            controller: 'HomeCtrl'
        })
        .when('/states', {
            templateUrl: 'partials/states.html',
            controller: 'statesCtrl'
        })
        .when('/:state/:code', {
            templateUrl: 'partials/viewRiver.html',
            controller: 'ViewRiverCtrl'
        })
        .when('/remove-river/:name/:id', {
            templateUrl: 'partials/deleteRiver.html',
            controller: 'RemoveRiverCtrl'
        })
        .when('/:state', {
            templateUrl: 'partials/stateRivers.html',
            controller: 'stateRiversCtrl'
        })
        .when('/search/:entry/results', {
            templateUrl: 'partials/hits.html',
            controller: 'hitsCtrl'
        })
        .otherwise({
            redirectTo: '/'
        });
}]);

//HOMEPAGE
app.controller('HomeCtrl', ['$scope', '$resource', '$http', '$location',
    function($scope, $resource, $http, $location){

        var heightAdjust = function() {
            var windowHeight = String(window.innerHeight + 30);
            var view = document.getElementById('view');
            view.style.height = windowHeight +'px';
        } 
        heightAdjust();

        $(window).on('resize', function() {
            heightAdjust();
        });

        // usgs rivers 
        // $http({
        //     method: 'GET',
        //     url: 'http://waterdata.usgs.gov/dc/nwis/current/?type=flow'
        // }).then(function success(response){
        //     console.log(200);
        //     console.log(response.data);
        // }, function error (err){
        //     console.error(err);
        // });
}]);

app.controller('hitsCtrl', ['$scope', '$resource', '$location', '$routeParams', 
    function($scope, $resource, $location, $routeParams) {
            // Get Rivers from local storage
        var heightAdjust = function() {
            var windowHeight = String(window.innerHeight + 30);
            var view = document.getElementById('view');
            view.style.height = windowHeight +'px';
        } 
        
        var Rivers = $resource('/rivers');
        Rivers.query(function(rivers) {
            // $scope.rivers = rivers[0].rivers;
            $scope.states = rivers;
            $scope.search();
        });

        $scope.search = function() {
            var states = $scope.states
            var stateArAr = [];
            var allRivers = [];
            for (var i = 0; i < states.length; i++) {
                var stateObj = {
                    state: states[i].state,
                    rivers: states[i].rivers
                }
                stateArAr.push(stateObj);
                // console.log(stateArAr);
            }
            
            if (stateArAr.length > 50) {
                for (var i =0; i < stateArAr.length; i++) {
                    var stateRivers = stateArAr[i].rivers
                    for (var j=0; j < stateRivers.length; j++) {
                        var currentState = stateArAr[i].state;
                        var currentRiver = stateRivers[j];
                        // console.log(currentState);
                        var riverObj = {
                            name: currentRiver.name,
                            code: currentRiver.code,
                            state: currentState
                        }
                        allRivers.push(riverObj);
                    }
                }
            }
            
            var pattern = $routeParams.entry;
            console.log('search item: '+pattern);
            $scope.searchEntry = $routeParams.entry; 
            var hits = [];
            if (allRivers.length > 10565) {
                for( var i = 0; i < allRivers.length; i++) {
                    var str = allRivers[i].name.toLowerCase();
                    var patt = new RegExp(pattern);
                    var res = patt.test(str);
                    if (res) {
                        hits.push(allRivers[i]);
                    }
                }
            }
            var heightAdjust = function() {
                var windowHeight = String(window.innerHeight + 30);
                var view = document.getElementById('view');
                view.style.height = windowHeight +'px';
            } 
        
            $scope.hits = hits;
            console.log('hits: '+hits);
            if (hits.length !== 0) {
                $scope.hitsLength = hits.length;
                heightAdjust();
            } else {
                $scope.hitsLength = '0';
                heightAdjust();
            }
            
        }
        
    }
    
]);

//ADD RIVER PAGE  
app.controller('statesCtrl', ['$scope', '$resource', '$location',
    function($scope, $resource, $location){
    
       
        var Rivers = $resource('/rivers');
        Rivers.query(function(states) {
            // $scope.rivers = rivers[0].rivers;
            $scope.states = states;
            // console.log(rivers);
        });
        
     
        // $scope.title = 'Add a River';
        // $scope.save = function(){
        //     var Rivers = $resource('/rivers');
        //     Rivers.save($scope.river, function(){
        //         $location.path('/');
        //     });
        // };
}]);

//ViEW RIVER PAGE
app.controller('ViewRiverCtrl', ['$scope', '$resource', '$location', '$routeParams', '$http',
    function($scope, $resource, $location, $routeParams, $http){
        $scope.boolie1 = true;
        $scope.boolie2 = true;
        var heightAdjust = function () {
            var windowHeight = String(window.outerHeight + 30);
            var view = document.getElementById('view');
            view.style.height = windowHeight + 'px';
        }
        heightAdjust();


        $(window).on('resize', function() {
            if($scope.boolie1 && $scope.boolie2) {
                heightAdjust();
            }
        });

        // $scope.stateID = $routeParams.id;      
        $scope.riverCode = $routeParams.code;
        $scope.state = $routeParams.state;
        //initalize variables
        var collection = $resource('/rivers');
        collection.query(function(states){
            for (var i = 0; i < states.length; i++){
                if (states[i].state == $routeParams.state) {
                    var rivers = states[i].rivers;  
                    for (var i = 0; i < rivers.length; i++) {
                        if (rivers[i].code == $routeParams.code){
                            $scope.riverName = rivers[i].name;
                        }
                    }
                }
            }
        });

        var d = document.getElementById('data');
        var nuggets = [];
        var graphs = [];
      
        // Get river code to access unigue data from usgs site
        // River.get({ id: $routeParams.id }, function(river){
        //     $scope.riverCode = river.code;
        //     getData();
        // });
        
        //Gather and refine HTML from live page
        function getData() {
            $http({
                method: 'GET',
                url: 'http://waterdata.usgs.gov/'+$routeParams.state+'/nwis/uv/?site_no='+$scope.riverCode
            }).then(function success(response){
                console.log(200);
                var dataToFilter = response.data;
                var filterStart = dataToFilter.search('<div class="stationContainer">');
                var filterEnd = dataToFilter.search('<!-- BEGIN USGS Footer Template -->');
                var filtered1 = dataToFilter.slice(filterStart, filterEnd);
                var filter2 = filtered1.replace('<div class="collapse_div">', '<!--');
                var filter3 = filter2.replace('</form>', '-->');

                d.innerHTML = filter3;     //Add filtered HTML to hidden DOM
                
                
                freshData();                    //Begin data extraction
            }, function error (err){
                console.error(err);
            });
        }
        //Data extaction    
        function freshData() {
                //initalize variables
                var graphs = d.getElementsByClassName('iv_graph_float1');      //retrieves all graphs from hidden DOM
                var headers = d.getElementsByClassName('stationContainer');    //retrieves all headers from hidden DOM
                var graphSrc = undefined;
                var east = ['oh','pa','ny','vt','me','nh','ma','ri','ct','nj','de','md','dc','wv','va','nc','sc'];
                var centralEast = ['fl', 'ga', 'il', 'in','ky','mi', 'tn'];
                var pacificMountain = ['mt','id','wy','ut','co','az','nm', 'wa','or','ca','nv'];
                var central = ['nd','mn','sd','wi','ne','ia','ks','mo','ok','ar','tx','la','ms','al'];
                var pacific = ['wa','or','ca','nv'];
                $scope.graphNodes = [];

                getGraphs();    //Must get graphs first or function will not finish in time

                //refine header content and setData()
                function getHeaders() {
                    for (var i =1; i < headers.length; i++) {
                        var containers = headers[i].textContent;
                        var startSlice = containers.search('value:');
                        var cdtNum = containers.search('CDT')+3;
                        var estNum = containers.search('EST')+3;
                        var cstNum = containers.search('CST')+3;
                        var estNum = containers.search('EST')+3;
                        var edtNum = containers.search('EDT')+3;
                        var pstNum = containers.search('PST')+3;
                        var mstNum = containers.search('MST')+3;
                        var pdtNum = containers.search('PDT')+3;
                        var mdtNum = containers.search('MDT')+3;
                        if (central.includes($routeParams.state)) {
                            if (cdtNum > cstNum) {
                                var endSlice = containers.search('CDT') + 3;
                            } else {
                                var endSlice = containers.search('CST')+3;
                            }
                        } else if (east.includes($routeParams.state)){
                            if (estNum > edtNum) {
                                var endSlice = containers.search('EST') + 3;
                            } else {
                                var endSlice = containers.search('EDT')+3;
                            }
                        } else if (centralEast.includes($routeParams.state)) {
                            if (edtNum > cdtNum && edtNum > estNum && edtNum > cstNum) {
                                var endSlice = edtNum;
                            }
                            if (cdtNum > edtNum && cdtNum > estNum && cdtNum > cstNum) {
                                var endSlice = cdtNum;
                            } 
                            if (estNum > cdtNum && estNum > edtNum && estNum > cstNum) {
                                var endSlice = estNum;
                            }
                            if (cstNum > edtNum && cstNum > estNum && cstNum > cdtNum) {
                                var endSlice = cstNum;
                            }
                        } else if ($routeParams.state == 'ak') {
                            var endSlice = containers.search('AKDT')+4;
                        } else if($routeParams.state == 'hi') {
                            var endSlice = containers.search('HST')+3;
                        } else if (pacificMountain.includes($routeParams.state)){
                            if (pstNum > mstNum && pstNum > pdtNum && pstNum > mdtNum) {
                                var endSlice = pstNum;
                            }
                            if (mstNum > pstNum && mstNum > pdtNum && mstNum > mdtNum) {
                                var endSlice = mstNum;
                                console.log(endSlice);
                            }
                            if (pdtNum > mstNum && pdtNum > pstNum && pdtNum > mdtNum) {
                                var endSlice = pdtNum;
                                console.log(endSlice);
                            }
                            if (mdtNum > pdtNum && mdtNum > mstNum && mdtNum > pstNum) {
                                var endSlice = mdtNum;
                            }
                        } 
                        else if(mountain.includes($routeParams.state)) {
                            var endSlice = containers.search('MST') + 3;
                            if (endSlice < 10) {
                                endSlice = containers.search('PDT') + 3;
                            }
                        } else {
                            var endSlice = containers.search('EDT') + 3;
                        }
                        var nugget = containers.slice(startSlice, endSlice); //pretty data nugget
                        nuggets.push(nugget);
                    }
                    setData();      
                }

                //acquire image nodes for url extraction and getHeaders();
                function getGraphs() {
                    for (var i = 0; i < graphs.length; i++) {
                        var graph = graphs[i].childNodes;
                        $scope.graphNodes.push(graph[1]);
                    }
                    getHeaders();
                }

        }

        //After freshData() is collected setData()
        function setData(){
            $scope.boolieOne = false;
            $scope.boolieTwo = false;
            var titleStrings = [];
            var dischargeIndex = undefined;
            var heightIndex = undefined;
            var nugValueString = undefined;
            var nugs = [];
            var titles = d.getElementsByClassName('stationContainerHeading');

            for (var i = 0; i < titles.length; i++) {
                var title = titles[i].textContent;
                titleStrings.push(title.trim());
            }
            for (var i=0; i < nuggets.length; i++) {
                nugValueString = nuggets[i].slice(6);
                var nugValueArray = nugValueString.split(' ');
                var value = nugValueArray[1];
                var date = nugValueArray[3];
                var time = nugValueArray[5] +' '+nugValueArray[6];
                var nug = {
                    value: value,
                    date: date,
                    time: time
                }
                nugs.push(nug)
            }
            for (var i = 0; i< titleStrings.length; i++) {
                if (titleStrings[i].includes('Discharge')) {
                    dischargeIndex = i;
                } else if(titleStrings[i].includes('Gage height')) {
                    heightIndex = i;
                }
            }
            if (heightIndex !== undefined) {
                $scope.heightSrc = $scope.graphNodes[heightIndex].src;
                $scope.height = nugs[heightIndex].value;
            } else {
                $scope.boolieTwo = true;
            }
            if (dischargeIndex !== undefined) {
                $scope.dischargeSrc = $scope.graphNodes[dischargeIndex].src;
                $scope.cfs = nugs[dischargeIndex].value;
            } else {
                $scope.boolieOne = true;
            }

        }

        getData();
        var img1 = document.getElementById('dischargeImg');
        var img2 = document.getElementById('heightImg');
        var view = document.getElementById('view');
        var viewHeight = view.clientHeight;
        console.log(viewHeight);
        $scope.showGraph1 = function() {
            
            if ($scope.boolie1) {
                $scope.boolie1 = false;
                view.style.height = String(img1.height +viewHeight) +'px';
                viewHeight = img1.height + viewHeight;
            } else {
                $scope.boolie1 = true;
                view.style.height = String(viewHeight - img1.height) +'px';
                viewHeight = viewHeight - img1.height;
            }
            
        }
        $scope.showGraph2 = function() {
            if ($scope.boolie2) {
                $scope.boolie2 = false;
                view.style.height = String(img2.height +viewHeight) +'px';
                viewHeight = img2.height + viewHeight;
            } else {
                $scope.boolie2 = true;
                view.style.height = String(viewHeight - img2.height) +'px';
                viewHeight = viewHeight - img2.height;
            }
        }

}]);


//DELETE RIVER PAGE    
app.controller('RemoveRiverCtrl', ['$scope', '$resource', '$location', '$routeParams',
    function($scope, $resource, $location, $routeParams){
        var Rivers = $resource('/rivers/:id');
        $scope.name = $routeParams.name;
        $scope.delete = function() {
            Rivers.delete({ id: $routeParams.id }, function(){
               $location.path('/'); 
            });
        }
}]);

//STATES PAGE
app.controller('stateRiversCtrl', ['$scope', '$resource', '$routeParams', '$http', '$location', function($scope, $resource, $routeParams, $http, $location) {
  
    var Rivers = $resource('/rivers');
        Rivers.query(function(states) {
            // $scope.rivers = rivers[0].rivers;
            $scope.states = states;
            for (var i = 0; i < states.length; i++){
                if (states[i].state == $routeParams.state) {
                    $scope.rivers = states[i].rivers; 
                    $scope.state = states[i].name;
                    $scope.stateAbv = states[i].state;
                }
            }
            // console.log(rivers);
    });

    $scope.openRiver = function(code) {
        $location.path('/'+$scope.stateAbv+'/'+code);
    }
    $scope.show = function($event) {
        var currentDiv = $event.currentTarget;
        currentDiv.classList.add('button-two');
        currentDiv.addEventListener('mouseleave', function(){
            currentDiv.classList.remove('button-two');
        });
    }
    // var items = document.getElementsByClassName('riverListItem');
    // for (var i =0; i< items.length; i++) {
    //     items[i].addEventListener('mouseover', function(e){
    //         console.log(e.target);
    //     });
    // }

            
}]);


    