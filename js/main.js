document.addEventListener("deviceready", onDeviceReady, false);

var watchID = null;
var app = {

    findByName: function() {
        this.store.findByName($('.search-key').val(), function(employees) {
            var l = employees.length;
            var e;
            $('.employee-list').empty();
            for (var i=0; i<l; i++) {
                e = employees[i];
                $('.employee-list').append('<li><a href="#employees/' + e.id + '">' + e.firstName + ' ' + e.lastName + '</a></li>');
            }
        });
    },

    initialize: function() {
        try{
            this.store = new LocalStorageStore();

            $('.search-key').on('keyup', $.proxy(this.findByName, this));

            //this.showAlert('Données initialisées','Info');
            var self = this;
            $(document).on("click",".add-location-btn",this.addLocation);
            $(document).on("click",".change-pic-btn",this.changePicture);
            $(document).on("click",".notification .confirm",this.confirmNotification);
            $(document).on("click",".notification .alert",this.alertNotification);
            $(document).on("click",".notification .beep",this.beepNotification);
            $(document).on("click",".notification .vibrate",this.vibrateNotification);


            this.startWatch();
        }catch(any){
            app.showAlert(any);
        }
    },

    alertNotification:function(e){
        e.preventDefault();
        if(navigator.notification){
            navigator.notification.alert('Message','titre');
        }else{
            app.showAlert('Notification native non supportée');
        }
    },

    confirmNotification:function(e){
        e.preventDefault();
        if(navigator.notification){
            navigator.notification.confirm(
                'Vous avez gagné', // message
                app.onConfirm, // callback
                'Partie terminée', //titre
                'Restart,Exit' // Libellé boutons
            );
        }else{
            app.showAlert('Notification native non supportée');
        }
    },

    onConfirm:function(index){
        alert('Bouton pressé : '+index);
    },

    beepNotification:function(e){
        e.preventDefault();
        if(navigator.notification){
            navigator.notification.beep(2);
        }else{
            app.showAlert('Notification native non supportée');
        }
    },

    vibrateNotification:function(e){
        e.preventDefault();
        if(navigator.notification){
            navigator.notification.vibrate(1000);
        }else{
            app.showAlert('Notification native non supportée');
        }
    },

    changePicture:function(event){
        event.preventDefault();
        if(!navigator.camera){
            app.showAlert("Camera non supportée","Erreur");
            return;
        }
        var self = this;
        var options =   {
                            quality:50,
                            destinationType: Camera.DestinationType.DATA_URL,
                            sourceType:1,   //0 : Gallerie, 1 : APN, 2 Album
                            encodingType:0  //0 : JPG, 1 : PNG
                         }
        navigator.camera.getPicture(
            function(imageData){
                $(self).after("<img src='data:image/jpg;base64,"+imageData+"' style='max-width:100%'>");
            },function(){
                app.showAlert('Erreur à la récupération e l\'image', 'Erreur');
            },
            options);

        return false;
    },

    addLocation:function(event){
        event.preventDefault();
        navigator.geolocation.getCurrentPosition(
            function(position){
                app.showAlert(position.coords.latitude + ',' + position.coords.longitude,"Localisation");
            },function(){
                alert("Error getting location");
            });
        return false;
    },

    showAlert: function(message,title){
        if(navigator.notification){
            navigator.notification.alert(message, null, title, 'OK');
        }else{
            d(title?(title+" : "+message) : message);
        }
    },

    startWatch:function(){
        if(navigator.accelerometer){
            var options = { frequency: 1000 };

            watchID = navigator.accelerometer.watchAcceleration(accelerometerSuccess, accelerometerError, options);
        }else{
            app.showAlert("Accelerometre non supporté","Erreur");
        }
    },
};


var Stockage = function(){
    this.addNote = function(contenu){
        this.getDatas();
        var maxID = 0;
        for(var i=0;i<this.Notes.length;i++){
            if(this.Notes[i].id > maxID)
                maxID = this.Notes[i].id;
        }
        var object = {id:maxID+1};
        if(typeof(contenu.texte)!="undefined"){
            object["texte"] = contenu.texte;
        }

        if(typeof(contenu.img)!="undefined"){
            object["img"] = contenu.img;
        }

        if(typeof(contenu.loc)!="undefined"){
            object["loc"] = contenu.loc;
        }

        this.Notes.push(object);
        this.saveDatas();
    };

    this.removeNote  =function(id){
        this.getDatas();
        var Temp = [];
        for(var i=0;i<this.Notes.length;i++){
            if(this.Notes[i].id != id){
                Temp.push(this.Notes[i]);
            }
        }
        this.Notes = Temp;
        this.saveDatas();
    };

    this.listeNotes = function(){
        this.getDatas();
        $("#listeNotes").empty();
        for(var i=0;i<this.Notes.length;i++){
            $("#listeNotes").append("<li>"+this.Notes[i].texte+" <a href='"+this.Notes[i].id+"' class='remove ui-btn ui-icon-delete ui-btn-icon-notext ui-corner-all' data-inline='true'></a></li>");
        }

        $("#listeNotes a.remove").button();
    };

    this.saveDatas =function(){
        window.localStorage.setItem("notes",JSON.stringify(this.Notes));
        window.location.href="#homeNote";
        this.listeNotes();
    };

    this.getDatas = function(){
        var Notes = JSON.parse(window.localStorage.getItem("notes"));
        if(Notes == null)
            Notes = [];
        this.Notes = Notes;
    };

    var Notes;
}


function accelerometerSuccess(acceleration){
    $("#motion-infos").text('Acceleration X: ' + acceleration.x + '<br>' +
      'Acceleration Y: ' + acceleration.y + '<br>' +
      'Acceleration Z: ' + acceleration.z + '<br>' +
      'Timestamp: '      + acceleration.timestamp + '<br>');
}

function accelerometerError(){
    $("#motion-infos").text('Erreur');
}

function onDeviceReady(){
    app.initialize();
}

function d(val){
    if(typeof(console)!="undefined"){
        if(typeof(console.debug)!="undefined"){
            console.debug(val);
        }else if(typeof(console.log)!="undefined"){
            console.log(val);
        }
    }
}
var geoloc="";
$(document).ready(function(){
    $("#saveContent").click(function(e){
        e.preventDefault();
        var Datas = new Stockage();
        var toAdd = {texte:$("#noteContent").val()};
        if(geoloc!=""){
            toAdd["loc"] = geoloc;
        }
        Datas.addNote(toAdd);
    });

    $("#addGeoLoc").change(function(){
        if($("#addGeoLoc").is(':checked')){
            navigator.geolocation.getCurrentPosition(
                function(position){
                    geoloc = position.coords.latitude + ',' + position.coords.longitude;
                    $("#locOK").text("Localisation OK");
                },function(){
                    alert("Error getting location");
                });
        }else{
            geoloc = "";
            $("#locOK").text("");
        }
    })

    $("#addGeoLoc").change();

    $(document).on("click","#listeNotes .remove",function(e){
        e.preventDefault();
        var id = $(this).attr('href');
        d(id);
        var Datas = new Stockage();
        Datas.removeNote(id);
    })

    var Datas = new Stockage();
    Datas.listeNotes();
})
/*
setTimeout(function(){
    onDeviceReady();
},0);
*/