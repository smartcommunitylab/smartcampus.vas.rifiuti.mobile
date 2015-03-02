angular.module('rifiuti.services.data', [])

.factory('DataManager', function ($http, $q) {

  var dataURL = null;
  var completeData = null;
  var profili = null;
  var profileData = null;
  
  var errorHandler = function(e) {
    console.log(e);
  };

  // generate specific data mapped onto user types
  var preprocess = function(data) {
    var colorMap = {};
    data.raccolta.forEach(function(r) {
      var key = r.tipologiaUtenza + '--'+ r.tipologiaPuntoRaccolta;
      if (!colorMap[key]) {
        colorMap[key] = {};
      }
      // TODO! correct the multiple colors case
//      colorMap[key][r.tipologiaRaccolta] = r.colore;
      colorMap[key][r.area] = r.colore;
    });
    
    var prMap = {};
    var prCalMap = {};
    data.puntiRaccolta.forEach(function(pr){
      var arr = prMap['puntiRaccolta_'+pr.tipologiaUtenza];
      if (arr==null) {
        arr = [];
        prMap['puntiRaccolta_'+pr.tipologiaUtenza] = arr;
      }
      arr.push(pr);
      
      if (pr.orarioApertura) {
        var arrCal = prCalMap['puntiRaccoltaCalendar_'+pr.tipologiaUtenza]; 
        if (arrCal == null) {
          arrCal = [];
          prCalMap['puntiRaccoltaCalendar_'+pr.tipologiaUtenza] = arrCal;
        }
        pr.colore = colorMap[pr.tipologiaUtenza + '--'+ pr.tipologiaPuntiRaccolta];
        arrCal.push(pr);
      }
    });
    for (var key in prMap) {
      data[key] = prMap[key];
    }
    for (var key in prCalMap) {
      data[key] = prCalMap[key];
    }

    return data;
  }
  // limit the data to the necessary one only
  var updateProfileData = function() {
    profileData = {};
    if (completeData == null) {
      completeData = JSON.parse(localStorage.completeData);
    }
    profileData.aree = completeData.aree;
    profileData.gestori = completeData.gestori;
    profileData.istituzioni = completeData.istituzioni;
    profileData.profili = completeData.profili;
    profileData.raccolta = completeData.raccolta;
    profileData.riciclabolario = completeData.riciclabolario;
    profileData.categorie = completeData.categorie;
    if (profili) {
      profili.forEach(function(p) {
        profileData['puntiRaccolta_'+p.utenza.tipologiaUtenza] = [];
        profileData['puntiRaccoltaCalendar_'+p.utenza.tipologiaUtenza] = [];
      });
      profili.forEach(function(p) {
        completeData['puntiRaccolta_'+p.utenza.tipologiaUtenza].forEach(function(pr) {
          //$rootScope.selectedProfile.aree.indexOf(punto.area)!=-1 && (punto.tipologiaPuntiRaccolta=='CRM' || $rootScope.selectedProfile.comuni.indexOf(punto.indirizzo)!=-1)
          if (p.aree.indexOf(pr.area) != -1 && (pr.tipologiaPuntiRaccolta=='CRM' || !pr.indirizzio || p.comuni.indexOf(pr.indirizzo)!=-1) && profileData['puntiRaccolta_'+p.utenza.tipologiaUtenza].indexOf(pr) == -1) {
            profileData['puntiRaccolta_'+p.utenza.tipologiaUtenza].push(pr);
          }
        });
        if (completeData['puntiRaccoltaCalendar_'+p.utenza.tipologiaUtenza]) {
          completeData['puntiRaccoltaCalendar_'+p.utenza.tipologiaUtenza].forEach(function(pr) {
            if (p.aree.indexOf(pr.area) != -1 && (pr.tipologiaPuntiRaccolta=='CRM' || !pr.indirizzio || p.comuni.indexOf(pr.indirizzo)!=-1) && 
                profileData['puntiRaccoltaCalendar_'+p.utenza.tipologiaUtenza].indexOf(pr) == -1)
            {
              profileData['puntiRaccoltaCalendar_'+p.utenza.tipologiaUtenza].push(pr);
            }
          });
        }
      });
    }
    localStorage.profileData = JSON.stringify(profileData);
  };
  
  var process = function(url) {
    var deferred = $q.defer();
    JSZipUtils.getBinaryContent(url, function(err, data) {
      if(err) {
        deferred.reject(err); // or handle err
      }
      var zip = new JSZip(data);
      var jsons = zip.filter(function(relativePath, file) {
        return relativePath.indexOf('.json') > 0;
      });
      if (jsons.length > 0) {
        var str = jsons[0].asText();
        var rifiutiObj = angular.fromJson(str.trim());
        completeData = preprocess(rifiutiObj);
        localStorage.completeData = JSON.stringify(completeData);
        updateProfileData();
        deferred.resolve(true);
      }
    });
    return deferred.promise;
  };
  
  var get = function(url) {
    var deferred = $q.defer();
    if (profileData == null) {
      if (localStorage.profileData) {
        profileData = JSON.parse(localStorage.profileData);
      } else if (dataURL) {
        process(dataURL).then(function(res){
          get(url).then(function(results) {
            deferred.resolve(results);
          });
        });
        return deferred.promise;
      } else {
        deferred.reject('no data');
        return deferred.promise;
      }
    }
    if (url === 'data/db/aree.json') {
      deferred.resolve({data:profileData.aree});
    } else if (url === 'data/db/gestori.json') {
      deferred.resolve({data:profileData.gestori});
    } else if (url === 'data/db/istituzioni.json') {
      deferred.resolve({data:profileData.istituzioni});
    } else if (url === 'data/db/puntiRaccolta.json') {
      deferred.resolve({data:profileData.puntiRaccolta});
    } else if (url.indexOf('data/db/puntiRaccolta_')==0) {
      deferred.resolve({data:profileData[url.substr(8,url.length-13)]});
    } else if (url === 'data/db/puntiRaccoltaCalendar.json') {
      deferred.resolve({data:profileData.puntiRaccoltaCalendar});
    } else if (url.indexOf('data/db/puntiRaccoltaCalendar_')==0) {
      deferred.resolve({data:profileData[url.substr(8,url.length-13)]});
    } else if (url === 'data/db/raccolta.json') {
      deferred.resolve({data:profileData.raccolta});
    } else if (url === 'data/db/profili.json') {
      deferred.resolve({data:profileData.profili});
    } else if (url === 'data/db/riciclabolario.json') {
      deferred.resolve({data:profileData.riciclabolario});
    } else if (url === 'data/db/tipologiaRifiuto.json') {
      deferred.resolve({data:profileData.categorie.tipologiaRifiuto});
    } else {
      console.log('USING OLD FILE! '+url);
      $http.get(url).then(function(results) {
        deferred.resolve(results);
      });
    }
    
    return deferred.promise;
  };
  
  return {
    get : get,
    setDataURL: function(url) {
      dataURL = url;
    },
    updataProfiles: function(newProfiles) {
      profili = newProfiles;
      updateProfileData();
    },
    getSync : function(key) {
      return profileData[key];
    } 
  };
})
