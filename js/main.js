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
    },

    changePicture:function(event){
        event.preventDefault();
        if(!navigator.camera){
            app.showAlert("Camera non supportée","Erreur");
            return;
        }
        var options =   {
                            quality:50,
                            destinationType: Camera.DestinationType.DATA_URL,
                            sourceType:1,   //0 : Gallerie, 1 : APN, 2 Album
                            encodingType:0  //0 : JPG, 1 : PNG
                         }
        navigator.camera.getPicture(
            function(imageData){
                $(this).after("<img src='data:image/jpeg;base64,"+imageData+"'>");
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

app.initialize();