const { google } = require('googleapis');
const markdownTable = require('markdown-table');
const fs = require('fs');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
dayjs.extend(utc)

const [calendar_id, client_id, client_secret, access_token, refresh_token] = process.argv.slice(2);
const redirect_uri = 'https://mayandev.top';
const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uri);

oAuth2Client.setCredentials({
  access_token,
  refresh_token,
  scope: 'https://www.googleapis.com/auth/calendar.readonly',
  token_type: 'Bearer'
});

async function listEvents(auth) {
  const calendar = google.calendar({ version: 'v3', auth });
  const { data } = await calendar.events.list({
    calendarId: calendar_id,
    timeMin: new Date().toISOString(),
    maxResults: 10,
    singleEvents: true,
    orderBy: 'startTime',
  });
  const events = data.items || [];


  const table = events.map((event) => {
    const start = dayjs(event.start.dateTime || event.start.date).utcOffset(8).format('MM/DD HH:mm');;
    const { summary, htmlLink } = event;
    return [start, `[${summary}](${htmlLink})`];
  });
  table.unshift(['时间', '日程']);
  fs.writeFileSync('./schedule.md', markdownTable(table), 'utf8');
}

listEvents(oAuth2Client);
