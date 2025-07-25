import { NeuralNetwork } from 'brain.js';

export const createModel = () => {
  return new NeuralNetwork({
    activation: 'leaky-relu',
    hiddenLayers: [128, 64],
    learningRate: 0.01
  });
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const saveModel = (model: any, key = 'tic-tac-toe-ai-model') => {
  const modelData = model.toJSON();
  localStorage.setItem(key, JSON.stringify(modelData));
};

export const loadModel = (key = 'tic-tac-toe-ai-model') => {
  const modelData = localStorage.getItem(key);
  if (!modelData) return null;
  
  const model = createModel();
  model.fromJSON(JSON.parse(modelData));
  return model;
};