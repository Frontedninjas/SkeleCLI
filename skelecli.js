#!/usr/bin/env node
import inquirer from 'inquirer';
import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import welcome from "conwelcome";
import createDirectoryContents from './createDirectoryContents.js';

const CURR_DIR = process.cwd();
const __dirname = dirname(fileURLToPath(import.meta.url));

const getTemplateChoices = () => {
  try {
    return fs.readdirSync(path.join(__dirname, 'templates'));
  } catch (err) {
    console.error('Error reading templates directory:', err);
    process.exit(1);
  }
};
welcome({
	title: `Blueprint CLI`,
	tagLine: `by sumangal karan`,
	description: `Blueprint CLI is  the best CLI tool for creating new projects!`,
	bgColor: `#2b28de`,
	color: `#000000`,
	bold: true,
	clear: true,
	version: `1.0.0`
});

const QUESTIONS = [
  {
    name: 'projectChoice',
    type: 'list',
    message: 'What project template would you like to generate?',
    choices: getTemplateChoices(),
  },
  {
    name: 'projectName',
    type: 'input',
    message: 'Project name:',
    validate: input =>
      /^([A-Za-z\-\_\d\.])+$/.test(input) || 'Project name may only include letters, numbers, underscores, and dashes.',
  },
];

inquirer.prompt(QUESTIONS).then(answers => {
  const { projectChoice, projectName } = answers;
  const templatePath = path.join(__dirname, 'templates', projectChoice);
  // const projectPath = path.join(CURR_DIR, projectName);
  const projectPath = projectName === '.' ? CURR_DIR : path.join(CURR_DIR, projectName);

  if (!fs.existsSync(templatePath)) {
    console.error('Selected template does not exist. Please check your templates folder.');
    process.exit(1);
  }

  try {
    if (fs.existsSync(projectPath) && projectName !== '.') {
      console.error('Project folder already exists. Please choose a different name.');
      process.exit(1);
    }
    if(projectPath!=='.' && !fs.existsSync(projectPath)){
      fs.mkdirSync(projectPath);
    }

    // fs.mkdirSync(projectPath);
    createDirectoryContents(templatePath, projectName);
    console.log(`\n✅ Project ${projectName === '.' ? 'created in current directory' : projectName} successfully!`);
  } catch (err) {
    console.error('Error creating project:', err);
    process.exit(1);
  }
});