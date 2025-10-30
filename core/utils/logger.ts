import type { StepResult } from "ai";
import type { tools } from "../demos/aisdk/6-agent.js";

export const log = (steps: StepResult<typeof tools>[]) => {
  console.log('\n\n');
  for (let i = 0; i < steps.length; i++) {
    console.log('>>> In Step', i + 1);
    const step = steps[i];
    if (step) {
      for (const content of step.content) {
        console.log(`>> Type: ${content.type}`);
        if (content.type === 'text') {
          console.log(`> Text: ${content.text}`);
        } else if (content.type === 'tool-call') {
          console.log(`> Tool Call - Name: ${content.toolName}, Input: ${JSON.stringify(content.input)}`);
        } else if (content.type === 'tool-result') {
          console.log(`> Tool Result - Name: ${content.toolName}, Output: ${JSON.stringify(content.output)}`);
        } else if (content.type === 'tool-error') {
          console.log(`> Tool Error - Name: ${content.toolName}, Error: ${JSON.stringify(content.error)}`);
        }
      }
      console.log('\n');
    } else {
      console.log('Step is undefined');
    }
  }
}