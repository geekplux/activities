// const
const MAPBOX_TOKEN = 'pk.eyJ1IjoieWlob25nMDYxOCIsImEiOiJja2J3M28xbG4wYzl0MzJxZm0ya2Fua2p2In0.PNKfkeQwYuyGOTT_x9BJ4Q';
const MUNICIPALITY_CITIES_ARR = ['北京市', '上海市', '天津市', '重庆市', '香港特别行政区', '澳门特别行政区'];

// IF you outside China please make sure IS_CHINESE = false
const IS_CHINESE = false;
const CHINESE_INFO_MESSAGE = (yearLength, year) => `我用 App 记录自己跑步 ${yearLength} 年了，下面列表展示的是 ${year} 的数据`;
const ENGLISH_INFO_MESSAGE = (yearLength, year) => `Running Journey with ${yearLength} Years, the table shows year ${year} data`;

const INFO_MESSAGE = IS_CHINESE ? CHINESE_INFO_MESSAGE : ENGLISH_INFO_MESSAGE;
const FULL_MARATHON_RUN_TITLE = IS_CHINESE ? '全程马拉松' : 'Full Marathon';
const HALF_MARATHON_RUN_TITLE = IS_CHINESE ? '半程马拉松' : 'Half Marathon';
const MORNING_RUN_TITLE = IS_CHINESE ? '清晨跑步' : 'Morning Run';
const LUNCH_RUN_TITLE = IS_CHINESE ? '上午跑步' : 'Lunch Run';
const AFTERNOON_RUN_TITLE = IS_CHINESE ? '午后跑步' : 'Afternoon Run';
const EVENING_RUN_TITLE = IS_CHINESE ? '傍晚跑步' : 'Evening Run';
const NIGHT_RUN_TITLE = IS_CHINESE ? '夜晚跑步' : 'Night Run';

const RUN_TITLES = {
  FULL_MARATHON_RUN_TITLE, HALF_MARATHON_RUN_TITLE, MORNING_RUN_TITLE, LUNCH_RUN_TITLE, AFTERNOON_RUN_TITLE, EVENING_RUN_TITLE, NIGHT_RUN_TITLE,
};

export {
  MAPBOX_TOKEN, MUNICIPALITY_CITIES_ARR, IS_CHINESE, INFO_MESSAGE, RUN_TITLES,
};
