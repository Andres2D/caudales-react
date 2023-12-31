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

interface AveragePerMonth {
  month: number;
  average: number;
  sum: number;
}

interface Intervals {
  first: number;
  second: number;
}

// interface YearAvg {
//   month: number;
//   value: number;
// }

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

  const monthsList = new Set(
    caudalesDB.map((month) => new Date(month.date).getMonth() + 1)
  );

  // const avgPerMonth: AveragePerMonth[] = [];

  const monthsFilter = [...monthsList].map(month => {
    const caudalesPerMonth = caudalesDB.filter(a => new Date(a.date).getMonth() + 1 === month).map(a => a.caudal);
    return {
      month,
      caudalesPerMonth: caudalesPerMonth.join(',')
    }
  });

  // console.log(monthsFilter);

  // const discMonths = [...monthsList].map(month => {
  //   const caudales = caudalesDB.filter(a => new Date(a.date).getMonth() + 1 === month);
  //   return {
  //     month,
  //     caudales
  //   }
  // });

  // console.log(discMonths.forEach( a => console.table(a.caudales)));

  // const standardPerYear: YearAvg[] = [];

  // avgPerMonth.forEach((context) => {
  //   const value = (context.sum - context.average) / desviacionConstants[context.month - 1];
  //   standardPerYear.push({
  //     month: context.month,
  //     value
  //   });
  // });

  // console.log(avgPerMonth);
  // console.log(standardPerYear);

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

  const maxCaudalValue = Math.max(...caudalesDB.map((caudal) => caudal.caudal));
  const minCaudalValue = Math.min(...caudalesDB.map((caudal) => caudal.caudal));

  // console.log('MAX: ', maxCaudalValue);
  // console.log('MIN: ', minCaudalValue);

  const caudalesList = caudalesDB.map(a => a.caudal);
  const caudalesAverage = caudalesList.reduce((a,b) => a+b) / caudalesList.length;
  // const sumCaudales = caudalesList.reduce((a,b) => (a + b - caudalesAverage));

  // console.log('Sum: ', sumCaudales);

  // const deviacionEstandar = Math.sqrt()
  // console.log('Media: ', caudalesAverage);
  // console.log('Desviación estandar: ', 0.53131);
  // console.log('Coeficiente de courtosis', 3.75);
  // console.log('Coeficiente de fisher', 1.42);
  // console.log(caudalesDB.map(a => a.caudal).join(', '))

  const intervals = 0.1297;
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
  const accumulatedFrequency: number[] = [];
  const totalAccumulatedFrequencyPercentage: number[] = [];
  const accumulatedFrequencyPercentageList: number[] = [];

  const intervalsMap = intervalsList.map((interval, index) => {
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

    accumulatedFrequency.push(totalAbsolute.reduce((a,b) => a+b));
    const absoluteFrequencyPercentage = (absoluteFrequencyCounter / 372) * 100;
    totalAccumulatedFrequencyPercentage.push(absoluteFrequencyPercentage);
    const accumulatedFrequencyPercentage = totalAccumulatedFrequencyPercentage.reduce((a,b) => a+b);
    accumulatedFrequencyPercentageList.push(accumulatedFrequencyPercentage);

    return (
      <tr key={`interval-${interval.first}-${interval.second}`}>
        <td>[{interval.first}, {interval.second}]</td>
        <td>{classMark}</td>
        <td>{absoluteFrequencyCounter}</td>
        <td>{accumulatedFrequency[index]}</td>
        <td>{absoluteFrequencyPercentage}%</td>
        <td>{accumulatedFrequencyPercentage}%</td>
      </tr>
    )
  });


  const dataFirst = {
    labels: classMarks.map(a => String(a)),
    datasets: [
      {
        label: 'Histograma de frecuencias',
        data: totalAbsolute,
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      }
    ],
  };


  const dataSecond = {
    labels: classMarks.map(a => String(a)),
    datasets: [
      {
        label: 'Función de distribución de probabilidad acumulada',
        data: accumulatedFrequencyPercentageList,
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      }
    ],
  };

  // const monthsToCalculate = [0,1,2,3,4,5,6,7,8];

  // const filterMonths = monthsToCalculate.map(month => {
  //   const caudalesMonths = caudalesDB.map(a => { return { month: new Date(a.date).getMonth(), value: a.caudal}});
  //   const sumMonths = caudalesMonths.filter(a => a.month === month);
  //   const avgMonths = sumMonths.map(a => a.value).reduce((a,b) => a+b) / sumMonths.length;
  //   return {
  //     date: `${month+1}/1/1980 00:00`,
  //     caudal: avgMonths
  //   }
  // });

  // console.log(filterMonths);

  // const dbComplete = caudalesDB.map(a => a.caudal).join(', ');
  // console.log(dbComplete);

  return (
    <>
      <table className={styles.table}>
        <tr>
          <th>Intervalos</th>
          <th>Marca de clase xi</th>
          <th>Frecuencia absoluta fi</th>
          <th>Frecuencia acumulada</th>
          <th>Porcentaje frecuencia absoluta</th>
          <th>Porcentaje frecuencia acumulada</th>
        </tr>
        { intervalsMap }
      </table>
      <Bar options={options} data={dataFirst} />
      <hr />
      <Bar options={options} data={dataSecond} />
      <hr />
      <table className={styles.table}>
        <tr>
          <th>Media estadística</th>
          <th>Desviación estándar</th>
          <th>Coeficiente de asimetría de Fisher</th>
          <th>Coeficiente de curtosis</th>
        </tr>
        <tr>
          <td>{caudalesAverage.toFixed(3)}</td>
          <td>0.531</td>
          <td>1.42</td>
          <td>3.75</td>
        </tr>
      </table>
    </>
  );
};

export default First;
