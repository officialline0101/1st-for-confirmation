const CALENDAR_ID = 'b6d552a065b92516d4af5c10e1e2b70070da63d0e84dbb3111518a92fe067f5b@group.calendar.google.com';
const HOLIDAY_CALENDAR_ID = 'ja.japanese#holiday@group.calendar.google.com';

function doGet() {
  return HtmlService.createHtmlOutputFromFile('index');
}

function checkAvailability(date) {
  const calendar = CalendarApp.getCalendarById(CALENDAR_ID);
  const holidayCalendar = CalendarApp.getCalendarById(HOLIDAY_CALENDAR_ID);
  const startTime = new Date(date);
  const endTime = new Date(date);
  endTime.setDate(endTime.getDate() + 1);
  
  const events = calendar.getEvents(startTime, endTime);
  const holidays = holidayCalendar.getEvents(startTime, endTime);
  
  let availability;
  if (events.length >= 10) {
    availability = '×'; // 全て予約済み
  } else if (events.length >= 4) {
    availability = '△'; // 一部予約済み
  } else {
    availability = '○'; // 予約なしまたは少数
  }
  
  return availability;
}

function getMonthlyAvailability(year, month) {
  const calendar = CalendarApp.getCalendarById(CALENDAR_ID);
  const startTime = new Date(year, month, 1);
  const endTime = new Date(year, month + 1, 0);
  const events = calendar.getEvents(startTime, endTime);
  
  const availability = {};
  
  for (let date = startTime; date <= endTime; date.setDate(date.getDate() + 1)) {
    const currentDate = new Date(date);
    const currentDateString = currentDate.toISOString().split('T')[0];
    
    const dayEvents = events.filter(event => {
      const eventDate = event.getStartTime();
      return eventDate.getFullYear() === currentDate.getFullYear() &&
             eventDate.getMonth() === currentDate.getMonth() &&
             eventDate.getDate() === currentDate.getDate();
    });
    
    if (dayEvents.length >= 10) {
      availability[currentDateString] = '×';
    } else if (dayEvents.length >= 4) {
      availability[currentDateString] = '△';
    } else {
      availability[currentDateString] = '○';
    }
  }
  
  return availability;
}
