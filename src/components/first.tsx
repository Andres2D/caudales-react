import * as React from 'react';
import { caudalesDB } from '../data/caudales';
import styles from './first.module.scss';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

interface AveragePerYear {
  year: number;
  average: number;
}

interface Intervals {
  first: number;
  second: number;
}

const First = () => {

  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
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
        text: 'Chart.js Bar Chart',
      },
    },
  };
  

  const yearsList = new Set(
    caudalesDB.map((year) => new Date(year.date).getFullYear())
  );
  const averagePerYear: AveragePerYear[] = [];

  yearsList.forEach((year) => {
    const caudalesPerYear = caudalesDB.filter((a) =>
      a.date.includes(String(year))
    );
    const caudalesValues = caudalesPerYear.map((caudal) => caudal.caudal);
    averagePerYear.push({
      year,
      average: caudalesValues.reduce((a, b) => a + b) / caudalesValues.length,
    });
  });

  // const maxCaudalValue = Math.max(...caudalesDB.map((caudal) => caudal.caudal));

  const intervals = 0.13753;
  const intervalsList: Intervals[] = []

  Array.from({length: 30}).forEach((_, i) => {
    intervalsList.push(
      { 
        first: intervals * (i + 1),
        second: (intervals * (i + 1)) + intervals 
      }
    )
  });

  const totalAbsolute: number[] = [];
  const classMarks: number[] = [];

  const intervalsMap = intervalsList.map(interval => {
    let absoluteFrequencyCounter = 0;
    const caudals = caudalesDB.map(caudal => caudal.caudal);


    caudals.forEach(caudal => {
      if(caudal >= interval.first && caudal < interval.second ) {
        absoluteFrequencyCounter += 1;
      }
    });

    totalAbsolute.push(absoluteFrequencyCounter);
    const classMark = ((interval.first + interval.second) / 2).toFixed(3);
    classMarks.push(Number(classMark));
    return (
      <tr>
        <td>[{interval.first}, {interval.second}]</td>
        <td>{classMark}</td>
        <td>{absoluteFrequencyCounter}</td>
      </tr>
    )
  });

  console.log(totalAbsolute);

  const data = {
    labels: classMarks.map(a => String(a)),
    datasets: [
      {
        label: 'Histograma de frecuencias',
        data: totalAbsolute,
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      }
    ],
  };

  return (
    <>
      <table className={styles.table}>
        <tr>
          <th>Intervalos</th>
          <th>Marca de clase xi</th>
          <th>Frecuencia absoluta fi</th>
        </tr>
        { intervalsMap }
      </table>
      <Bar options={options} data={data} />
    </>
  );
};

export default First;
