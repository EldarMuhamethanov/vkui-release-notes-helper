export type SectionType =
  | 'breaking-change'
  | 'improvement'
  | 'fix'
  | 'documentation'
  | 'new-component'
  | 'dependency';

type ComponentChangeData = {
  type: 'component';
  component: string;
  description: string;
  additionalInfo?: string;
};

type UnknownChangeData = {
  type: 'unknown';
  description: string;
  additionalInfo?: string;
};

export type ChangeData = ComponentChangeData | UnknownChangeData;

export type ReleaseNoteData = {
  type: SectionType;
  data: ChangeData[];
};
