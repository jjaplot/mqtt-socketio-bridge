<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <meta name="description" content="" />
        <meta name="author" content="" />
        <title>Dashboard - SB Admin</title>
        <link href="css/styles.css" rel="stylesheet" />
        <link href="https://cdn.datatables.net/1.10.20/css/dataTables.bootstrap4.min.css" rel="stylesheet" crossorigin="anonymous" />
        <script src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.11.2/js/all.min.js" crossorigin="anonymous"></script>
        <!-- Pull in the socket.io library -->
        <script src="/socket.io/socket.io.js"></script>
        <!-- Include jQuery, just used here for some of the DOM manipulation and
                AJAX calls.  Not *required* for the MQTT-SocketIO bridge itself -->
        <!--suppress JSUnresolvedLibraryURL -->
        <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.0/jquery.min.js"></script>
        <!--suppress JSUnresolvedLibraryURL -->
        <script src="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.3.1/js/bootstrap.min.js"></script>
        <!--suppress JSUnresolvedLibraryURL -->
        <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.8.0/Chart.min.js"></script>
        <script src="https://bernii.github.io/gauge.js/dist/gauge.min.js"></script>
        
        <script>
             // Bring up a socket.io connection
             var socket = io.connect()
                   socket.on('connect', function() {
                           // Subscribe to the topic(s) we're interested in
                           // Uncomment this line if you want to automatically subscribe to a topic
                           //socket.emit('subscribe', { 'topic': 'mcqn/#' })
                   })
            

            $(document).ready(function () {
                const config = {
                    type: 'line',
                    data: {
                        labels: [],
                        datasets: [{
                            label: "Random Dataset",
                            backgroundColor: 'rgb(255, 99, 132)',
                            borderColor: 'rgb(255, 99, 132)',
                            data: [],
                            fill: false,
                        }],
                    },
                    options: {
                        responsive: true,
                        title: {
                            display: true,
                            text: 'Creating Real-Time Charts with Flask'
                        },
                        tooltips: {
                            mode: 'index',
                            intersect: false,
                        },
                        hover: {
                            mode: 'nearest',
                            intersect: true
                        },
                        scales: {
                            xAxes: [{
                                display: true,
                                scaleLabel: {
                                    display: true,
                                    labelString: 'Time'
                                }
                            }],
                            yAxes: [{
                                display: true,
                                scaleLabel: {
                                    display: true,
                                    labelString: 'Value'
                                }
                            }]
                        }
                    }
                };
        
                const context = document.getElementById('myLineChart').getContext('2d');
        
                const lineChart = new Chart(context, config);

                       // Set up callback for whenever an MQTT message arrives
                socket.on('mqtt', function(msg) {
                           console.log("message: ["+msg.topic+"] >>"+msg.payload+"<<")
                           // For this example page, we'll just push the new message
                           // to the top of a simple list
                           //submqtt()
                           
                           datpe = typeof(msg.payload)
                           pressure = parseInt(msg.payload)
                           submqtt2(pressure)
                           
                           if (config.data.labels.length === 20) {
                            config.data.labels.shift();
                            config.data.datasets[0].data.shift();
                            }
                            config.data.labels.push('this');
                            config.data.datasets[0].data.push(pressure);
                            lineChart.update();
                           
                           $('#messages').prepend("<li>["+msg.topic+"] "+msg.payload+"</li>")
                           
                })



                
            });
 
        function submqtt() 
            {
            var inputVal = document.getElementById("subs_topic").value;
            document.getElementById('mymqtt').innerHTML = inputVal;
            }
        </script>

        <script>
        function submqtt2(prinDt) 
        {
        
        document.getElementById('data').innerHTML = prinDt;
        }
        </script>
        

     

    </head>

    <body class="sb-nav-fixed">
        <nav class="sb-topnav navbar navbar-expand navbar-dark bg-dark">
            <a class="navbar-brand" href="test.html">Start Bootstrap</a><button class="btn btn-link btn-sm order-1 order-lg-0" id="sidebarToggle" href="#"><i class="fas fa-bars"></i></button
            >
            <!-- Navbar Search-->
        
            <!-- Navbar-->
      
        </nav>
        <div id="layoutSidenav">
            <div id="layoutSidenav_nav">
                <nav class="sb-sidenav accordion sb-sidenav-dark" id="sidenavAccordion">
                    <div class="sb-sidenav-menu">
                        <div class="nav">
                            <div class="sb-sidenav-menu-heading">Core</div>
                            <a class="nav-link" href="test.html"
                                ><div class="sb-nav-link-icon"><i class="fas fa-tachometer-alt"></i></div>
                                Dashboard</a
                            >
                            <div class="sb-sidenav-menu-heading">Interface</div>
                            
                           
                            <section>
                                <h2>Messages Received</h2>
                                <p>Once you have subscribed to at least one topic, any messages received will be shown below in the form <code>[topic name] payload</code>.
                
                                <ul id="messages">
                                </ul>
                            </section>

                            <a class="nav-link collapsed" href="#" data-toggle="collapse" data-target="#collapseLayouts" aria-expanded="false" aria-controls="collapseLayouts"
                                ><div class="sb-nav-link-icon"><i class="fas fa-columns"></i></div>
                                Layouts
                                <div class="sb-sidenav-collapse-arrow"><i class="fas fa-angle-down"></i></div
                            ></a>
                            <div class="collapse" id="collapseLayouts" aria-labelledby="headingOne" data-parent="#sidenavAccordion">
 
                                <nav class="sb-sidenav-menu-nested nav" onclick="$('#subs_status').text('Working...').show(); socket.emit('subscribe', { 'topic': $('#subs_topic')[0].value }); $('#subs_status').text('Ok').fadeOut(2000); return false;"><a class="nav-link">Static Navigation</a>
                            <a class="nav-link collapsed" href="#" data-toggle="collapse" data-target="#collapsePages" aria-expanded="false" aria-controls="collapsePages"
                                ><div class="sb-nav-link-icon"><i class="fas fa-book-open"></i></div>
                                Pages
                                <div class="sb-sidenav-collapse-arrow"><i class="fas fa-angle-down"></i></div
                            ></a>
                            

                            
                            <div class="collapse" id="collapsePages" aria-labelledby="headingTwo" data-parent="#sidenavAccordion">
                                <nav class="sb-sidenav-menu-nested nav accordion" id="sidenavAccordionPages">
                                    
                                    <a class="nav-link collapsed" href="#" data-toggle="collapse" data-target="#pagesCollapseAuth" aria-expanded="false" aria-controls="pagesCollapseAuth"
                                        >Authentication
                                        
                                        <div class="sb-sidenav-collapse-arrow"><i class="fas fa-angle-down"></i></div
                                    ></a>
                                    <div class="collapse" id="pagesCollapseAuth" aria-labelledby="headingOne" data-parent="#sidenavAccordionPages">
                                        <nav class="sb-sidenav-menu-nested nav"><a class="nav-link" href="login.html">Login</a><a class="nav-link" href="register.html">Register</a><a class="nav-link" href="password.html">Forgot Password</a></nav>
                                    </div>
                                    <a class="nav-link collapsed" href="#" data-toggle="collapse" data-target="#pagesCollapseError" aria-expanded="false" aria-controls="pagesCollapseError"
                                        >Error
                                        <div class="sb-sidenav-collapse-arrow"><i class="fas fa-angle-down"></i></div
                                    ></a>
                                    <div class="collapse" id="pagesCollapseError" aria-labelledby="headingOne" data-parent="#sidenavAccordionPages">
                                        <nav class="sb-sidenav-menu-nested nav"><a class="nav-link" href="401.html">401 Page</a><a class="nav-link" href="404.html">404 Page</a><a class="nav-link" href="500.html">500 Page</a></nav>
                                    </div>
                                </nav>
                            </div>
                            <div class="sb-sidenav-menu-heading">Addons</div>
                            <a class="nav-link" href="charts.html"
                                ><div class="sb-nav-link-icon"><i class="fas fa-chart-area"></i></div>
                                Charts</a
                            ><a class="nav-link" href="tables.html"
                                ><div class="sb-nav-link-icon"><i class="fas fa-table"></i></div>
                                Tables</a
                            >
                        </div>
                    </div>

                    <form id='subscribe' method='post'>
                        <label for="subs_topic"></label>

                        <div class="input-group">
                            <input class="form-control" name="subs_topic" id="subs_topic" type="text" />

                             <div class="input-group-append">
                             <button class="btn btn-primary" type="button" onclick="$('#subs_status').text('Working...').show(); socket.emit('subscribe', { 'topic': $('#subs_topic')[0].value }); $('#subs_status').text('Ok').fadeOut(2000); return false;" ><i class="fas fa-bars"></i></button>
                             </div>   
                        
                        </div>

                        <span id="subs_status"></span>
                   
                    </form>

                    <div class="sb-sidenav-footer">
                        <div class="small">Logged in as:</div>
                        <label id = "mymqtt"> 
                            Welcome to GeeksforGeeks 
                        </label>
                        <h3>Data: <span id="data"></span></h3>
                    </div>
                </nav>
            </div>
            <div id="layoutSidenav_content">
                <main>
                    <div class="container-fluid">
                        <h1 class="mt-4">Dashboard</h1>

                            <div class="col-xl-12">
                                <div class="card mb-4">
                                    <div class="card-header"><i class="fas fa-chart-bar mr-1"></i>Bar Chart Example</div>
                                    <div class="card-body"><canvas id="myLineChart" width="100%" height="40"></canvas></div>
                                </div>
                            </div>
                        
                 
                        <div class="row">
                            <div class="col-xl-3 col-md-6">
                                <div class="card bg-primary text-white mb-4">
                                    <div class="card-body">Primary Card</div>
                                    <canvas id="foo"></canvas>
                                </div>
                            </div>
                            <div class="col-xl-3 col-md-6">
                                <div class="card bg-warning text-white mb-4">
                                    <div class="card-body">Warning Card</div>
                                    <div class="card-footer d-flex align-items-center justify-content-between">
                                        <a class="small text-white stretched-link" href="#">View Details</a>
                                        <div class="small text-white"><i class="fas fa-angle-right"></i></div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-xl-3 col-md-6">
                                <div class="card bg-success text-white mb-4">
                                    <div class="card-body">Success Card</div>
                                    <div class="card-footer d-flex align-items-center justify-content-between">
                                        <a class="small text-white stretched-link" href="#">View Details</a>
                                        <div class="small text-white"><i class="fas fa-angle-right"></i></div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-xl-3 col-md-6">
                                <div class="card bg-danger text-white mb-4">
                                    <div class="card-body">Danger Card</div>
                                    <div class="card-footer d-flex align-items-center justify-content-between">
                                        <a class="small text-white stretched-link" href="#">View Details</a>
                                        <div class="small text-white"><i class="fas fa-angle-right"></i></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                       
                    </div>
                </main>
                <footer class="py-4 bg-light mt-auto">
                    <div class="container-fluid">
                        <div class="d-flex align-items-center justify-content-between small">
                            <div class="text-muted">Copyright &copy; Your Website 2019</div>
                            <div>
                                <a href="#">Privacy Policy</a>
                                &middot;
                                <a href="#">Terms &amp; Conditions</a>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
        <script src="https://code.jquery.com/jquery-3.4.1.min.js" crossorigin="anonymous"></script>
        <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.bundle.min.js" crossorigin="anonymous"></script>
        <script src="js/scripts.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.8.0/Chart.min.js" crossorigin="anonymous"></script>
        <script src="assets/demo/chart-area-demo.js"></script>
        <script src="assets/demo/chart-bar-demo.js"></script>
        <script src="https://cdn.datatables.net/1.10.20/js/jquery.dataTables.min.js" crossorigin="anonymous"></script>
        <script src="https://cdn.datatables.net/1.10.20/js/dataTables.bootstrap4.min.js" crossorigin="anonymous"></script>
        <script src="assets/demo/datatables-demo.js"></script>
        <script src="js/gauge.js"></script>
               
    </body>
</html>
