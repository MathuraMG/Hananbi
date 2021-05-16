const BOARD = {
  width:window.screen.availWidth,
  height: window.innerHeight,
  padding: window.innerHeight*.05, 
  xStack : window.screen.availWidth*0.5,
  numbers : [1,1,1,2,2,3,3,4,4,5]
}
const CARDSIZE = {
  x:window.innerHeight*.11, 
  y:window.innerHeight*.16,
  radius: window.innerHeight*.01,
  fontSize: window.innerHeight*.09,
  padding: window.innerHeight*.015
};
const CLUESIZE = {
  x:window.innerHeight*.11, 
  y:window.innerHeight*.16,
  radius: window.innerHeight*.01,
  fontSize: window.innerHeight*.025,
  padding: window.innerHeight*.015
}
const CLUETOKEN = {
  dia: CARDSIZE.x/2,
}
const STRIKE = {
  width: CARDSIZE.x*2/3,
}
const DISCARDPILE = {
  fontSize: window.innerHeight*.045,
}
const GROUPS = ["red", "yellow", "blue", "green", "purple"];
const COLORS = {
  white : "#ffffff",
  shadow: "#00000066",
  darkblue: "#0f3b60",
  red: "#CD5C5C"
}
const CARDCOLORS = {
  red: "#CD5C5C",
  yellow: "#FFE266",
  blue: "#6EB6BA",
  green: "#3CB371",
  purple: "#9F82F9",
  grey: "#94979B"
}
const CLUECOLORS = {
  red: "#8E3636",
  yellow: "#E8C42D",
  blue: "#259991",
  green: "#1B753F",
  purple: "#7760D8",
  grey: "#AAAAAA"
}
const BACKGROUND = "#62666B";

