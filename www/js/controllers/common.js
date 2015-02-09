angular.module('rifiuti.controllers.common', [])


.controller("ExampleController", function ($scope, $rootScope, $cordovaCamera) {

  $scope.takePicture = function () {
    var options = {
      quality: 75,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.CAMERA,
      allowEdit: true,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 150,
      targetHeight: 150,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false
    };

    $cordovaCamera.getPicture(options).then(function (imageData) {
      $rootScope.imgURI = "data:image/jpeg;base64," + imageData;
    }, function (err) {
      // An error occured. Show a message to the user
    });
  }

})

.controller('AppCtrl', function ($scope, $rootScope, $location, Profili) {
  $scope.showTutorial = function () {
    $rootScope.showTutorial = true;
  };
  //localStorage.removeItem('profiles');
  if (!localStorage.profiles || localStorage.profiles.length==0) {
    $rootScope.promptedToProfile = true;
    $location.url("app/aggProfilo");
  } else {
    $scope.selectProfile=function(index){
      Profili.select(index);
    };
    Profili.read();
    Profili.select(Profili.selectedProfileIndex());
  }
})

.controller('InfoCtrl', function ($scope) {})

.controller('SegnalaCtrl', function ($scope, $rootScope) {
    
      
  $scope.GPScoords;
  var GPScoordsTmp;
    
    var posizioneG = function () {
    //navigator.geolocation.getCurrentPosition(success);
    //if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      //alert("your position is: " + position.coords.latitude + ", " + position.coords.longitude);
      GPScoordsTmp = "[ "+position.coords.latitude + ", " + position.coords.longitude+ " ]";
      $scope.GPScoords = GPScoordsTmp;
    });
    // } else {
    //  showError("Your browser does not support Geolocation!");
    // }
  }
    
  $scope.checked = true;
  $scope.checkboxImage = "img/rifiuti_btn_check_on_holo_light.png";

    

  $scope.toggleCheck = function () {
    //$scope.posizioneG();
    $scope.checked = !$scope.checked;
    $scope.checkboxImage = $scope.checked ? "img/rifiuti_btn_check_on_holo_light.png"  : "img/rifiuti_btn_check_off_holo_light.png";
      $scope.GPScoords = $scope.checked ?  GPScoordsTmp : "";
  };



  function opzInCasoDiErrore(error) {
    alert("Errore " + error.code + ": " + error.message);
  }

  $rootScope.text;


 console.log('$scope.text: '+$rootScope.text);
  console.log('$rootScope.imgURI: '+$rootScope.imgURI);
 sendEmail = function () {
    // $scope.posizioneG();    
    cordova.plugins.email.open({
      to: "sampleemail", // email addresses for TO field
      subject: "sample subj", // subject of the email
      body: [$scope.GPScoords +" scope text: " + $rootScope.text + " sample body"], // email body (for HTML, set isHtml to true)
      isHtml: false, // indicats if the body is HTML or plain text
      attachment: "base64:icon.png//" + $rootScope.imgURI.substring(26),
    }, function(){
      console.log('email view dismissed');
    }, this);
  }

 posizioneG();

})








.controller('ContattiCtrl', function ($scope, $ionicScrollDelegate, Raccolta) {
  Raccolta.contatti().then(function(data){
    $scope.contatti = data;
  });      
    
  $scope.mainScrollResize = function () {
    $ionicScrollDelegate.$getByHandle('mainScroll').resize();
  }
})

.controller('ContattoCtrl', function ($scope, $stateParams, $ionicScrollDelegate, Raccolta) {
  Raccolta.contatti().then(function(data){
    $scope.contatto = data[$stateParams.id];
    if (!!$scope.contatto.sitoIstituzionale && $scope.contatto.sitoIstituzionale.indexOf('http') != 0) {
        $scope.contatto.sitoIstituzionale = 'http://'+$scope.contatto.sitoIstituzionale;
    }  
    if (!!$scope.contatto.sitoWeb && $scope.contatto.sitoWeb.indexOf('http') != 0) {
        $scope.contatto.sitoWeb  = 'http://'+$scope.contatto.sitoWeb;
    }  
  });      
    
  $scope.mainScrollResize = function () {
    $ionicScrollDelegate.$getByHandle('mainScroll').resize();
  }
})

.controller('TutorialCtrl', function ($scope, $ionicLoading) {

  $scope.close = function () {
    $ionicLoading.hide();
  };

  $scope.index = 0;

  $scope.next = function () {
    if ($scope.tutorial[$scope.index].skippable) {
      $scope.index++;
    } else {
      $scope.close();
    }
  };

  var getX = function (id) {
    var div = document.getElementById(id);
    var rect = div.getBoundingClientRect();
    return rect.left + 0.5 * (rect.right - rect.left);
    var width = window.innerWidth;
  };
  var getY = function (id) {
    var div = document.getElementById(id);
    var rect = div.getBoundingClientRect();
    return rect.top + 0.5 * (rect.bottom - rect.top);
  };

  $scope.tutorial = [
    {
      index: 1,
      primo: 44,
      title: "TTUno",
      x: 3,
      y: 40,
      text: "TutorialUno",
      imgX: function () {
        var width = window.innerWidth;
        return width - 80
      }, //getX("searchButton")-320},
      imgY: function () {
        return getY("searchButton") - 50
      },
      skippable: true
  },
    {
      index: 1,
      title: "TTDue",
      x: 3, //3
      y: 40,
      text: "TutorialDue",
      imgX: function () {
        return getX("rifiutoId") - 45
      },
      imgY: function () {
        return getY("rifiutoId") - 40
      },
      skippable: true
  },
    {
      index: 1,
      title: "TTTre",
      x: 3,
      y: 40,
      text: "TutorialTre",
      imgX: function () {
        return getX("noteId") + 25
      },
      imgY: function () {
        return getY("noteId") - 50
      },
      skippable: true
  },
    {
      index: 1,
      title: "TTQuattro",
      x: 3,
      y: 40,
      text: "TutorialQuattro",
      imgX: function () {
        var width = window.innerWidth;
        return 0.5 * width + 80
      }, //return getX("calendarioId")+305},
      imgY: function () {
        return getY("calendarioId") - 50
      },
      skippable: true
  },
    {
      index: 1,
      title: "TTCinque",
      x: 3,
      y: 40,
      text: "TutorialCinque",
      imgX: function () {
        return getX("menuId") - 66
      },
      imgY: function () {
        return getY("menuId") - 50
      },
      skippable: false
  }
 ];
})