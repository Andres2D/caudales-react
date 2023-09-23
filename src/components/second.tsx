import * as React from 'react';
import { caudalesDB, desviacionConstants } from '../data/caudales';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

interface GroupedPerMonth {
  month: number;
  value: number;
  avg: number;
}

interface GroupPerMonth {
  month: number;
  value: number;
  year: number;
  date: Date;
}

interface AveragePerMonth {
  month: number;
  average: number;
  sum: number;
}

const Second = () => {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Ciclo anual de los caudales promedios mensuales estandarizados',
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Month'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Media de caudales estandarizados'
        },
        min: -1,
        max: 1,
        ticks: {
          // forces step size to be 50 units
          stepSize: 50
        }
      }
    }
  };

  const labels = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ];

  const monthsList = new Set(
    caudalesDB.map((month) => new Date(month.date).getMonth() + 1)
  );

  const avgPerMonth: AveragePerMonth[] = [];

  monthsList.forEach((month) => {
    const caudalesPerMonth = caudalesDB.filter(
      (a) => new Date(a.date).getMonth() + 1 === month
    );
    const caudalesValues = caudalesPerMonth.map((a) => a.caudal);
    avgPerMonth.push({
      month,
      average: caudalesValues.reduce((a, b) => a + b) / caudalesValues.length,
      sum: caudalesValues.reduce((a, b) => a + b),
    });
  });

  const groupPerMonth: GroupPerMonth[] = [];

  caudalesDB.forEach((caudal) => {
    const month = new Date(caudal.date).getMonth() + 1;
    const year = new Date(caudal.date).getFullYear();
    const restaCaudales =
      (caudal.caudal -
        avgPerMonth.filter((a) => a.month === month)[0].average) /
      desviacionConstants[month - 1];
    groupPerMonth.push({
      month,
      value: restaCaudales,
      year,
      date: new Date(caudal.date),
    });
  });

  // console.table(groupPerMonth.map(a => {
  //  return {
  //    valor: Number(a.value.toFixed(2)),
  //    year: a.year,
  //    month: a.month
  //  } 
  // }));

  let groupedPerMonth: GroupedPerMonth[] = [];

  monthsList.forEach((month) => {
    const filteredMonth = groupPerMonth
      .filter((a) => a.month === month)
      .map((b) => b.value);
    const sumMonth = filteredMonth.reduce((a, b) => a + b);
    const monthsList = caudalesDB.map((a) => new Date(a.date));
    const numMonths = monthsList.filter(
      (a) => a.getMonth() + 1 === month
    ).length;
    groupedPerMonth.push({
      month,
      value: sumMonth,
      avg: sumMonth / numMonths,
    });
  });

  // console.log(groupedPerMonth);

  groupedPerMonth = groupedPerMonth.sort((a,b) => {
    if(a.month > b.month) {
      return 1;
    }else if(a.month < b.month) {
      return -1;
    }else {
      return -1;
    }
  });

  const data = {
    labels,
    datasets: [
      {
        label: 'Media de caudales estandarizados',
        data: groupedPerMonth.map(a => a.avg),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };

  return (
    <>
      <hr />
      <Line options={options} data={data} />
    </>
  );
};

export default Second;
