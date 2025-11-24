export enum GenerationType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE'
}

export interface GeneratedImageResult {
  imageUrl: string;
  description?: string;
}

export interface HairStyleState {
  userImage: string | null; // Base64 data URL
  refImage: string | null; // Base64 data URL
  prompt: string;
  generationType: GenerationType;
  isGenerating: boolean;
  result: GeneratedImageResult | null;
  error: string | null;
}
