import React, { useState, Fragment } from 'react';
import { Helmet } from 'react-helmet';
import * as mapboxPolyline from '@mapbox/polyline';
import MapboxLanguage from '@mapbox/mapbox-gl-language';
import ReactMapGL, { Source, Layer } from 'react-map-gl';
import { ViewportProvider, useDimensions } from 'react-viewport-utils';

import Layout from '../components/layout';
import { activities } from '../static/activities';
import { chinaGeojson } from '../static/run_countries';

import 'mapbox-gl/dist/mapbox-gl.css';
import styles from './running.module.scss';

const MAPBOX_TOKEN = 'pk.eyJ1IjoieWlob25nMDYxOCIsImEiOiJja2J3M28xbG4wYzl0MzJxZm0ya2Fua2p2In0.PNKfkeQwYuyGOTT_x9BJ4Q';

// const
const municipalityCitiesArr = ['北京市', '上海市', '天津市', '重庆市', '香港特别行政区', '澳门特别行政区'];
const shenyangYearsArr = ['2012', '2013', '2014'];
const DALIAN_STRAT_POINT = [38.862, 121.514];
const SHENYANG_START_POINT = [41.78655, 123.31449];
const cities = {};
let provinces = [];
let countries = [];
let yearsArr = [];

const locationForRun = (run) => {
  const location = run.location_country;
  let [city, province, country] = ['', '', ''];
  if (location) {
    const cityMatch = location.match(/[\u4e00-\u9fa5]*市/);
    const provinceMatch = location.match(/[\u4e00-\u9fa5]*省/);
    if (cityMatch) {
      [city] = cityMatch;
    }
    if (provinceMatch) {
      [province] = provinceMatch;
    }
    const l = location.split(',');
    const countryMatch = l[l.length - 1].match(/[\u4e00-\u9fa5].*[\u4e00-\u9fa5]/);
    if (countryMatch) {
      [country] = countryMatch;
    }
  }
  if (municipalityCitiesArr.includes(city)) {
    province = city;
  }

  return { country, province, city };
};

// generate base attr
((runs) => {
  const locationsList = [];
  runs.forEach(
    (run) => {
      const location = locationForRun(run);
      locationsList.push(location);
      const { city, province, country } = location;
      // drop only one char city
      if (city.length > 1) {
        cities[city] = (cities[city] === undefined ? run.distance : cities[city] + run.distance);
      }
      if (province) {
        provinces.push(province);
      }
      if (country) {
        countries.push(country);
      }
      const y = run.start_date_local.slice(0, 4);
      yearsArr.push(y);
    },
  );
  yearsArr = [...new Set(yearsArr)].sort().reverse();
  provinces = [...new Set(provinces)];
  countries = [...new Set(countries)];
})(activities);

// Page
export default () => {
  const [year, setYear] = useState('2020');
  let onStartPoint = shenyangYearsArr.includes(year)
    ? SHENYANG_START_POINT
    : DALIAN_STRAT_POINT;
  const [runs, setActivity] = useState(activities);
  const [title, setTitle] = useState('');
  const [viewport, setViewport] = useState({
    width: '100%',
    height: 400,
    latitude: onStartPoint[0],
    longitude: onStartPoint[1],
    zoom: 11.5,
  });
  const changeYear = (year) => {
    setYear(year);
    onStartPoint = shenyangYearsArr.includes(year)
      ? SHENYANG_START_POINT
      : DALIAN_STRAT_POINT;
    scrollToMap();
    setActivity(activities);
    if (viewport.zoom > 3) {
      setViewport({
        width: '100%',
        height: 400,
        latitude: onStartPoint[0],
        longitude: onStartPoint[1],
        zoom: 11.5,
      });
    }
    setTitle(`${year} Running Heatmap`);
  };

  const locateActivity = (run) => {
    // TODO maybe filter some activities in the future
    setActivity([run]);
    let startPoint;
    const geoData = geoJsonForRuns([run], run.start_date_local.slice(0, 4));
    const { coordinates } = geoData.features[0].geometry;
    if (coordinates.length === 0) {
      startPoint = DALIAN_STRAT_POINT.reverse();
    } else {
      startPoint = coordinates[Math.floor(coordinates.length / 2)];
    }
    setViewport({
      width: '100%',
      height: 400,
      latitude: startPoint[1],
      longitude: startPoint[0],
      zoom: 14.5,
    });
    scrollToMap();
    setTitle(titleForShow(run));
  };

  return (
    <>
      <Helmet bodyAttributes={{ class: styles.body }} />
      <Layout>
        <div className="mb5">
          <div className="w-100">
            <h1 className="f1 fw9 i">Running</h1>
          </div>
          {viewport.zoom <= 3 ? <LocationStat runs={activities} location="a" onClick={changeYear} /> : <YearsStat runs={activities} year={year} onClick={changeYear} />}
          <div className="fl w-100 w-70-l">
            {runs.length === 1 ? (
              <RunMapWithViewport
                runs={runs}
                year={year}
                title={title}
                viewport={viewport}
                setViewport={setViewport}
                changeYear={changeYear}
              />
            ) : (
              <RunMapWithViewport
                runs={activities}
                year={year}
                title={title}
                viewport={viewport}
                setViewport={setViewport}
                changeYear={changeYear}
              />
            )}
            <RunTable
              runs={activities}
              year={year}
              locateActivity={locateActivity}
            />
          </div>
        </div>
      </Layout>
    </>
  );
};

