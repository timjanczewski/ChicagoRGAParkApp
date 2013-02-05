<!DOCTYPE html>
<html>
  <head>
    <title>Chicago Parking App</title>
    <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1" /> 
    <link href="lib/bootstrap.min.css" rel="stylesheet">
    <link href="lib/bootstrap-responsive.min.css" rel="stylesheet">
    <link href="styles.css" rel="stylesheet">
    <script src="lib/jquery.js"></script>
    <script src="lib/bootstrap.min.js"></script>
    <script src="lib/mustache.js"></script>
    <script src="lib/underscore.js"></script>
    <script src="lib/backbone.js"></script>
    <script src="lib/backbone.localStorage.js"></script>
    <script src="lib/moment.js"></script>
    <script src="source.js"></script>
  </head>
  <body>
    <div class="navbar navbar-inverse navbar-fixed-top">
      <div class="navbar-inner">
        <div class="container">
          <a class="brand" href="#">Chicago Parking</a>
          <a class="btn btn-navbar collapsed" data-toggle="collapse" data-target=".nav-collapse">
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </a>
          <div class="nav-collapse collapse" style="height: 0px; ">
            <ul class="nav">
              <li><a class="menu-signin" href="#signin">Sign in</a></li>
              <li><a class="menu-register" href="#register">Register a User</a></li>
              <li><a class="menu-reservations" href="#reservations">Make a Reservation</a></li>
              <li><a class="menu-myreservation" href="#myreservations">See My Reservations</a></li>
              <li><a class="menu-logout" href="#logout">Log Out</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <div id="container" class="container"/>
  </body>
</html>
