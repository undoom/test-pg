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

        this.showAlert('Données initialisées','Info');
    },

    showAlert: function(message,title){
        if(navigator.notification){
            navigator.notification.alert(message, null, title, 'OK');
        }else{
            alert(title?(title+" : "+message) : message);
        }
    }
};

app.initialize();