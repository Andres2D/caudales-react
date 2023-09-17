import * as React from 'react';
import { ONIConstant, ONIPerMonth, soiValues, GeneralMap, MEIValues, NAOValues, PDOValues, caudalesValues } from '../data/caudales';

interface CalcResult {
  year: number;
  firstTrimester: number;
  secondTrimester: number;
  thirdTrimester: number;
  fourthTrimester: number;
}

const Four = () => {

  const boy: number[] = [];
  const girl: number[] = [];
  const neutral: number[] = [];

  ONIPerMonth.forEach((val, index) => {

    const boy: number[] = [];
    const girl: number[] = [];
    const neutral: number[] = [];

    val.oni.forEach(oni => {
      if(oni <= -0.5) {
        girl.push(oni);
      }else if(oni > -0.5 && oni <= 0.5) {
        neutral.push(oni);
      }else if(oni > 0.5){
        boy.push(oni)
      }else {
        console.log('WTF: ', oni);
      }
    });

    ONIPerMonth[index].boy = boy;
    ONIPerMonth[index].girl = girl;
    ONIPerMonth[index].neutral = neutral;
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
        firstTrimester: first.reduce((a,b) => a+b) / 3,
        secondTrimester: second.reduce((a,b) => a+b) / 3,
        thirdTrimester: third.reduce((a,b) => a+b) / 3,
        fourthTrimester: fourth.reduce((a,b) => a+b) / 3
      })
    })
    return calResults;
  }

  console.table(calValues(caudalesValues));

  return (
    <p>Test</p>
  );
};

export default Four;
