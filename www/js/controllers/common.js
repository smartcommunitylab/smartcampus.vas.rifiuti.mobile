angular.module('starter.controllers.common', ['google-maps'])


.controller("emailController", function ($scope) {


  sendEmail = function () {
    window.plugins.email.open({
      to: "prova", // email addresses for TO field
      cc: "prova", // email addresses for CC field
      bcc: "prova", // email addresses for BCC field
      attachments: "prova", // file paths or base64 data streams
      subject: "prova", // subject of the email
      body: "prova", // email body (for HTML, set isHtml to true)
      isHtml: false, // indicats if the body is HTML or plain text
    }, callback, scope);


  }


})

.controller("ExampleController", function ($scope, $cordovaCamera) {

  $scope.takePicture = function () {
    var options = {
      quality: 75,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.CAMERA,
      allowEdit: true,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 200,
      targetHeight: 200,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false
    };

    $cordovaCamera.getPicture(options).then(function (imageData) {
      $scope.imgURI = "data:image/jpeg;base64," + imageData;
    }, function (err) {
      // An error occured. Show a message to the user
    });
  }

})

.controller('AppCtrl', function ($scope, $rootScope, $location) {
  $scope.showTutorial = function () {
    $rootScope.showTutorial = true;
  };



  $scope.createOneProfile = function () {
    if (!$rootScope.supports_html5_storage()) {
      return;
    }
    if (!localStorage.getItem("profiles")) {
      $rootScope.promptedToProfile = true;
      $location.url("app/aggProfilo");
    }
  };

  $scope.createOneProfile();

  $rootScope.readProfiles();
  $rootScope.selectProfile(0);
})

.controller('InfoCtrl', function ($scope) {})

.controller('SegnalaCtrl', function ($scope) {
  $scope.checked = true;
  $scope.checkboxImage = "img/rifiuti_btn_check_on_holo_light.png";

  $scope.toggleCheck = function () {
    $scope.checked = !$scope.checked;
    $scope.checkboxImage = $scope.checked ? "img/rifiuti_btn_check_on_holo_light.png" : "img/rifiuti_btn_check_off_holo_light.png";
  };



  function opzInCasoDiErrore(error) {
    alert("Errore " + error.code + ": " + error.message);
  }
  var GPScoords;

  $scope.posizioneG = function () {
    //navigator.geolocation.getCurrentPosition(success);
    //if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      alert("your position is: " + position.coords.latitude + ", " + position.coords.longitude);
      GPScoords = position.coords.latitude + ", " + position.coords.longitude;
    });
    // } else {
    //  showError("Your browser does not support Geolocation!");
    // }
  }




})








.controller('ContattiCtrl', function ($scope, $ionicScrollDelegate) {
  $scope.v = [
    {
      title: "y1",
      t1: "y2",
      t2: "y3",
      t3: "y4",
      web: "y5",
      tel: "y6",
      email: "y7",
      pec: "y8",
      fax: "y9",
      aperto: false
   },
    {
      title: "u1",
      t1: "u2",
      t2: "u3",
      t3: "u4",
      web: "www.comunitadellegiudicarie.it",
      tel: "0465/325038",
      email: "rifiuti@comunitadellegiudicarie.it",
      pec: "c.giudicarie.legamail.it",
      fax: "0465/329043",
      aperto: false
   },
    {
      title: "SOGAP SRL",
      t1: "i2",
      t2: "Via Cesena 13 38070 Preore (TN)",
      web: "www.sogap.net",
      tel: "0465/322755",
      email: "info@sogap.net",
      fax: "0465/323194",
      aperto: false
   }
  ];
  $scope.mainScrollResize = function () {
    $ionicScrollDelegate.$getByHandle('mainScroll').resize();
  }
})

.controller('TutorialCtrl', function ($scope, $ionicLoading) {


  $scope.prova = function () {
    delegate.select(1);
  }

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
    //toggleLeft([isOpen]);
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