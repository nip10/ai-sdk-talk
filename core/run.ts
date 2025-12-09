#!/usr/bin/env node

import { input, select } from '@inquirer/prompts';
import chalk from 'chalk';
import { readdir } from 'fs/promises';
import { join, relative } from 'path';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface DemoFile {
  name: string;
  path: string;
  category: string;
}

async function findDemoFiles(dir: string): Promise<DemoFile[]> {
  const files: DemoFile[] = [];

  async function scan(currentDir: string, category: string = '') {
    const entries = await readdir(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = join(currentDir, entry.name);

      if (entry.isDirectory()) {
        await scan(fullPath, entry.name);
      } else if (entry.isFile() && entry.name.endsWith('.ts')) {
        files.push({
          name: entry.name,
          path: fullPath,
          category: category,
        });
      }
    }
  }

  await scan(dir);
  return files.sort((a, b) => {
    // Sort by category first, then by name
    if (a.category !== b.category) {
      return a.category.localeCompare(b.category);
    }
    return a.name.localeCompare(b.name);
  });
}

function runDemo(filePath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    console.log(chalk.cyan(`\n▶ Running: ${relative(process.cwd(), filePath)}\n`));
    console.log(chalk.gray('─'.repeat(60)));

    const startTime = Date.now();

    const child = spawn('tsx', [filePath], {
      stdio: 'inherit',
      shell: true,
    });

    child.on('close', (code) => {
      const elapsedMs = Date.now() - startTime;
      const elapsedSeconds = (elapsedMs / 1000).toFixed(2);
      console.log(chalk.gray('─'.repeat(60)));
      if (code === 0) {
        console.log(chalk.green(`\n✓ Demo completed successfully (${elapsedSeconds}s)\n`));
        resolve();
      } else {
        console.log(chalk.red(`\n✗ Demo exited with code ${code}\n`));
        reject(new Error(`Process exited with code ${code}`));
      }
    });

    child.on('error', (error) => {
      console.error(chalk.red(`\n✗ Error running demo: ${error.message}\n`));
      reject(error);
    });
  });
}

async function main() {
  const demosDir = join(__dirname, 'demos');
  const demoFiles = await findDemoFiles(demosDir);

  if (demoFiles.length === 0) {
    console.log(chalk.yellow('No demo files found in the demos directory.'));
    return;
  }

  const choices = demoFiles.map((file) => ({
    name: chalk.white(`${chalk.cyan(`[${file.category}]`)} ${file.name}`),
    value: file.path,
    description: relative(demosDir, file.path),
  }));

  while (true) {
    console.clear();
    console.log(chalk.bold.blue('\n🚀 AI SDK Demo Runner\n'));

    try {
      const selectedFile = await select({
        message: 'Select a demo to run:',
        choices,
        pageSize: 15,
      });

      await runDemo(selectedFile);

      await input({
        message: chalk.gray('Press Enter to go back to the menu'),
        default: '',
      });
    } catch (error) {
      if (error instanceof Error && error.name === 'ExitPromptError') {
        console.log(chalk.yellow('\n👋 Cancelled\n'));
        return;
      }
      throw error;
    }
  }
}

main().catch((error) => {
  console.error(chalk.red('Error:'), error);
  process.exit(1);
});

