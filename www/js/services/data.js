angular.module('rifiuti.services.data', [])

.factory('DataManager', function ($http, $q, Utili) {
  var ENDPOINT_URL = 'https://dev.smartcommunitylab.it/riciclo';
  // TODO handle
  var USE_DRAFT = false;
  
  var LOCAL_DATA_URL = 'data/data.zip';
  var VERSION_URL = ENDPOINT_URL+'/appDescriptor/'+APP_ID;
  
  
  var dataURL = LOCAL_DATA_URL;
  
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
      for (var i = 0; i < pr.utenzaArea.length; i++) {
        var ua = pr.utenzaArea[i];
        ua.colore = colorMap[ua.tipologiaUtenza + '--'+ pr.tipologiaPuntiRaccolta];
      }
//      var arr = prMap['puntiRaccolta_'+pr.tipologiaUtenza];
//      if (arr==null) {
//        arr = [];
//        prMap['puntiRaccolta_'+pr.tipologiaUtenza] = arr;
//      }
//      arr.push(pr);
//      if (pr.orarioApertura) {
//        var arrCal = prCalMap['puntiRaccoltaCalendar_'+pr.tipologiaUtenza]; 
//        if (arrCal == null) {
//          arrCal = [];
//          prCalMap['puntiRaccoltaCalendar_'+pr.tipologiaUtenza] = arrCal;
//        }
//        pr.colore = colorMap[pr.tipologiaUtenza + '--'+ pr.tipologiaPuntiRaccolta];
//        arrCal.push(pr);
//      }
      
    });
//    for (var key in prMap) {
//      data[key] = prMap[key];
//    }
//    for (var key in prCalMap) {
//      data[key] = prCalMap[key];
//    }

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
      var map = {};
      profili.forEach(function(p) {
        profileData['puntiRaccolta_'+p.utenza.tipologiaUtenza] = [];
        profileData['puntiRaccoltaCalendar_'+p.utenza.tipologiaUtenza] = [];
      });
      profili.forEach(function(p) {
        completeData.puntiRaccolta.forEach(function(pr) {
          var prKey = pr.tipologiaPuntiRaccolta +' '+pr.dettaglioIndirizzo;
          for (var i = 0; i < pr.utenzaArea.length;i++) {
            var ua = pr.utenzaArea[i];
            if (ua.tipologiaUtenza !== p.utenza.tipologiaUtenza) continue;
            
            if (Utili.belongsTo(pr,ua.area,p) && !map[prKey + ua.tipologiaUtenza]) {
              var newPr = angular.copy(pr);
              delete newPr.utenzaArea;
              newPr.area = ua.area;
              newPr.tipologiaUtenza = ua.tipologiaUtenza;
              newPr.colore = ua.colore;
              profileData['puntiRaccolta_'+ua.tipologiaUtenza].push(newPr);
              map[prKey + ua.tipologiaUtenza] = true;
              
              if (newPr.orarioApertura) {
                newPr.orarioApertura.forEach(function(cal){Utili.expandOrarioApertura(cal)});
                profileData['puntiRaccoltaCalendar_'+ua.tipologiaUtenza].push(newPr);
              }
            }
          }
        });
//        completeData['puntiRaccolta_'+p.utenza.tipologiaUtenza].forEach(function(pr) {
//          if (Utili.belongsTo(pr,p) && profileData['puntiRaccolta_'+p.utenza.tipologiaUtenza].indexOf(pr) == -1) {
//            if (pr.orarioApertura) pr.orarioApertura.forEach(function(cal){Utili.expandOrarioApertura(cal)});
//            profileData['puntiRaccolta_'+p.utenza.tipologiaUtenza].push(pr);
//          }
//        });
//        if (completeData['puntiRaccoltaCalendar_'+p.utenza.tipologiaUtenza]) {
//          completeData['puntiRaccoltaCalendar_'+p.utenza.tipologiaUtenza].forEach(function(pr) {
//            if (Utili.belongsTo(pr,p) && profileData['puntiRaccoltaCalendar_'+p.utenza.tipologiaUtenza].indexOf(pr) == -1)
//            {
//              if (pr.orarioApertura) pr.orarioApertura.forEach(function(cal){Utili.expandOrarioApertura(cal)});
//              profileData['puntiRaccoltaCalendar_'+p.utenza.tipologiaUtenza].push(pr);
//            }
//          });
//        }
      });
    }
    localStorage.profileData = JSON.stringify(profileData);
  };
  
  var process = function(url) {
    var deferred = $q.defer();
    JSZipUtils.getBinaryContent(url, function(err, data) {
      if(err) {
        deferred.reject(false); // or handle err
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
  
  var getDataURL = function(remote) {
    if (remote) {
      if (USE_DRAFT) {
        return ENDPOINT_URL+'/draft/'+APP_ID+'/zip';
      } else {
        return ENDPOINT_URL+'/zip/'+APP_ID;
      }
    } else {
      return LOCAL_DATA_URL;
    }
  }

  var doWithVersion = function(v, remote) {
    var storedVersion = localStorage.version;
    if (storedVersion && storedVersion >= v) return;
    
    process(getDataURL(remote)).then(function(result){
      if (result) localStorage.version = v;
    });
  }
  
  var extractVersion = function(data) {
    var obj = data;
    if (USE_DRAFT) return obj.draftState.version;
    return obj.publishState.version;
  };
  
  return {
    get : get,
    updateProfiles: function(newProfiles) {
      profili = newProfiles;
      updateProfileData();
    },
    checkVersion: function(currentProfiles) {
      profili = currentProfiles;
      $http.get(VERSION_URL)
      .success(function(data) {
        var version = extractVersion(data);
        if (version) {
          doWithVersion(version, true);
        } else {
          doWithVersion(DATA_VERSION);
        }
      })
      .error(function(e) {
          doWithVersion(DATA_VERSION);
      });
    }, 
    reset: function() {
      // TODO
      // - clean profileData, objectData, version
      // - check version
    },
    getSync : function(key) {
      return profileData[key];
    } 
  };
})
