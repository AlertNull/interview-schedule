#!/usr/bin/env node
const axios = require('axios');
const fs = require('fs');
const config = require('./config.json');
const API = `https://api.github.com/repos/${config.username}/${config.repo}`;
const RepoUrl = `https://github.com/${config.username}/${config.repo}`;
const ANCHOR_NUMBER = 5;
const TOKEN = process.argv.slice(2)[0];

async function getIssues(params) {
  const { data } = await axios.get(`${API}/issues?access_token=${TOKEN}`, {
    params,
  });
  return data;
}

async function getLabels() {
  const { data } = await axios.get(`${API}/labels?access_token=${TOKEN}`);
  return data;
}

// 添加 readme item
function addIssueItemInfo(issue) {
  const time = String(issue['updated_at']).substring(0, 10);
  return `- [${issue.title}](${issue['html_url']}) -- ${time}\n`;
}

function isEmpty(arr) {
  return arr.length === 0;
}

async function updateReadme() {
  const schedule = fs.readFileSync('./schedule.md');
  console.log(schedule);
  const labels = await getLabels();
  let readme = `
# 我的 2021 秋招 

汇总自己 2021 秋招经历，整理笔试题以及面经，使用 [Issues](${RepoUrl}/issues) 进行进度管理，自动同步 [Google Calendar](https://calendar.google.com/) 的面试日程。

## 面试日程

${schedule}

`;

  for (let i = 0; i < labels.length; i++) {
    const label = labels[i];
    let partMD = `## ${label.name}\n`;
    const issuesWithLabel = await getIssues({ labels: label.name });
    if (isEmpty(issuesWithLabel)) {
      continue;
    }
    issuesWithLabel.forEach((issue, index) => {
      if (index === ANCHOR_NUMBER) {
        partMD += '<details><summary>显示更多</summary>\n';
        partMD += '\n';
      }
      partMD += addIssueItemInfo(issue);
      if (index === issuesWithLabel.length - 1 && index >= ANCHOR_NUMBER) {
        partMD += '</details>\n';
        partMD += '\n';
      }
    });
    readme += partMD;
  }

  fs.writeFileSync('./README.md', readme, 'utf8');
}

updateReadme();