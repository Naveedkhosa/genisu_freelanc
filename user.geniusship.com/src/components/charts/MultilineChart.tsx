import Chart from 'react-apexcharts';

const CustomerInsightsChart = () => {
  const data = {
    series: [
      {
        name: 'Loyal Customers',
        data: [200, 250, 200, 250, 200, 150, 200, 250, 300, 350, 300, 250],
      },
      {
        name: 'New Customers',
        data: [150, 210, 150, 200, 150, 100, 150, 200, 250, 300, 250, 200],
      },
      {
        name: 'Unique Customers',
        data: [180, 200, 160, 200, 160, 120, 160, 200, 240, 280, 240, 200],
      },
    ],
    options: {
      chart: {
        height: 250,
        type: 'line',
        toolbar: {
          show: false,
        },
      },
      colors: ['#4CAF50', '#2196F3', '#FFC107'], // Green, Blue, and Yellow for each line
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'smooth',
        width: 4, // Thicker lines
      },
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        labels: {
          style: {
            colors: '#9aa0ac',
            fontSize: '12px',
          },
        },
      },
      yaxis: {
        min: 0,
        max: 500,
        tickAmount: 5,
        labels: {
          formatter: function (val : any) {
            return val.toFixed(0);
          },
        },
        title: {
          text: undefined, // Remove the title
        },
      },
      tooltip: {
        shared: true,
        intersect: false,
      },
      legend: {
        position: 'bottom', // Move legend to the bottom
        horizontalAlign: 'center', // Center the legend horizontally
      },
      grid: {
        // borderColor: '#e7e7e7',
        // row: {
        //   colors: ['#f3f3f3', 'transparent'],
        //   opacity: 0.5,
        // },
        show:false
      },
    },
  };

  return (
    <div className="p-4 w-full md:w-[550px]">
      <h2 className="mb-4 text-lg font-bold text-gray-700">Customer Insights <span className='text-green-400'> ( 123 )</span></h2>
      <Chart
      //@ts-ignore
        options={data.options}
        series={data.series}
        type="line"
        height={250}
      />
    </div>
  );
};

export default CustomerInsightsChart;
