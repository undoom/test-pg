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
        this.store = new LocalStorageStore();
        $('.search-key').on('keyup', $.proxy(this.findByName, this));

        //this.showAlert('Données initialisées','Info');
        var self = this;
        $(document).on("click",".add-location-btn",this.addLocation);
        $(document).on("click",".change-pic-btn",this.changePicture);

        if(navigator.accelerometer){
            navigator.accelerometer.getCurrentAcceleration(this.accelerometerSuccess, this.accelerometerError);
        }else{
            app.showAlert("Accelerometre non supporté","Erreur");
        }
    },

    accelerometerSuccess:function(acceleration){
        alert('Acceleration X: ' + acceleration.x + '\n' +
          'Acceleration Y: ' + acceleration.y + '\n' +
          'Acceleration Z: ' + acceleration.z + '\n' +
          'Timestamp: '      + acceleration.timestamp + '\n');
    },

    accelerometerError:function(event){

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
            alert(title?(title+" : "+message) : message);
        }
    },
};

document.addEventListener("deviceready", app.initialize, false);

$(document).ready(function(){
    if(navigator.splashscreen){
        navigator.splashscreen.show();
        setTiemout(function(){
            navigator.splashscreen.hide();
        },2000);
    }
})