let data;
let sex;
let year;
let age;
let people;
let numAgeGroups = 0; // how many different age groups there are
var marginTop = 100;
var marginLeft = 150;
var marginRight = 20;
var marginBottom = 20;
var graphWidth = 1200;
var graphHeight = 650;
const gapSize = 10;
const canvasSize = { x: 1500, y: 900 };
const yScaling = 1000000;

function preload() {
  data = loadTable("census2000.csv", "csv", "header");
}

function setup() {
  sex = data.getColumn("Sex");
  year = data.getColumn("Year");
  age = data.getColumn("Age");
  people = data.getColumn("People");
  numAgeGroups = new Set(age).size;
  createCanvas(canvasSize.x, canvasSize.y);

  function getBarSize(graphW, gapW, barNum) {
    let barSize = graphW / barNum;
    barSize = barSize - gapW;
    return barSize;
  }

  function drawXAxis() {
    line(
      marginLeft,
      marginTop + graphHeight,
      marginLeft + graphWidth,
      marginTop + graphHeight
    );

    // make ticks on X axis
    const barWidth = getBarSize(graphWidth, gapSize, numAgeGroups);
    const tickSeperation = gapSize + barWidth; // half bar + gapSize + half bar between every tick

    let lastTickX = marginLeft - tickSeperation / 2; // init X location for tick drawing
    for (let i = 0; i < numAgeGroups; i++) {
      const currentX = lastTickX + tickSeperation;
      line(
        currentX,
        marginTop + graphHeight - 10,
        currentX,
        marginTop + graphHeight + 10
      );

      text(5 * i, currentX, marginTop + graphHeight + 40);
      lastTickX = currentX;
    }

    text(
      "Age Group (Years of Age)",
      marginLeft + graphWidth / 2,
      marginTop + graphHeight + 100
    );
  }

  function drawYAxis() {
    line(marginLeft, marginTop + graphHeight, marginLeft, marginTop);
    // make ticks on Y axis
    const largestNumPeople = max(people);
    const numTicks = largestNumPeople / yScaling;
    console.log(numTicks);
    const tickSeperation = graphHeight / numTicks;

    let lastTickY = marginTop + graphHeight + tickSeperation; // init Y location for tick drawing

    for (let i = 0; i < numTicks; i++) {
      const currentY = lastTickY - tickSeperation;
      line(marginLeft - 10, currentY, marginLeft + 10, currentY);

      text(
        (largestNumPeople / numTicks / yScaling) * i,
        marginLeft - 40,
        currentY
      ); // add text to each tick
      lastTickY = currentY;
    }
    push();
    rotate(radians(270));
    textAlign(CENTER);
    text(
      "Population (in millions)",
      -((graphHeight + marginTop) / 2),
      marginLeft - 90
    );
    pop(); // reset drawing state
  }

  //place title
  background(245);
  fill(0);
  textSize(20);
  textAlign(CENTER);
  text(
    "U.S. Mens Population By Age Group In 1900 vs 2000",
    canvasSize.x / 2,
    marginTop / 2
  );

  //draw axes
  drawXAxis();
  drawYAxis();

  // only get indices for men's population
  const mensIndeces = [];
  sex.forEach((currentSex, i) => {
    if (currentSex === "1") {
      mensIndeces.push(i);
    }
  });

  // setup style for bars
  const color1900 = color(0, 100, 100);
  const color2000 = color(0, 150, 30, 100);
  noStroke();
  push();
  const barSize = getBarSize(graphWidth, gapSize, numAgeGroups);
  const rectY = marginTop + graphHeight;
  const initialX = marginLeft + gapSize / 2;
  const largestNumPeople = max(people);

  for (i of mensIndeces) {
    const currentPopulation = people[i];
    const currentYear = year[i];
    const currentAge = age[i];
    const currentX = initialX + (barSize + gapSize) * (currentAge / 5); // space out bars evenly depening on age group
    const currentHeight = graphHeight * (currentPopulation / largestNumPeople);

    const c = currentYear === "2000" ? color2000 : color1900;
    console.log(c);
    fill(c);
    rect(currentX, rectY, barSize, -currentHeight);
  }
  stroke(130);
  fill(255);
  rect(graphWidth - 200, marginTop, 360, 100);
  textAlign(LEFT);

  noStroke();
  fill(color1900);
  rect(graphWidth - 180, marginTop + 10, 30, 30);

  fill(color2000);
  rect(graphWidth - 180, marginTop + 60, 30, 30);

  fill(0);
  text("Population in 1900", graphWidth - 130, marginTop + 30);
  text("Increase in population by 2000", graphWidth - 130, marginTop + 80);
}
