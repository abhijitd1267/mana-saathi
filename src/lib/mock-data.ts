import { PatientProfile, TherapistProfile, JournalEntry, Assessment, RiskFlag, EMOTIONS, Emotion } from './types';

// Mock current user (can be switched for demo)
export const mockUsers = {
  patient: {
    id: 'patient-1',
    name: 'Riya Sharma',
    email: 'riya@example.com',
    role: 'patient' as const,
    locale: 'en' as const,
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b332c5b8?w=150',
    createdAt: new Date('2024-01-15'),
    connectedTherapistId: 'therapist-1',
    consentSettings: {
      shareMood: true,
      shareText: true,
      shareAssessments: true,
      allowNudges: true,
      updatedAt: new Date('2024-02-01')
    }
  } satisfies PatientProfile,
  
  therapist: {
    id: 'therapist-1',
    name: 'Dr. Anita Mehta',
    email: 'dr.mehta@example.com',
    role: 'therapist' as const,
    locale: 'en' as const,
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150',
    createdAt: new Date('2023-08-01'),
    licenseId: 'MH-PSY-2019-001',
    clinicName: 'Serenity Mental Health Clinic',
    patients: ['patient-1', 'patient-2', 'patient-3']
  } satisfies TherapistProfile
};

export const mockPatients: PatientProfile[] = [
  mockUsers.patient,
  {
    id: 'patient-2',
    name: 'Arjun Patel',
    email: 'arjun@example.com',
    role: 'patient',
    locale: 'hi',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    createdAt: new Date('2024-01-20'),
    connectedTherapistId: 'therapist-1',
    consentSettings: {
      shareMood: true,
      shareText: false,
      shareAssessments: true,
      allowNudges: false,
      updatedAt: new Date('2024-02-05')
    }
  },
  {
    id: 'patient-3', 
    name: 'Priya Singh',
    email: 'priya@example.com',
    role: 'patient',
    locale: 'en',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    createdAt: new Date('2024-02-01'),
    connectedTherapistId: 'therapist-1',
    consentSettings: {
      shareMood: true,
      shareText: true,
      shareAssessments: false,
      allowNudges: true,
      updatedAt: new Date('2024-02-10')
    }
  }
];

// Generate mock journal entries for the last 30 days
export const generateMockJournalEntries = (userId: string): JournalEntry[] => {
  const entries: JournalEntry[] = [];
  const emotions: Emotion[] = ['happy', 'sad', 'anxious', 'calm', 'angry', 'love'];
  
  const sampleContents = [
    "Had a good meeting at work today. Feeling more confident about the project.",
    "Couldn't sleep well last night. Mind racing with thoughts about deadlines.",
    "Spent time with family. Always makes me feel grounded and loved.",
    "Feeling overwhelmed with all the responsibilities lately.",
    "Had a peaceful morning walk. Nature really helps calm my mind.",
    "Argument with a friend left me feeling unsettled.",
    "Accomplished a task I'd been putting off. Small wins matter.",
    "Feeling grateful for the support system around me.",
    "Anxious about the upcoming presentation next week.",
    "Meditation session helped center my thoughts today."
  ];

  for (let i = 0; i < 30; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    // Some days have multiple entries
    const entriesPerDay = Math.random() > 0.7 ? 2 : 1;
    
    for (let j = 0; j < entriesPerDay; j++) {
      const entryDate = new Date(date);
      entryDate.setHours(Math.floor(Math.random() * 24));
      
      entries.push({
        id: `entry-${userId}-${i}-${j}`,
        userId,
        content: sampleContents[Math.floor(Math.random() * sampleContents.length)],
        emotion: emotions[Math.floor(Math.random() * emotions.length)],
        tags: ['daily', 'work', 'family', 'sleep'][Math.floor(Math.random() * 4)] ? 
          [['daily', 'work', 'family', 'sleep'][Math.floor(Math.random() * 4)]] : [],
        sharedScope: Math.random() > 0.3 ? 'therapist' : 'none',
        createdAt: entryDate,
        updatedAt: entryDate
      });
    }
  }
  
  return entries.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
};

export const mockJournalEntries = generateMockJournalEntries('patient-1');

// Mock assessments
export const mockAssessments: Assessment[] = [
  {
    id: 'assessment-1',
    userId: 'patient-1',
    type: 'PHQ9',
    answers: { 0: 1, 1: 2, 2: 1, 3: 1, 4: 0, 5: 1, 6: 1, 7: 0, 8: 0 },
    score: 7,
    createdAt: new Date('2024-02-15')
  },
  {
    id: 'assessment-2',
    userId: 'patient-1',
    type: 'GAD7',
    answers: { 0: 2, 1: 2, 2: 1, 3: 1, 4: 0, 5: 1, 6: 1 },
    score: 8,
    createdAt: new Date('2024-02-15')
  },
  {
    id: 'assessment-3',
    userId: 'patient-1',
    type: 'PHQ9',
    answers: { 0: 2, 1: 1, 2: 2, 3: 2, 4: 1, 5: 1, 6: 1, 7: 0, 8: 0 },
    score: 10,
    createdAt: new Date('2024-02-01')
  }
];

// Mock risk flags
export const mockRiskFlags: RiskFlag[] = [
  {
    id: 'risk-1',
    patientId: 'patient-2',
    severity: 'high',
    source: 'assessment',
    note: 'PHQ-9 score of 15 indicates moderate-severe depression',
    createdAt: new Date('2024-02-20'),
  },
  {
    id: 'risk-2', 
    patientId: 'patient-1',
    severity: 'medium',
    source: 'journal',
    note: 'Multiple entries expressing sleep disturbances and fatigue',
    createdAt: new Date('2024-02-18'),
    acknowledgedBy: 'therapist-1',
    acknowledgedAt: new Date('2024-02-19')
  }
];

export const getCurrentUser = (): PatientProfile | TherapistProfile => {
  const userType = localStorage.getItem('sahaay-user-type') || 'patient';
  return mockUsers[userType as keyof typeof mockUsers];
};

export const setCurrentUser = (userType: 'patient' | 'therapist') => {
  localStorage.setItem('sahaay-user-type', userType);
};