// Child components

const YearsStat = ({ runs, year, onClick }) => {
  // make sure the year click on front
  let yearsArrayUpdate = yearsArr.slice();
  yearsArrayUpdate = yearsArrayUpdate.filter((x) => x !== year);
  yearsArrayUpdate.unshift(year);

  // for short solution need to refactor
  return (
    <div className="fl w-100 w-30-l pb5 pr5-l">
      <section className="pb4" style={{ paddingBottom: '0rem' }}>
        <p>
          我用 App 记录自己跑步8年有余，下面列表展示的是
          {year}
          的数据
          <br />
          现在我用NRC记录自己跑步
          {' '}
          <a className="dark-gray b" href="https://www.nike.com/nrc-app">
            Nike Run Club
          </a>
          {' '}
          希望能激励自己前行，不要停下来。这个展示也是我学习React的第一个项目，
          希望自己有所成长。
          <br />
        </p>
      </section>
      <hr color="red" />
      {yearsArrayUpdate.map((year) => (
        <YearStat key={year} runs={runs} year={year} onClick={onClick} />
      ))}
      <YearStat key="Total" runs={runs} year="Total" onClick={onClick} />
    </div>
  );
};

const LocationStat = ({ runs, location, onClick }) => (
  <div className="fl w-100 w-30-l pb5 pr5-l">
    <section className="pb4" style={{ paddingBottom: '0rem' }}>
      <p>
        我跑过了一些地方，希望随着时间的推移，地图点亮的地方越来越多.
        <br />
        不要停下来，不要停下奔跑的脚步.
        <br />
        <br />
        Yesterday you said tomorrow.
      </p>
    </section>
    <hr color="red" />
    <LocationSummary key="locationsSummary" />
    <CitiesStat />
    <YearStat key="Total" runs={runs} year="Total" onClick={onClick} />
  </div>
);

const YearStat = ({ runs, year, onClick }) => {
  if (yearsArr.includes(year)) {
    runs = runs.filter((run) => run.start_date_local.slice(0, 4) === year);
  }
  let sumDistance = 0;
  let streak = 0;
  let pace = 0;
  let paceNullCount = 0;
  let heartRate = 0;
  let heartRateNullCount = 0;
  runs.forEach((run) => {
    sumDistance += run.distance || 0;
    if (run.average_speed) {
      pace += run.average_speed;
    } else {
      paceNullCount++;
    }
    if (run.average_heartrate) {
      heartRate += run.average_heartrate;
    } else {
      heartRateNullCount++;
    }
    if (run.streak) {
      streak = Math.max(streak, run.streak);
    }
  });
  sumDistance = (sumDistance / 1000.0).toFixed(1);
  const avgPace = formatPace(pace / (runs.length - paceNullCount));
  const hasHeartRate = !(heartRate === 0);
  const avgHeartRate = (heartRate / (runs.length - heartRateNullCount)).toFixed(
    0,
  );
  return (
    <div style={{ cursor: 'pointer' }} onClick={() => onClick(year)}>
      <section>
        <Stat value={year} description=" 跑步旅程" />
        <Stat value={runs.length} description=" Runs" />
        <Stat value={sumDistance} description=" KM" />
        <Stat value={avgPace} description=" Avg Pace" />
        <Stat
          value={`${streak} day`}
          description=" Streak"
          className="mb0 pb0"
        />
        {hasHeartRate && (
          <Stat value={avgHeartRate} description=" Avg Heart Rate" />
        )}
      </section>
      <hr color="red" />
    </div>
  );
};

