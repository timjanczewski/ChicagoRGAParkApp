$(function(){
  var router  = new Router;
  window.user = new UserModel({id: 1});
  window.user.fetch();
  window.today = function(){
    return moment().format('MM-DD-YYYY');
  }
  window.service = function(req, request, callback){
    // spaces: 13, 14, 21, 22, 23, 31
    // window.service("DeleteUser","{ email:'abraham.velazquez@rga.com' }");
    // window.service("AddUser","{ email : 'abraham.velazquez@rga.com', name : 'Abraham Velazquez', plate : 'N639275', desc : 'Scion xB', commute : '3'}");
    // window.service("Reserve","{ date: '01/18/2013', email: 'abraham.velazquez@rga.com', space:'13'}")
    // window.service("Delete","{ date: '01/18/2013', email: 'abraham.velazquez@rga.com'}")
    // window.service("GetReservations","{ date: '01/18/2013'}")
    // window.service("GetUserReservations","{ email: 'abraham.velazquez@rga.com', type:'0'}") //today
    // window.service("GetUserReservations","{ email: 'abraham.velazquez@rga.com', type:'1'}") //future

    console.log(req + ': ' + request)
    $.ajax({
      type: "POST",
      contentType: "application/json; charset=utf-8",
      url: "/service.asmx/" + req,
      data: request,
      async: false,
      dataType: "json",
      success: function(response) {
          if(callback)callback(response);
          console.log(response)
      }
    });
  }
  window.navigate = function(path){
    router.navigate(path, true);
  };
  Backbone.history.start();
});

var Router = Backbone.Router.extend({
  routes: {
    '': 'index',
    'reservations': 'reservations',
    'reservations/:date': 'reservations',
    'myreservations': 'myreservations',
    'signin': 'signin',
    'logout': 'logout',
    'delete': 'delete',
    'delete/:date': 'delete',
    'register': 'register'
  },
  index: function(){
    if(window.user.get('User') == null) {
      window.navigate('/signin');
    } else {
      window.navigate('/reservations');
    }
  },
  signin: function(){
    var view = new signinView;
    view.render();
    $('#container').children().remove();
    $('#container').append(view.el);
    $('body').attr("id",'signin')
  },
  register: function(){
    var view = new registerView;
    view.render();
    $('#container').children().remove();
    $('#container').append(view.el);
    $('body').attr("id",'register')
  },
  logout: function(){
    window.user.destroy()
    window.navigate('/signin');
  },
  delete: function(subroute){
    var date = (subroute) ? subroute : window.today();
    window.service("Delete","{ date: '" + date +"', email: '" + window.user.get('User') + "'}", function(){
      window.navigate('/myreservations');
    });
  },
  reservations: function(subroute){
    if(window.user.get('User') == null) {
       window.navigate('/signin');
      return;
    }
    var reservations = {}
    if(subroute) {
      var reservationView = new newReservationView(subroute);
      reservationView.render(subroute);
    } else {
//    window.service("GetUserReservations","{ email: '" + window.user.get('User') + "', type:'1'}",function(data){reservations = data.d.Reservations;})
      var reservationView = new newReservationView();
      reservationView.render();
    }
    $('#container').children().remove();
    $('#container').append(reservationView.el)
    $('body').attr("id",'reservations')
  },
  myreservations: function(){
    if(window.user.get('User') == null) {
      window.navigate('/signin');
      return;
    }
    var myReservations = new myReservationsView();
    myReservations.render();
    $('#container').children().remove();
    $('#container').append(myReservations.el)
    $('body').attr("id",'myreservations')
  }
});

