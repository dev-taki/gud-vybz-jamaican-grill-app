#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🚀 Redux Template Setup\n');

const questions = [
  {
    name: 'appName',
    question: 'What is your app name? ',
    default: 'My Redux App'
  },
  {
    name: 'apiBaseUrl',
    question: 'What is your API base URL? ',
    default: 'https://api.example.com'
  },
  {
    name: 'businessId',
    question: 'What is your business ID? ',
    default: 'your-business-id'
  }
];

const answers = {};

function askQuestion(index) {
  if (index >= questions.length) {
    finishSetup();
    return;
  }

  const question = questions[index];
  rl.question(question.question, (answer) => {
    answers[question.name] = answer || question.default;
    askQuestion(index + 1);
  });
}

function finishSetup() {
  console.log('\n📝 Creating configuration files...\n');

  // Create .env.local file
  const envContent = `# API Configuration
NEXT_PUBLIC_API_BASE_URL=${answers.apiBaseUrl}
NEXT_PUBLIC_BUSINESS_ID=${answers.businessId}

# App Configuration
NEXT_PUBLIC_APP_NAME="${answers.appName}"
`;

  fs.writeFileSync('.env.local', envContent);
  console.log('✅ Created .env.local');

  // Update app config
  const appConfigPath = path.join(__dirname, '../app/config/app.ts');
  let appConfig = fs.readFileSync(appConfigPath, 'utf8');
  appConfig = appConfig.replace(
    /name: 'Redux Template'/,
    `name: '${answers.appName}'`
  );
  appConfig = appConfig.replace(
    /description: 'A modern, scalable Next.js template with Redux Toolkit'/,
    `description: '${answers.appName} - Built with Redux Template'`
  );
  fs.writeFileSync(appConfigPath, appConfig);
  console.log('✅ Updated app configuration');

  // Update package.json
  const packagePath = path.join(__dirname, '../package.json');
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  packageJson.name = answers.appName.toLowerCase().replace(/\s+/g, '-');
  packageJson.description = `${answers.appName} - Built with Redux Template`;
  fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
  console.log('✅ Updated package.json');

  console.log('\n🎉 Setup complete!');
  console.log('\nNext steps:');
  console.log('1. Run "npm install" to install dependencies');
  console.log('2. Run "npm run dev" to start development server');
  console.log('3. Visit http://localhost:3000 to see your app');
  console.log('4. Check the README.md for detailed documentation');
  console.log('\nHappy coding! 🚀');

  rl.close();
}

askQuestion(0);
