alert('deviceready set');
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
            app.showAlert('init start');
            this.store = new LocalStorageStore();
            app.showAlert('store ok');

            $('.search-key').on('keyup', $.proxy(this.findByName, this));

            //this.showAlert('Données initialisées','Info');
            var self = this;
            $(document).on("click",".add-location-btn",this.addLocation);
            $(document).on("click",".change-pic-btn",this.changePicture);

            app.showAlert('bind ok');
/*
            if(navigator.splashscreen){
                navigator.splashscreen.show();
                setTiemout(function(){
                    navigator.splashscreen.hide();
                },1000);
            }

            d('splashcreen ok');
*/
            this.startWatch();
            app.showAlert('init end');
        }catch(any){
            app.showAlert(any);
        }
    },

    accelerometerSuccess:function(acceleration){
        $("#motion-infos").text('Acceleration X: ' + acceleration.x + '\n' +
          'Acceleration Y: ' + acceleration.y + '\n' +
          'Acceleration Z: ' + acceleration.z + '\n' +
          'Timestamp: '      + acceleration.timestamp + '\n');
    },

    accelerometerError:function(event){
        $("#motion-infos").text('Erreur');
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
            d('init motion');// Update acceleration every 3 seconds
            var options = { frequency: 1000 };

            watchID = navigator.accelerometer.watchAcceleration(onSuccess, onError, options);
        }else{
            app.showAlert("Accelerometre non supporté","Erreur");
        }
    }
};

$(document).ready(function(){
    app.showAlert('jquery ready');
})

function onDeviceReady(){
    app.showAlert('deviceready fired');
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