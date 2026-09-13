// app.js —— 城市天气数据看板
const state = { data: null, cityIndex: 0 };

// 读取本地 JSON：加载中 / 失败 / 空数据 三种状态都有明确提示，不白屏
const loadData = async () => {
  $('#status').text('加载中…').addClass('alert-info').removeClass('alert-warning').show();
  try {
    const response = await fetch('data/weather.json');
    if (!response.ok) {
      throw new Error('HTTP ' + response.status);
    }
    const data = await response.json();
    if (!data.cities || data.cities.length === 0) {
      $('#status').removeClass('alert-info').addClass('alert-warning')
        .text('暂无数据').show();
      return;
    }
    state.data = data;
    $('#status').hide();
    $('#sub-title').text(data.title + ' · 数据来源：' + data.source);
    renderTabs();
    renderCity();
  } catch (error) {
    $('#status').removeClass('alert-info').addClass('alert-warning')
      .text('加载失败：' + error.message).show();
  }
};

// 城市切换按钮（jQuery 事件委托：点击切换当前城市并重绘）
const renderTabs = () => {
  state.data.cities.forEach((c, i) => {
    $('#city-tabs').append(
      `<button class="btn btn-outline-primary city-btn" data-index="${i}">${c.city}</button>`
    );
  });
  $('#city-tabs').on('click', '.city-btn', function () {
    state.cityIndex = Number($(this).data('index'));
    renderCity();
  });
};

// 当前城市的全部内容：高亮按钮 + 卡片 + 两张图
const renderCity = () => {
  const city = state.data.cities[state.cityIndex];
  $('#city-tabs .city-btn').removeClass('btn-primary')
    .addClass('btn-outline-primary');
  $('#city-tabs .city-btn').eq(state.cityIndex)
    .removeClass('btn-outline-primary').addClass('btn-primary');

  if (!city.days || city.days.length === 0) {
    $('#status').text(city.city + ' 暂无天气数据').show();
    return;
  }
  $('#status').hide();
  renderCards(city);
  renderBarChart(city);
  renderLineChart(city);
};

// 统计卡片：平均最高温 / 平均最低温 / 累计降水 / 平均湿度
const renderCards = (city) => {
  const days = city.days;
  const avg = (arr) => (arr.reduce((s, n) => s + n, 0) / arr.length).toFixed(1);
  const totalRain = days.reduce((s, d) => s + d.rain, 0);
  const cards = [
    { label: '平均最高气温', value: avg(days.map(d => d.high)), unit: '℃' },
    { label: '平均最低气温', value: avg(days.map(d => d.low)), unit: '℃' },
    { label: '本周累计降水', value: totalRain, unit: 'mm' },
    { label: '平均相对湿度', value: avg(days.map(d => d.humidity)), unit: '%' }
  ];
  $('#cards').empty();
  cards.forEach(c => {
    $('#cards').append(`
      <div class="col-md-3 col-6">
        <div class="card text-center">
          <div class="card-body">
            <h3 class="card-title h6">${c.label}</h3>
            <p class="card-text fs-4 mb-0">${c.value}<small class="text-muted"> ${c.unit}</small></p>
          </div>
        </div>
      </div>
    `);
  });
};

const renderBarChart = (city) => {
  // 第二步实现
};

const renderLineChart = (city) => {
  // 第三步实现
};

loadData();
