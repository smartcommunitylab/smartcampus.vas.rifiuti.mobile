angular.module('rifiuti.services.profili', [])

.factory('Profili', function (DataManager, $rootScope, Raccolta, Calendar) {
    var toMessage = function(typemap) {
      var lines = [];
      for (var t in typemap) {
        lines.push(t);
      }
      if (lines.length == 1) {
        return lines[0];
      } else if (lines.length > 1) {
        var msg = lines[0];
        for (var i = 1; i < lines.length; i++) {
          msg += ',' + lines[i].replace('Porta a porta', '');
        }
        return msg;
      }
      
      return null;
    };
    var updateNotifications = function() {
      if (window.plugin && window.plugin.notification) {
//        window.plugin.notification.local.cancelAll();
        $rootScope.profili.forEach(function(p) {
          Raccolta.notificationCalendar(p.aree, p.utenza.tipologiaUtenza, p.id, p.area.comune).then(function(data){
            // TODO: group by date?
            if (data) {
              var daymap = {};
              // notifications for 1 month range
              var dFrom = new Date();
              var dTo = new Date(); dTo.setMonth(dTo.getMonth()+1);
              
              data.forEach(function(n) {
                n.orarioApertura.forEach(function(cal) {
                  // considered DOW
                  var dow = Calendar.textToDOW(cal.il);
                  // upper bound of notifications interval for this calendar
                  var max = new Date(Date.parse(cal.dataA));
                  if (max.getTime() > dTo.getTime()) max.setTime(dTo.getTime());
                  // lower bound of notifications interval for this calendar
                  var min = new Date(Date.parse(cal.dataDa));
                  if (min.getTime() < dFrom.getTime()) min.setTime(dFrom.getTime());
                  // running date
                  var currFrom = new Date();
                  currFrom.setDate(currFrom.getDate()-Calendar.dayToDOW(currFrom.getDay())+dow);
                  while (currFrom.getTime() < max.getTime()) {
                    // running date is ok?
                    var targetDate = new Date(currFrom.getFullYear(),currFrom.getMonth(),currFrom.getDate()-1,15,0,0,0);
                    if (targetDate.getTime() > dFrom.getTime()) {
                      var dStr = currFrom.toLocaleString();
                      if (!(dStr in daymap)) {
                        daymap[dStr] = {
                          id: n.id+'_'+dStr,
                          title: 'Domani a '+n.comune,
                          message: {},
                          repeat:  null,
                          date: targetDate,
                          autoCancel: true
                        };
                      }
                      daymap[dStr].message[n.tipologiaPuntiRaccolta] = 1;
                    }
                    // move to next week
                    currFrom.setDate(currFrom.getDate()+7);
                  }
                });
              });
              for (var d in daymap) {
                var n = daymap[d];
                n.message = toMessage(n.message);
                if (n.message) {
                  window.plugin.notification.local.add(n);
                }
              }
            }
          });
        });
      }
    };
  
    var update = function() {
      read();
      var profileIndex=-1;
      if ($rootScope.selectedProfile) {
        $rootScope.profili.forEach(function(profile,pi){
          if (profile.name==$rootScope.selectedProfile.name) profileIndex=pi;
        });
      } else {
        profileIndex=0;
      }
      DataManager.updataProfiles($rootScope.profili);
      updateNotifications();
      select(profileIndex);
    };
    var save = function() {
      $rootScope.profili.forEach(function(p) {
        aree(p);
      });
      localStorage.profiles=JSON.stringify($rootScope.profili);
      update();
    };
    var indexof = function(id) {
      for (var pi=0; pi<$rootScope.profili.length; pi++) {
        if ($rootScope.profili[pi].id==id) return pi;
      }
      return -1;
    };
    var byname = function(profileName) {
      for (var pi=0; pi<$rootScope.profili.length; pi++) {
        if ($rootScope.profili[pi].name==profileName) return $rootScope.profili[pi];
      }
      return null;
    };
    var read = function() {
      if (localStorage.profiles) {
        if (localStorage.profiles.charAt(0)=='[') {
          $rootScope.profili=JSON.parse(localStorage.profiles);
          $rootScope.profili.forEach(function(profile){
            profile.image = "img/rifiuti_btn_radio_off_holo_dark.png";
          });
        } else {
          localStorage.removeItem('profiles');
        }
      }
    };
    var select = function(profileIndex) {
      if (!!$rootScope.selectedProfile) {
        var p=byId($rootScope.selectedProfile.id);
        if (p) p.image = "img/rifiuti_btn_radio_off_holo_dark.png";
        $rootScope.selectedProfile=null;
      }
      if (profileIndex!=-1) {
        $rootScope.profili[profileIndex].image = "img/rifiuti_btn_radio_on_holo_dark.png";
        $rootScope.selectedProfile=$rootScope.profili[profileIndex];
        localStorage.selectedProfileId = $rootScope.selectedProfile.id;
        Raccolta.aree().then(function(myAree){
          //console.log('selectedProfile: '+JSON.stringify($rootScope.selectedProfile.name));
        });
      }
    };
    var byId = function(id) {
      for (var pi=0; pi<$rootScope.profili.length; pi++) {
        if ($rootScope.profili[pi].id==id) return $rootScope.profili[pi];
      }
      return null;
    };

    var readNotes = function() {
        var notes = localStorage.notes;
        if (!!notes && notes.charAt(0)=='{') notes=JSON.parse(localStorage.notes);
        else notes = {};
        return notes;
    };
    var saveNotes = function(notes) {
      localStorage.notes=JSON.stringify(notes);
    }
    
    var treeWalkUp=function(tree,parentName,key,results) {
      if (!parentName || parentName=="") return;
      tree.forEach(function(node){
        if (node[key]==parentName) {
//        var utenzaOK = node.utenza[$rootScope.selectedProfile.utenza.tipologiaUtenza];
//        if (utenzaOK) {
          results.push(node[key]);
//        }
          treeWalkUp(tree,node.parent,key,results);
        }
      });
    };

    var aree = function(p) {
      var myAree = [];
      var myComuni = [];
      var aree = DataManager.getSync('aree');
      aree.forEach(function(area,ai,dbAree){
            if (area.nome==p.area.nome) {
              var utenzaOK = area.utenza[p.utenza.tipologiaUtenza];
              if (utenzaOK) {
                myAree.push(area.nome);
                myComuni.push(area.comune);
              }
              treeWalkUp(dbAree,area.parent,'nome',myAree);
              treeWalkUp(dbAree,area.parent,'comune',myComuni);
            }
      });
      p.aree=myAree;
      p.comuni=myComuni;
    };
    
    return {
        updateNotifications: updateNotifications, 
        tipidiutenza: function() {
          return DataManager.get('data/db/profili.json').then(function(results){
            return results.data;
          });
        },
        read : read,
        add: function(name, utenza, area) {
          if (!byname(name)) {
              var id = ""+new Date().getTime();
              var res = {
                id: id,  
                name: name,
                utenza: utenza,
                area:area
              };
              $rootScope.profili.push(res);
              save();
              return res;
          }
          return null;    
        },
        update: function(id, name, utenza, area) {
          var old = byname(name);    
          if (!old || old.id == id) {
              old = this.byId(id);
              old.name = name;
              old.area = area;
              old.utenza = utenza;
              save();
              return old;
          }
          return null;    
        },
        delete: function(id) {
          var v = $rootScope.profili;
          v.splice(indexof(id), 1);
          $rootScope.profili = v;
          save();
        },
        byId: byId,
        select : select,
        selectedProfileIndex: function() {
            return indexof(localStorage.selectedProfileId);
        },
        getNotes: function() {
            return readNotes()[localStorage.selectedProfileId];
        },
        addNote: function(txt) {
            var allNotes = readNotes();
            var notes = allNotes[localStorage.selectedProfileId];
            if (!notes) notes = [];
            notes.push(txt);
            allNotes[localStorage.selectedProfileId] = notes;
            saveNotes(allNotes);
            return notes;
        },
        updateNote: function(idx, txt) {
            var allNotes = readNotes();
            var notes = allNotes[localStorage.selectedProfileId];
            if (!notes && !!notes[idx]) return null;
            notes[idx] = txt;
            saveNotes(allNotes);
            return notes;
        },
        deleteNotes: function(idx) {
            var allNotes = readNotes();
            var notes = allNotes[localStorage.selectedProfileId];
            var newNotes = [];
            for (var i = 0; i < notes.length;i++){
                if (idx.indexOf(i) < 0) newNotes.push(notes[i]);
            }
            allNotes[localStorage.selectedProfileId] = newNotes;
            saveNotes(allNotes);
            return newNotes;
        }
    }
})