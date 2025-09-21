export interface TransformPayload {
  title: string;
  content: string;
}

export interface TransformConfig {
  apiEndpoint: string;
  watchDir: string;
  outputDir: string;
}

export interface LLMProvider {
  transform(payload: TransformPayload): Promise<TransformPayload>;
}