const LocationSummary = () => (
  <div style={{ cursor: 'pointer' }}>
    <section>
      <Stat value={`${yearsArr.length}`} description=" 年里我跑过" />
      <Stat value={countries.length} description=" 个国家" />
      <Stat value={provinces.length} description=" 个省份" />
      <Stat value={Object.keys(cities).length} description=" 个城市" />
    </section>
    <hr color="red" />
  </div>
);

const CitiesStat = () => {
  const citiesArr = Object.entries(cities);
  citiesArr.sort((a, b) => b[1] - a[1]);
  return (
    <div style={{ cursor: 'pointer' }}>
      <section>
        {citiesArr.map(([city, distance]) => (
          <Stat value={city} description={` ${(distance / 1000).toFixed(0)} KM`} citySize={3} />
        ))}
      </section>
      <hr color="red" />
    </div>
  );
};

const RunMap = ({
  runs, year, title, viewport, setViewport, changeYear,
}) => {
  year = year || '2020';
  let geoData = geoJsonForRuns(runs, year);

  const [lastWidth, setLastWidth] = useState(0);
  const addControlHandler = (event) => {
    const map = event && event.target;
    if (map) {
      map.addControl(
        new MapboxLanguage({
          defaultLanguage: 'zh',
        }),
      );
      map.setLayoutProperty('country-label-lg', 'text-field', [
        'get',
        'name_zh',
      ]);
    }
  };
  const filterProvinces = provinces.slice();
  filterProvinces.unshift('in', 'name');

  const dimensions = useDimensions({
    deferUpdateUntilIdle: true,
    disableScrollUpdates: true,
  });
  if (lastWidth !== dimensions.width) {
    setTimeout(() => {
      setViewport({ width: '100%', ...viewport });
      setLastWidth(dimensions.width);
    }, 0);
  }
  const isBigMap = (viewport.zoom <= 3);
  if (isBigMap) {
    geoData = geoJsonForMap();
  }

  return (
    <ReactMapGL
      {...viewport}
      mapStyle="mapbox://styles/mapbox/dark-v9"
      onViewportChange={setViewport}
      onLoad={addControlHandler}
      mapboxApiAccessToken={MAPBOX_TOKEN}
    >
      <RunMapButtons changeYear={changeYear} />
      <Source id="data" type="geojson" data={geoData}>

        <Layer
          id="runs2"
          type="line"
          paint={{
            'line-color': 'rgb(224,237,94)',
            'line-width': isBigMap ? 1 : 2,
          }}
          layout={{
            'line-join': 'round',
            'line-cap': 'round',
          }}
        />
        <Layer
          id="prvince"
          type="fill"
          paint={{
            'fill-color': '#47b8e0',
          }}
          filter={filterProvinces}
        />
      </Source>
      <span className={styles.runTitle}>{title}</span>
    </ReactMapGL>
  );
};

const RunMapWithViewport = (props) => (
  <ViewportProvider>
    <RunMap {...props} />
  </ViewportProvider>
);

const RunMapButtons = ({ changeYear }) => {
  const [index, setIndex] = useState(0);
  const handleClick = (e, year) => {
    const elementIndex = yearsArr.indexOf(year);
    e.target.style.color = 'rgb(224,237,94)';

    const elements = document.getElementsByClassName(styles.button);
    elements[index].style.color = 'white';
    setIndex(elementIndex);
  };
  return (
    <div>
      <ul className={styles.buttons}>
        {yearsArr.map((year) => (
          <li
            key={`${year}button`}
            style={{ color: year === '2020' ? 'rgb(224,237,94)' : 'white' }}
            year={year}
            onClick={(e) => {
              changeYear(year);
              handleClick(e, year);
            }}
            className={styles.button}
          >
            {year}
          </li>
        ))}
      </ul>
    </div>
  );
};

