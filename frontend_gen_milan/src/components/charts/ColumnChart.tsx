import Chart from "react-apexcharts";

const ColumnChart = ({ total_transporters , total_drivers } : {
  total_transporters :any , total_drivers :any
}) => {
  
  function sumAll(numbers: number[]): number {
    let sum = 0;
    if(numbers != null){
      numbers.map(num => sum += num);
    }
    return sum;
  }

  
  const data = {
    series: [
      {
        name: "Total Transporters",
        data: total_transporters, // Example data for online sales
      },
      {
        name: "Total Drivers",
        data: total_drivers, // Example data for offline sales
      },
    ],
    options: {
      chart: {
        type: "bar",
        height: 300,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "50%",
          endingShape: "rounded",
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"],
      },
      xaxis: {
        categories: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        labels: {
          rotate: 0, // Rotate labels to 0 degrees for horizontal alignment
        },
      },
      fill: {
        opacity: 1,
      },
      grid: {
        show: false,
      },
      tooltip: {
        y: {
          formatter: function (val : any) {
            return val;
          },
        },
      },
      colors: ["#4CAF50", "#2196F3"], // Colors for online and offline sales
    },
  };

  return (
    <div className="p-4 rounded-lg md:w-[550px] w-full">
      <h2 className="mb-4 text-lg font-bold text-gray-700">
        Total Transporters{" "}
        <span className="text-green-400"> ( {sumAll(total_transporters)} )</span>/ Total
        Drivers <span className="text-green-400"> ( {sumAll(total_drivers)} )</span>
      </h2>
      <Chart
      // @ts-ignore
        options={data.options}
        series={data.series}
        type="bar"
        height={250}
      />
    </div>
  );
};

export default ColumnChart;
