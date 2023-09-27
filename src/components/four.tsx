/* eslint-disable @typescript-eslint/no-explicit-any */
import styles from './four.module.scss';
import * as React from 'react';
import { ONIConstant, ONIPerMonth, soiValues, GeneralMap, MEIValues, NAOValues, PDOValues, caudalesValues, ONIValues, caudalesDB } from '../data/caudales';
import { Bar } from 'react-chartjs-2';

interface Intervals {
  first: number;
  second: number;
}
interface CalcResult {
  year: number;
  firstTrimester: number;
  secondTrimester: number;
  thirdTrimester: number;
  fourthTrimester: number;
}

const Four = () => {

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

  const boy: number[] = [];
  const girl: number[] = [];
  const neutral: number[] = [];

  const years = [
    1980,
    1981,
    1982,
    1983,
    1984,
    1985,
    1986,
    1987,
    1988,
    1989,
    1990,
    1991,
    1992,
    1993,
    1994,
    1995,
    1996,
    1997,
    1998,
    1999,
    2000,
    2001,
    2002,
    2003,
    2004,
    2005,
    2006,
    2007,
    2008,
    2009,
    2010
];


  ONIPerMonth.forEach((val, index) => {

    const boy: number[] = [];
    const girl: number[] = [];
    const neutral: number[] = [];

    val.oni.forEach((oni, idx) => {
      if(val.month < 7) {
        if(oni < -0.5) {
          const caudales = caudalesDB.filter(a => new Date(a.date).getFullYear() === years[idx] && new Date(a.date).getMonth() + 1 === val.month);
          girl.push({oni: oni, year: years[idx], month: val.month, caudal: caudales[0].caudal});
        }else if(oni >= -0.5 && oni < 0.5) {
          const caudales = caudalesDB.filter(a => new Date(a.date).getFullYear() === years[idx] && new Date(a.date).getMonth() + 1 === val.month);
          neutral.push({oni: oni, year: years[idx], month: val.month, caudal: caudales[0].caudal });
        }else if(oni >= 0.5){
          const caudales = caudalesDB.filter(a => new Date(a.date).getFullYear() === years[idx] && new Date(a.date).getMonth() + 1 === val.month);
          boy.push({oni: oni, year: years[idx], month: val.month, caudal: caudales[0].caudal });
        }else {
          console.log('WTF: ', oni);
        }
      }else {
        if(oni <= -0.5) {
          const caudales = caudalesDB.filter(a => new Date(a.date).getFullYear() === years[idx] && new Date(a.date).getMonth() + 1 === val.month);
          girl.push({oni: oni, year: years[idx], month: val.month, caudal: caudales[0].caudal });
        }else if(oni > -0.5 && oni < 0.5) {
          const caudales = caudalesDB.filter(a => new Date(a.date).getFullYear() === years[idx] && new Date(a.date).getMonth() + 1 === val.month);
          neutral.push({oni: oni, year: years[idx], month: val.month, caudal: caudales[0].caudal });
        }else if(oni >= 0.5){
          const caudales = caudalesDB.filter(a => new Date(a.date).getFullYear() === years[idx] && new Date(a.date).getMonth() + 1 === val.month);
          boy.push({oni: oni, year: years[idx], month: val.month, caudal: caudales[0].caudal });
        }else {
          console.log('WTF: ', oni);
        }
      }
    });

    ONIPerMonth[index].boy = boy;
    ONIPerMonth[index].girl = girl;
    ONIPerMonth[index].neutral = neutral;
  });

  const mappedData = ONIPerMonth.map(a => {
    return {
      month: a.month,
      boy: a.boy.map(b => b.caudal).join(','),
      girl: a.girl.map(c => c.caudal).join(','),
      neutral: a.neutral.map(d => d.caudal).join(',')
    }
  });

  mappedData.forEach(a => console.table(a));

  const boyDetailed: any[] = [];
  const girlDetailed: any[] = [];
  const neutralDetailed: any[] = [];
  
  const boyDetailedTwo: any[] = [];
  const girlDetailedTwo: any[] = [];
  const neutralDetailedTwo: any[] = [];

  ONIValues.forEach((val) => {
    val.values.forEach((oni, idx) => {
      if(idx < 6) {
        if(oni < -0.5) {
          const caudal = caudalesDB.filter(a => new Date(a.date).getMonth() === idx && new Date(a.date).getFullYear() === val.year);
          if(caudal[0]?.caudal) {
            girlDetailed.push(caudal[0].caudal);
            girlDetailedTwo.push({
              caudal: caudal[0].caudal,
              month: idx + 1
            });
          }else {
            console.log('Falta: ', val.year, idx)
          }
        }else if(oni >= -0.5 && oni < 0.5) {
          const caudal = caudalesDB.filter(a => new Date(a.date).getMonth() === idx && new Date(a.date).getFullYear() === val.year);
          if(caudal[0]?.caudal) {
            neutralDetailed.push(caudal[0].caudal);
            neutralDetailedTwo.push({
              caudal: caudal[0].caudal,
              month: idx + 1
            });
          }else {
            console.log('Falta: ', val.year, idx)
          }
        }else if(oni > 0.5){
          const caudal = caudalesDB.filter(a => new Date(a.date).getMonth() === idx && new Date(a.date).getFullYear() === val.year);
          if(caudal[0]?.caudal) {
            boyDetailed.push(caudal[0].caudal);
            boyDetailedTwo.push({
              caudal: caudal[0].caudal,
              month: idx + 1
            });
          }else {
            console.log('Falta: ', val.year, idx)
          }
        }else {
          console.log('WTF: ', oni);
        }
      }else {
        if(oni <= -0.5) {
          const caudal = caudalesDB.filter(a => new Date(a.date).getMonth() === idx && new Date(a.date).getFullYear() === val.year);
          if(caudal[0]?.caudal) {
            girlDetailed.push(caudal[0].caudal);
            girlDetailedTwo.push({
              caudal: caudal[0].caudal,
              month: idx + 1
            });
          }else {
            console.log('Falta: ', val.year, idx)
          }
        }else if(oni > -0.5 && oni < 0.5) {
          const caudal = caudalesDB.filter(a => new Date(a.date).getMonth() === idx && new Date(a.date).getFullYear() === val.year);
          if(caudal[0]?.caudal) {
            neutralDetailed.push(caudal[0].caudal);
            neutralDetailedTwo.push({
              caudal: caudal[0].caudal,
              month: idx + 1
            });
          }else {
            console.log('Falta: ', val.year, idx)
          }
        }else if(oni >= 0.5){
          const caudal = caudalesDB.filter(a => new Date(a.date).getMonth() === idx && new Date(a.date).getFullYear() === val.year);
          if(caudal[0]?.caudal) {
            boyDetailed.push(caudal[0].caudal);
            boyDetailedTwo.push({
              caudal: caudal[0].caudal,
              month: idx + 1
            });
          }else {
            console.log('Falta: ', val.year, idx)
          }
        }else {
          console.log('WTF: ', oni);
        }
      }
    });
  });

  const monthsList = [1,2,3,4,5,6,7,8,9,10,11,12];

  const genderFilter: any[] = [];

  monthsList.forEach(month => {
    const monthFilter = neutralDetailedTwo.filter(b => b.month === month);
    genderFilter.push({
      month,
      caudales: monthFilter.map(a => a.caudal).toString()
    })
  });

  const intervals = 0.07226;
  const intervalsList: Intervals[] = []

  Array.from({length: 30}).forEach((_, i) => {
    intervalsList.push(
      {
        first: intervals * (i + 1),
        second: (intervals * (i + 1)) + intervals
      }
    )
  });

  const calValues = (values: GeneralMap[]) => {
    const calResults: CalcResult[] = [];

    values.forEach((val, index) => {
      if(index === 0) {
        return;
      }
      const first: number[] = [values[index -1 ].values[11], val.values[0], val.values[1]];
      const second: number[] = [val.values[2], val.values[3], val.values[4]];
      const third: number[] = [val.values[5], val.values[6], val.values[7]];
      const fourth: number[] = [val.values[8], val.values[9], val.values[10]];

      calResults.push({
        year: val.year,
        firstTrimester: Number((first.reduce((a,b) => a+b) / 3).toFixed(2)),
        secondTrimester: Number((second.reduce((a,b) => a+b) / 3).toFixed(2)),
        thirdTrimester: Number((third.reduce((a,b) => a+b) / 3).toFixed(2)),
        fourthTrimester: Number((fourth.reduce((a,b) => a+b) / 3).toFixed(2))
      })
    })
    return calResults;
  }

  const totalAbsolute: number[] = [];
  const classMarks: number[] = [];
  const caudales: number[] = [];

  const intervalsMap = intervalsList.map((interval) => {
    let absoluteFrequencyCounter = 0;

    neutralDetailed.forEach(caudal => {
      if(caudal >= interval.first && caudal < interval.second ) {
        caudales.push(caudal);
        absoluteFrequencyCounter += 1;
      }
    });

    totalAbsolute.push(absoluteFrequencyCounter);
    const classMark = ((interval.first + interval.second) / 2).toFixed(3);
    classMarks.push(Number(classMark));

    return (
      <tr key={`interval-${interval.first}-${interval.second}`}>
        <td>[{interval.first}, {interval.second}]</td>
        <td>{classMark}</td>
        <td>{absoluteFrequencyCounter}</td>
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

  return (
    <>
      <table className={styles.table}>
        <tr>
          <th>Intervalos</th>
          <th>Marca de clase xi</th>
          <th>Frecuencia absoluta</th>
        </tr>
        { intervalsMap }
      </table>
      <div className={styles.graph}>
        <Bar options={options} data={dataFirst} />
      </div>
    </>    
  );
};

export default Four;
