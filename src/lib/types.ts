export type UserRole = 'patient' | 'therapist' | 'admin';

export type Emotion = 'happy' | 'sad' | 'angry' | 'anxious' | 'calm' | 'love';

export type ShareScope = 'none' | 'therapist' | 'therapist_ai';

export type AssessmentType = 'PHQ9' | 'GAD7';

export type RiskLevel = 'low' | 'medium' | 'high';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  locale: 'en' | 'hi';
  avatar?: string;
  createdAt: Date;
}

export interface PatientProfile extends User {
  role: 'patient';
  connectedTherapistId?: string;
  consentSettings: ConsentSettings;
}

export interface TherapistProfile extends User {
  role: 'therapist';
  licenseId?: string;
  clinicName?: string;
  patients: string[];
}

export interface JournalEntry {
  id: string;
  userId: string;
  content: string;
  emotion: Emotion;
  tags: string[];
  sharedScope: ShareScope;
  createdAt: Date;
  updatedAt: Date;
  redactedAt?: Date;
}

export interface Assessment {
  id: string;
  userId: string;
  type: AssessmentType;
  answers: Record<string, number>;
  score: number;
  createdAt: Date;
}

export interface ConsentSettings {
  shareMood: boolean;
  shareText: boolean;
  shareAssessments: boolean;
  allowNudges: boolean;
  updatedAt: Date;
}

export interface RiskFlag {
  id: string;
  patientId: string;
  severity: RiskLevel;
  source: 'assessment' | 'journal' | 'manual';
  note: string;
  createdAt: Date;
  acknowledgedBy?: string;
  acknowledgedAt?: Date;
}

export interface Message {
  id: string;
  threadKey: string;
  fromUserId: string;
  toUserId: string;
  body: string;
  createdAt: Date;
  readAt?: Date;
}

export interface EmotionData {
  emotion: Emotion;
  label: string;
  emoji: string;
  color: string;
}

export const EMOTIONS: Record<Emotion, EmotionData> = {
  happy: { emotion: 'happy', label: 'Happy', emoji: '😊', color: 'emotion-happy' },
  sad: { emotion: 'sad', label: 'Sad', emoji: '😢', color: 'emotion-sad' },
  angry: { emotion: 'angry', label: 'Angry', emoji: '😠', color: 'emotion-angry' },
  anxious: { emotion: 'anxious', label: 'Anxious', emoji: '😰', color: 'emotion-anxious' },
  calm: { emotion: 'calm', label: 'Calm', emoji: '😌', color: 'emotion-calm' },
  love: { emotion: 'love', label: 'Love', emoji: '❤️', color: 'emotion-love' }
};

export const PHQ9_QUESTIONS = [
  "Little interest or pleasure in doing things",
  "Feeling down, depressed, or hopeless", 
  "Trouble falling or staying asleep, or sleeping too much",
  "Feeling tired or having little energy",
  "Poor appetite or overeating",
  "Feeling bad about yourself — or that you are a failure or have let yourself or your family down",
  "Trouble concentrating on things, such as reading the newspaper or watching television",
  "Moving or speaking so slowly that other people could have noticed? Or the opposite — being so fidgety or restless that you have been moving around a lot more than usual",
  "Thoughts that you would be better off dead or of hurting yourself in some way"
];

export const GAD7_QUESTIONS = [
  "Feeling nervous, anxious or on edge",
  "Not being able to stop or control worrying",
  "Worrying too much about different things", 
  "Trouble relaxing",
  "Being so restless that it is hard to sit still",
  "Becoming easily annoyed or irritable",
  "Feeling afraid as if something awful might happen"
];