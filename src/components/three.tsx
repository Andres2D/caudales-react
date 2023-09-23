import * as React from 'react';
import { caudalesDB, desviacionConstants, MEIConstants, ONIConstant, SOIConstants, PDOConstants, NAOConstants } from '../data/caudales';
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
import { Line } from 'react-chartjs-2';

interface GroupPerMonth {
  month: number;
  value: number;
  year: number;
  date: Date;
}

interface GroupedPerMonth {
  month: number;
  value: number;
  avg: number;
}

interface AveragePerMonth {
  month: number;
  average: number;
  sum: number;
}

export const Three = () => {

  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );

  const optionsThree = {
    responsive: true,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    stacked: false,
    plugins: {
      title: {
        display: true,
        text: 'Series simultaneas de caudales promedios estandarizados y los índices de la ENSO',
      },
    },
    scales: {
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  const orderedFullDates = caudalesDB.map(a => new Date(a.date)).sort((a,b) => {
    if(a.getDate() > b.getDate()) {
      return -1;
    }else if(a.getDate() < b.getDate()) {
      return 1;
    }
    return 1;
  });

  const labels = orderedFullDates.map(a => a.toISOString().slice(0, 10));

  const monthsList = new Set(
    caudalesDB.map((month) => new Date(month.date).getMonth() + 1)
  );

  const avgPerMonth: AveragePerMonth[] = [];

  monthsList.forEach(month => {
    const caudalesPerMonth = caudalesDB.filter(a => new Date(a.date).getMonth() + 1 === month);
    const caudalesValues = caudalesPerMonth.map(a => a.caudal);
    avgPerMonth.push({
      month,
      average: caudalesValues.reduce((a,b) => a+b) / caudalesValues.length,
      sum: caudalesValues.reduce((a,b) => a+b)
    }) 
  });

  let groupPerMonth: GroupPerMonth[] = []; 

  caudalesDB.forEach(caudal => {
    const month = new Date(caudal.date).getMonth() + 1;
    const year = new Date(caudal.date).getFullYear();
    // console.log(year, month);
    const restaCaudales = (caudal.caudal - avgPerMonth.filter( a => a.month === month)[0].average) / desviacionConstants[month - 1];
    groupPerMonth.push({
      month,
      value: restaCaudales,
      year,
      date: new Date(caudal.date)
    })
  });
  
  groupPerMonth = groupPerMonth.sort((a,b) => {
    if(a.date.getDate() > b.date.getDate()) {
      return -1;
    }else if(a.date.getDate() < b.date.getDate()) {
      return 1;
    }else{
      return 1;
    }
  })

  let groupedPerMonth: GroupedPerMonth[] = [];

  monthsList.forEach(month => {
    const filteredMonth = groupPerMonth.filter(a => a.month === month).map(b => b.value);
    const sumMonth = filteredMonth.reduce((a,b) => a + b);
    const monthsList = caudalesDB.map(a => new Date(a.date));
    const numMonths = monthsList.filter(a => a.getMonth() + 1 === month).length;
    groupedPerMonth.push({
      month,
      value: sumMonth,
      avg: sumMonth/numMonths
    });
  });


  groupedPerMonth = groupedPerMonth.sort((a,b) => {
    if(a.month > b.month) {
      return 1
    } else if(a.month < b.month) {
      return -1
    } else {
      return -1
    }
  });

  const data = {
    labels,
    datasets: [
      {
        label: 'Q Medido estandarizado',
        data: groupPerMonth.map(a => a.value),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        yAxisID: 'y',
      },
      {
        label: 'ONI',
        data: ONIConstant,
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        yAxisID: 'y1',
      },
      {
        label: 'MEI',
        data: MEIConstants,
        borderColor: 'rgb(66,215,96)',
        backgroundColor: 'rgba(66,215,96,0.5)',
        yAxisID: 'y2',
      },
      {
        label: 'SOI',
        data: SOIConstants,
        borderColor: 'rgb(51,51,51)',
        backgroundColor: 'rgba(51,51,51,0.5)',
        yAxisID: 'y3',
      },
    ],
  };

  const dataTwo = {
    labels,
    datasets: [
      {
        label: 'Q Medido estandarizado',
        data: groupPerMonth.map(a => a.value),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        yAxisID: 'y',
      },
      {
        label: 'PDO',
        data: PDOConstants,
        borderColor: 'rgb(51,51,51)',
        backgroundColor: 'rgba(51,51,51, 0.5)',
        yAxisID: 'y',
      },
      {
        label: 'NAO',
        data: NAOConstants,
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        yAxisID: 'y1',
      },
    ],
  };

  return (
    <>
      <Line options={optionsThree} data={data} />
      <Line options={optionsThree} data={dataTwo} />
    </>
  )
};

export default Three;
