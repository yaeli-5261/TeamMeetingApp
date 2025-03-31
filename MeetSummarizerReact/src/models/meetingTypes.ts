
export interface MeetingState {
    meetings: MeetingDTO[];
    loading: boolean;
    error: string | null;
  }
  
export  const initialState: MeetingState = {
    meetings: [],
    loading: false,
    error: null,
  };
  
  export interface MeetingDTO {
    id: number
    name: string
    date: string
    linkTranscriptFile?: string
    linkOrinignFile?: string
    teamId: number
    deletedAt?: string // Added for trash functionality
  }
  
  export interface MeetingPostDTO {
    name: string
    date: string
    linkTranscriptFile?: string
    linkOrinignFile?: string
    teamId: number
  }
  
  