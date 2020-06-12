
const colorPattern = [
  "#2ec7c9",
  "#b6a2de",
  "#5ab1ef",
  "#ffb980",
  "#d87a80",
  "#8d98b3",
  "#e5cf0d",
  "#97b552",
  "#95706d",
  "#dc69aa",
  "#07a2a4",
  "#9a7fd1",
  "#588dd5",
  "#f5994e",
  "#c05050",
  "#59678c",
  "#c9ab00",
  "#7eb00a",
  "#6f5553",
  "#c14089"
];

function parseData() {
  Papa.parse('./data/cars.csv', {
    download: true,
    complete: (res) => {
      res.data.shift()
      chartByYear(res.data)
      chartByCompany(res.data)
      chartByKw(res.data)
    }
  })
}

parseData()

// 0: (5)["YEAR", "Make", "Model", "Size", "(kW)"]
// 1: (5)["2012", "MITSUBISHI", "i-MiEV", "SUBCOMPACT", "49"]
// 2: (5)["2012", "NISSAN", "LEAF", "MID-SIZE", "80"]
// 3: (5)["2013", "FORD", "FOCUS ELECTRIC", "COMPACT", "107"]
// 4: (5)["2013", "MITSUBISHI", "i-MiEV", "SUBCOMPACT", "49"]

function chartByYear(data) {
  let parse = data.reduce((obj, item) => {
    if (!obj[item[0]]) obj[item[0]] = 1
    obj[item[0]]++
    return obj
  }, {})

  let year = Object.entries(parse).map(item => item[0])
  let value = Object.entries(parse).map(item => item[1])

  year.unshift('年分')
  value.unshift('數量')

  let chart = c3.generate({
    bindto: '#chartYear',
    data: {
      x: '年分',
      columns: [
        year,
        value
      ],
      type: 'bar',
      labels: true
    },
    axis: {
      x: {
        label: '年份'
      },
      y: {
        label: '數量'
      },
    },
    bar: {
      width: {
        ratio: 0.5
      }
    },
    color: {
      pattern: colorPattern
    }
  });

}

function chartByCompany(data) {
  let parse = data.reduce((obj, item) => {
    if (!obj[item[1]]) obj[item[1]] = 1
    obj[item[1]]++
    return obj
  }, {})


  let chart = c3.generate({
    bindto: '#chartCompany',
    data: {
      columns: Object.entries(parse),
      type: 'pie'
    },
    color: {
      pattern: colorPattern
    }
  });
}

function chartByKw(data) {
  let parse = data.reduce((obj, item) => {
    if (!obj[item[3]]) {
      obj[item[3]] = [parseInt(item[4]), 1, parseInt(item[4])]
    } else {
      obj[item[3]][0] += parseInt(item[4])
      obj[item[3]][1]++
      obj[item[3]][2] = parseFloat((obj[item[3]][0] / obj[item[3]][1]).toFixed(1))
    }

    return obj
  }, {});

  let parseRank = Object.entries(parse).sort((a, b) => a[1][2] > b[1][2] ? 1 : -1)

  let genre = parseRank.map((item) => item[0])
  let kwAvg = parseRank.map((item) => item[1][2])


  genre.unshift('size')
  kwAvg.unshift('kW')

  let chart = c3.generate({
    bindto: '#chartKw',
    data: {
      x: 'size',
      columns: [
        genre,
        kwAvg
      ],
      type: 'bar',
      labels: true
    },
    axis: {
      rotated: true,
      x: {
        type: 'category',
      }
    },
    bar: {
      width: {
        ratio: 0.5
      }
    },
    color: {
      pattern: colorPattern
    }
  });
}