const RunTable = ({ runs, year, locateActivity }) => {
  const [runIndex, setRunIndex] = useState(-1);
  if (!yearsArr.includes(year)) {
    // When total show 2020
    year = '2020';
  }
  runs = runs.filter((run) => run.start_date_local.slice(0, 4) === year);
  runs = runs.sort((a, b) => new Date(b.start_date_local) - new Date(a.start_date_local));
  return (
    <div className={styles.tableContainer}>
      <table className={styles.runTable} cellSpacing="0" cellPadding="0">
        <thead>
          <tr>
            <th />
            <th>KM</th>
            <th>Pace</th>
            <th>BPM</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {runs.map((run) => (
            <RunRow
              runs={runs}
              run={run}
              key={run.strava_id}
              locateActivity={locateActivity}
              runIndex={runIndex}
              setRunIndex={setRunIndex}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

const RunRow = ({
  runs, run, locateActivity, runIndex, setRunIndex,
}) => {
  const distance = (run.distance / 1000.0).toFixed(1);
  const pace = run.average_speed;

  const paceParts = pace ? formatPace(pace) : null;

  const heartRate = run.average_heartrate;

  // change click color
  const handleClick = (e, runs, run) => {
    const elementIndex = runs.indexOf(run);
    e.target.parentElement.style.color = 'red';

    const elements = document.getElementsByClassName(styles.runRow);
    if (runIndex !== -1) {
      elements[runIndex].style.color = 'rgb(224,237,94)';
    }
    setRunIndex(elementIndex);
  };

  return (
    <tr
      className={styles.runRow}
      key={run.start_date_local}
      onClick={(e) => {
        handleClick(e, runs, run);
        locateActivity(run);
      }}
    >
      <td>{titleForRun(run)}</td>
      <td>{distance}</td>
      {pace && <td>{paceParts}</td>}
      <td>{heartRate && heartRate.toFixed(0)}</td>
      <td className={styles.runDate}>{run.start_date_local}</td>
    </tr>
  );
};

const Stat = ({
  value, description, className, citySize,
}) => (
  <div className={`${className} pb2 w-100`}>
    <span className={`f${citySize || 1} fw9 i`}>{intComma(value)}</span>
    <span className="f3 fw6 i">{description}</span>
  </div>
);

// Utilities
const intComma = (x) => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

const pathForRun = (run) => {
  try {
    const c = mapboxPolyline.decode(run.summary_polyline);
    // reverse lat long for mapbox
    c.forEach((arr) => {
      [arr[0], arr[1]] = [arr[1], arr[0]];
    });
    return c;
  } catch (err) {
    return [];
  }
};

const geoJsonForRuns = (runs, year) => {
  if (runs.length > 1 && yearsArr.includes(year)) {
    runs = runs.filter((run) => run.start_date_local.slice(0, 4) === year);
  }
  return {
    type: 'FeatureCollection',
    features: runs.map((run) => {
      const points = pathForRun(run);
      if (!points) {
        return null;
      }

      return {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: points,
        },
      };
    }),
  };
};

const geoJsonForMap = () => chinaGeojson;

const titleForRun = (run) => {
  if (run.name.slice(0, 7) === 'Running') {
    return 'Run';
  }
  if (run.name) {
    return run.name;
  }
  return 'Run';
};

const titleForShow = (run) => {
  const date = run.start_date_local.slice(0, 11);
  const distance = (run.distance / 1000.0).toFixed(1);
  let name = 'Run';
  if (run.name.slice(0, 7) === 'Running') {
    name = 'run';
  }
  if (run.name) {
    name = run.name;
  }
  return `${name} ${date} ${distance} KM`;
};

const formatPace = (d) => {
  const pace = (1000.0 / 60.0) * (1.0 / d);
  const minutes = Math.floor(pace);
  const seconds = Math.floor((pace - minutes) * 60.0);
  return `${minutes}:${seconds.toFixed(0).toString().padStart(2, '0')}`;
};

// for scroll to the map
const scrollToMap = () => {
  const el = document.querySelector('.fl.w-100.w-70-l');
  const rect = el.getBoundingClientRect();
  window.scroll(rect.left + window.scrollX, rect.top + window.scrollY);
};
