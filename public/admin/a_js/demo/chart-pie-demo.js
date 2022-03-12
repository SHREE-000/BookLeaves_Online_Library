( async function() {
  const response = await fetch ('/a-product/pieChart')
  const newResponse = await response.json()
  let countState = newResponse.countOfState
  let subscriptionState = newResponse.sumOfSubscription
  let countPercentagee = newResponse.countPercentage 
  let subscriptionPercentagee = newResponse.subscriptionPercentage 
  let rate = document.querySelectorAll(".userAmount")
  let count = document.querySelectorAll(".userState")
  let widthOfBar = document.querySelectorAll(".progress-bar.bg-danger")
  let widthOfBarSubscription = document.querySelectorAll(".widthOfBar")
  for ( let i = 0 ; i < count.length ; i++ ) {
    count[i].innerHTML = countState[i]
  }
  for ( let i = 0 ; i < widthOfBar.length ; i++ ) {
    widthOfBar[i].style.width  = countPercentagee[i] + '%'
  }
  for ( let i = 0 ; i < rate.length ; i++ ) {
    rate[i].innerHTML  = subscriptionState[i]
  }
  for ( let i = 0 ; i < widthOfBarSubscription.length ; i++ ) {
    widthOfBarSubscription[i].style.width  = subscriptionPercentagee[i] + '%'
  }
  
 
  // `${countPercentagee[i]}%`
  


  // Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#858796';

// Pie Chart Example
var ctx = document.getElementById("myPieChart");
var myPieChart = new Chart(ctx, {
  type: 'doughnut',
  data: {
    labels: newResponse.state,
    datasets: [{
      data: newResponse.sumOfSubscription,
      backgroundColor: ['#4e73df', '#1cc88a', '#36b9cc'],
      hoverBackgroundColor: ['#2e59d9', '#17a673', '#2c9faf'],
      hoverBorderColor: "rgba(234, 236, 244, 1)",
    }],
  },
  options: {
    maintainAspectRatio: false,
    tooltips: {
      backgroundColor: "rgb(255,255,255)",
      bodyFontColor: "#858796",
      borderColor: '#dddfeb',
      borderWidth: 1,
      xPadding: 15,
      yPadding: 15,
      displayColors: false,
      caretPadding: 10,
    },
    legend: {
      display: false
    },
    cutoutPercentage: 80,
  },
});


})()


