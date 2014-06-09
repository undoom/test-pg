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
            $(document).on("click",".notication .confirm",this.confirmNotification);
            $(document).on("click",".notication .alert",this.alertNotification);


            this.startWatch();
        }catch(any){
            app.showAlert(any);
        }
    },

    alertNotification:function(e){
        e.preventDefault();
        if(navigator.notification){
            navigator.notification.alert('Message','titre');
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
        }
    },

    onConfirm:function(index){
        alert('Bouton pressé : '+index);
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

function accelerometerSuccess(acceleration){
    $("#motion-infos").text('Acceleration X: ' + acceleration.x + '\n' +
      'Acceleration Y: ' + acceleration.y + '\n' +
      'Acceleration Z: ' + acceleration.z + '\n' +
      'Timestamp: '      + acceleration.timestamp + '\n');
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