// Views
var signinView = Backbone.View.extend({
  template: ''
    + '<form class="form">'
    + '<h2>Who are you?</h2>'
    + '<select name="user">'
    + '<option value="" selected="selected"></option>'
    + '{{#users}}'
    + '<option value="{{Email}}">{{Name}}</option>'
    + '{{/users}}'
    + '</select><br>'
    + '<button class="btn btn-primary">Sign In</button>'
    + '</div></form>',
  events: {   
    'click button': 'submit'
  },
  render: function(){
    var context = {};
    window.service('GetAllUsers', '', function(data){context.users = data.d.Reservations;});
    this.$el.html(Mustache.render(this.template,context));
  },
  submit: function(e){
    var user = this.$('select[name="user"]').val()
      , name = this.$("select option:selected").text()
    if(user != "") {
      window.user.set('User', user);
      window.user.set('Name', name);
      window.user.save();
      window.navigate('/reservations');
    }
    return false;
  }
});
var registerView = Backbone.View.extend({
  template: ''
    + '<form class="form">'
    + '<h2>Register.</h2>'
    + '<input type="text" placeholder="Full Name" name="name" /><br>'
    + '<input type="email" placeholder="Emaill Address" name="user" /><br>'
    + '<input type="text" placeholder="License Plate Number" name="plate" /><br>'
    + '<input type="text" placeholder="Vechicle description" name="desc" /><br>'
    + '<input type="text" placeholder="Commute distance?" name="commute" /><br>'
    + '<button class="btn btn-primary">Register</button>'
    + '</form>'
    + '',
  events: {   
    'click button': 'submit'
  },
  render: function(){
    this.$el.html(this.template);
  },
  submit: function(){
    var name = this.$('input[name="name"]').val()
      , user = this.$('input[name="user"]').val()
      , plate = this.$('input[name="plate"]').val()
      , desc = this.$('input[name="desc"]').val()
      , commute = this.$('input[name="commute"]').val()
    var data = "{ name : '" + name + "', email : '" + user + "', plate : '" + plate + "', desc : '" + desc + "', commute : '" + parseInt(commute) + "'}"
    window.service('AddUser',data, function(){
      window.navigate('/signin');
    })
    return false;
  }
});
var newReservationView = Backbone.View.extend({
  className: 'newreservation',
  template: ''
    + '<form class="form-inline">'
    + '<h2>Hi {{ name }}</h2>'
    + '<div class="reserve btn-group btn-group-vertical">'
      + '<h4>Make a reservations for<br> {{day}}, <span class="date">{{date}}</span></h4>'
      + '{{^spaces}}<h1>NO SPACE FOR YOU!</h1>({{/spaces}}'
      + '{{#spaces}}'
        + '<button class="btn make-reservation" data-space="{{.}}">Parking Space  {{.}}</button>'
      + '{{/spaces}}'
    + '</div>'
    + '</form>'
    + '<h4>Reserve a different date?</h4>'
    + '<ul>'
    + '{{#futureDates}}'
      + '<li><a class="changedate" href="#reservations/{{.}}">{{.}}</a></li>'
    + '{{/futureDates}}'
    + '</ul>'
    ,
  events: {
    'click .make-reservation': 'makeReservation'
  },
  render: function(args){
    var reservations    = {}
      , spaces          = [13, 14, 23, 31]
      , reservationDate = function() {
          return (args) ? args : window.today();
      }
    window.service("GetReservations","{ date: '" + reservationDate() +"'}", function(data){reservations = data.d.Reservations;})
    $(reservations).each(function(){
      spaces.splice($.inArray(this.Space, spaces),1)
    })
    var context = {
      user: window.user.get('User'),
      name: window.user.get('Name'),
      spaces: spaces,
      nospaces: function(){
        return (spaces.length > 0);
      },
      date: reservationDate(),
      day: function(){
        return moment(reservationDate()).format('dddd')
      },
      futureDates: function(){
        var newDates = [];
        for (var i = 0; i < 4; i++) {
          newDates.push(moment(window.today()).add('days', i).format('MM-DD-YYYY'))
        };
        return newDates;
      }
    };
    this.$el.html(Mustache.render(this.template, context));
  },
  makeReservation: function(e){
    var date = this.$('.date').text()
      , space = $(e.target).data('space');
    window.service("Reserve","{ date: '" + date + "', email: '" + window.user.get('User') + "', space:'" + space + "'}",function(data){
      $(".newreservation").html("<h3>Woohoo! Your are confirmed for Space #" + space +".<br> Ok. Thanks. Bye.</h3><a href='#myreservations' class='btn'>See My Reservations</a>");
    })
    return false;
  }
});
var myReservationsView = Backbone.View.extend({
  className: 'myreservations',
  template:  '<h2>Hi {{ name }}</h2>'
           + '{{^reservations}}<h4>You do not have any reservations.</h4><a href="#reservations" class="btn">Make a reservation</a>{{/reservations}}'
           + '{{#reservations}}'
            + '<h4>{{ Date }} in space {{ Space }}</h4>'
            + '<a href="#delete/{{ Date }}" class="btn">Cancel this reservation</a>'
           + '{{/reservations}}',
  render: function(){
    var reservations = {}
    window.service("GetUserReservations","{ email: '" + window.user.get('User') + "', type:'1'}", function(data){
      reservations = data.d.Reservations;
    });
    for (var i = 0; i < reservations.length; i++) {
      reservations[i].Date = moment(reservations[i].Date).format('MM-DD-YYYY')
    };
    var context = {
      reservations: reservations,
      name: window.user.get('Name'),
    };
    this.$el.html(Mustache.render(this.template, context));
  }
});

// Models
var UserModel = Backbone.Model.extend({
  localStorage: new Store('User')
});


















